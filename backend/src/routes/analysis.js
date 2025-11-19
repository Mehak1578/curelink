const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const auth = require("../middleware/auth");
const Report = require("../models/Report");
const { fromPath } = require("pdf2pic");
const os = require("os");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/report/:id", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ msg: "Report not found" });

    if (report.patient.toString() !== req.user.id)
      return res.status(403).json({ msg: "Access denied" });

    console.log("📄 Report URL:", report.url);

    // STEP 1: DOWNLOAD FILE FROM CLOUDINARY (IMAGE OR PDF)
    let base64Image;
    let mimeType;

    try {
      const response = await axios.get(report.url, {
        responseType: "arraybuffer",
      });

      // Extract mime type from response headers
      mimeType = response.headers["content-type"] || "application/octet-stream";
      
      // Ensure we have a proper buffer
      let fileBuffer = Buffer.isBuffer(response.data) 
        ? response.data 
        : Buffer.from(response.data);

      console.log("📥 File downloaded. Size:", fileBuffer.length, "bytes. Mime:", mimeType);

      // Fix MIME type for PDFs - Cloudinary raw resources return octet-stream
      if (report.fileType === "application/pdf" || report.url.endsWith(".pdf")) {
        mimeType = "application/pdf";
        console.log("🔧 Corrected MIME type to application/pdf");
      }

      // Validate buffer is not empty
      if (fileBuffer.length === 0) {
        return res.status(400).json({
          msg: "Downloaded file is empty",
          error: "File has no content"
        });
      }

      // Handle PDF files - convert first page to PNG
      if (mimeType === "application/pdf") {
        console.log("📄 PDF detected - converting first page to PNG...");
        
        try {
          const tempPdfPath = path.join(os.tmpdir(), `report_${Date.now()}.pdf`);
          fs.writeFileSync(tempPdfPath, fileBuffer);

          const outputDir = os.tmpdir();
          const options = {
            density: 200,
            saveFilename: "page",
            savePath: outputDir,
            format: "png",
            width: 2000,
            height: 2000
          };

          const convert = fromPath(tempPdfPath, options);
          await convert(1, { responseType: "image" });
          
          const files = fs.readdirSync(outputDir);
          const generated = files.find(f => f.startsWith("page") && f.endsWith(".png"));
          if (!generated) throw new Error("Poppler did not generate a PNG file");

          const pngPath = path.join(outputDir, generated);
          const pngBuffer = fs.readFileSync(pngPath);
          if (!pngBuffer || pngBuffer.length < 1000) throw new Error("PNG output is empty – PDF conversion failed");

          fileBuffer = pngBuffer;
          mimeType = "image/png";
          
          // Cleanup temp files
          fs.unlinkSync(tempPdfPath);
          fs.unlinkSync(pngPath);
          
          console.log("✅ PDF converted to PNG. Size:", fileBuffer.length, "bytes");
        } catch (err) {
          console.error("❌ PDF → PNG failed:", err.message);
          return res.status(500).json({ 
            msg: "Failed to convert PDF for analysis", 
            error: err.message 
          });
        }
      }
      
      // Convert buffer to base64 for Gemini
      base64Image = fileBuffer.toString("base64");
      
      // Validate base64 conversion
      if (!base64Image || base64Image.length === 0) {
        return res.status(500).json({
          msg: "Failed to encode file",
          error: "Base64 conversion resulted in empty string"
        });
      }

      console.log("📥 File ready for analysis. Base64 length:", base64Image.length, "Mime:", mimeType);
    } catch (err) {
      console.error("❌ File download failed:", err.message);
      return res.status(500).json({
        msg: "Failed to download report file",
        error: err.message,
      });
    }

    // STEP 2: GEMINI VISION REQUEST WITH RETRY
    console.log("🤖 Sending request to Gemini Vision...");

    const maxRetries = 3;
    const retryDelay = 1500; // 1.5 seconds
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash"
        });

        // Validate inputs before sending
        if (!base64Image) {
          throw new Error("Base64 image data is missing");
        }
        if (!mimeType) {
          throw new Error("MIME type is missing");
        }

        // Prepare parts based on file type
        const parts = [];
        
        // Use inlineData for all files (PDFs converted to PNG)
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Image
          }
        });
        
        parts.push({
          text: "Analyze this medical report or image. Summarize abnormalities and give simple health insights."
        });

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: parts
            }
          ]
        });

        console.log("✅ Gemini responded");

        const aiText = result.response.text();

        if (!aiText) {
          return res.status(500).json({
            msg: "Failed to analyze report.",
            error: "Gemini returned no analysis text",
          });
        }

        // STEP 3: SAVE ANALYSIS
        report.analysis = aiText;
        await report.save();

        return res.json({
          success: true,
          analysis: aiText,
        });
      } catch (geminiError) {
        lastError = geminiError;
        const errorMessage = geminiError.message || "";
        const isOverloaded = errorMessage.toLowerCase().includes("overloaded") || 
                            errorMessage.includes("503");

        console.error(`❌ Gemini error (attempt ${attempt}/${maxRetries}):`, errorMessage);

        if (isOverloaded && attempt < maxRetries) {
          console.log(`⚠️ Gemini overloaded. Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        // If not overloaded or retries exhausted, break
        break;
      }
    }

    // All retries exhausted or non-retryable error
    console.error("❌ Gemini error after retries:", lastError.message);
    
    const errorMessage = lastError.message || "";
    const isOverloaded = errorMessage.toLowerCase().includes("overloaded") || 
                        errorMessage.includes("503");
    
    if (isOverloaded) {
      return res.status(503).json({
        msg: "Gemini is currently busy. Please try again."
      });
    }
    
    return res.status(500).json({
      msg: "Failed to analyze report.",
      error: lastError.message,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    return res.status(500).json({
      msg: "Failed to analyze report.",
      error: error?.response?.data || error.message,
    });
  }
});

module.exports = router;
