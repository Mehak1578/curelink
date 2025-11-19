const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const auth = require("../middleware/auth");
const Report = require("../models/Report");

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

    // STEP 1: DOWNLOAD IMAGE FROM CLOUDINARY
    let base64Image;
    let mimeType;

    try {
      const response = await axios.get(report.url, {
        responseType: "arraybuffer",
      });

      // Extract mime type from response headers
      mimeType = response.headers["content-type"];
      
      // Convert buffer to base64
      base64Image = Buffer.from(response.data).toString("base64");

      console.log("📥 Image downloaded. Mime:", mimeType);
    } catch (err) {
      console.error("❌ Image download failed:", err.message);
      return res.status(500).json({
        msg: "Failed to download report image",
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

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: { data: base64Image, mimeType }
                },
                {
                  text: "Analyze this medical report or image. Summarize abnormalities and give simple health insights."
                }
              ]
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

        if (isOverloaded && attempt < maxRetries) {
          console.log(`⚠️ Gemini overloaded (attempt ${attempt}/${maxRetries}). Retrying in ${retryDelay}ms...`);
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
