# 🚀 CureLink Deployment Guide - Render.com

## Prerequisites
- GitHub account with your project repository
- Render account (https://render.com)
- MongoDB Atlas account (for database)
- Cloudinary account (for file uploads)
- Google Gemini API key

---

## Step 1: Prepare Your Repository

✅ **Already Done:**
- `render.yaml` configuration file
- `.env.example` files for reference
- Build scripts configured

Push all changes:
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

---

## Step 2: Set Up Environment Variables on Render

### 2a. Create Backend Service

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the form:
   - **Name:** `curelink-backend`
   - **Runtime:** Node
   - **Branch:** main
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Free Tier:** Select if available (with limitations)

5. Click **"Advanced"** and add Environment Variables:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://mehak24_db_user:mehak15@curelink.v5oppcb.mongodb.net/?appName=CureLink&retryWrites=true&w=majority
JWT_SECRET=1b741e225d516135ac8d39c59f382d4c970f3bcbc622296e9c2dc90a43d1467a
CLOUDINARY_CLOUD_NAME=dqzerlgq0
CLOUDINARY_API_KEY=448365672449695
CLOUDINARY_API_SECRET=pWi-mIaCAGKZw8lmQ-7bb_iMSnY
GEMINI_API_KEY=AIzaSyAi1V17RmZJsPZc4QTPnaUjHcPicEuvkqg
STRIPE_SECRET_KEY=your_stripe_secret_key
```

⚠️ **Security Note:** Consider:
- Changing `JWT_SECRET` to a new secure random value
- Never commit real API keys
- Use Render's secret management for production

6. Click **"Create Web Service"**

### 2b. Create Frontend Service

1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository (same one)
4. Fill in the form:
   - **Name:** `curelink-frontend`
   - **Branch:** main
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish directory:** `frontend/dist`

5. Click **"Advanced"** and add Environment Variable:

```
VITE_API_URL=https://curelink-backend.onrender.com
```

(Replace `curelink-backend` with your actual backend service name from Step 2a)

6. Click **"Create Static Site"**

---

## Step 3: Configure MongoDB Atlas

Your MongoDB is already set up. Just ensure:

1. Go to https://cloud.mongodb.com
2. Click your cluster: **CureLink**
3. Go to **Network Access** → **IP Whitelist**
4. Add Render's IP or use `0.0.0.0/0` for development:
   - Click **"Add IP Address"**
   - Enter: `0.0.0.0/0` (Allow from anywhere - use IP whitelist in production)
   - Click **"Confirm"**

---

## Step 4: Update CORS Settings (Backend)

Your backend already has CORS configured. Verify in `backend/src/index.js`:

```javascript
app.use(cors({ origin: '*' }));
```

For production, update to:
```javascript
app.use(cors({ 
  origin: 'https://curelink-frontend.onrender.com',
  credentials: true 
}));
```

---

## Step 5: Monitor Deployment

### Backend Status
1. Go to your backend service on Render
2. Check **"Logs"** tab for any errors
3. Verify it says **"Live"** (not "Build in progress")

Expected output:
```
Server running on port 10000
✅ MongoDB Connected Successfully!
```

### Frontend Status
1. Go to your frontend service on Render
2. Check **"Logs"** tab
3. Verify it says **"Live"**
4. Click the service URL to view your site

---

## Step 6: Test Your Deployment

1. Open your frontend URL (e.g., `https://curelink-frontend.onrender.com`)
2. Test features:
   - ✅ Login/Register
   - ✅ Upload reports
   - ✅ Analyze PDFs/images with Gemini
   - ✅ Book appointments
   - ✅ View doctors

---

## Troubleshooting

### Backend won't start
```
Error: MongoDB connection failed
```
**Solution:** Check MongoDB Atlas IP whitelist and connection string

### Frontend build fails
```
error during build: [vite:terser] terser not found
```
**Solution:** Already fixed - terser is now installed

### API calls failing (CORS)
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update CORS origin in backend to match frontend URL

### Environment variables not loaded
```
Solution: Restart the service on Render
- Go to Service → Settings → Restart
```

---

## Important Notes

### Free Tier Limitations
- Backend: Spins down after 15 min of inactivity
- First request takes 30-60 seconds to wake up
- For production: Upgrade to Paid tier

### Cost Optimization
- Backend: $0.29/day (Free tier) or $7/month (Starter)
- Frontend: Free static hosting
- MongoDB Atlas: Free 512MB tier (perfect for development)

### Security Checklist
- [ ] Change JWT_SECRET to a new random value
- [ ] Use environment variables for all secrets
- [ ] Update MongoDB IP whitelist for production
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set up monitoring/alerts

---

## Useful Commands

### View logs in real-time
```bash
# On Render dashboard → Service → Logs
```

### Force rebuild
```
Render Dashboard → Service → Settings → Rebuild
```

### Manual deployment
Every `git push` to main automatically triggers a new deploy

---

## Next Steps

1. ✅ Deploy both services
2. ✅ Test all features
3. ✅ Set up custom domain (optional)
4. ✅ Configure error monitoring
5. ✅ Set up backups for MongoDB

---

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.mongodb.com/atlas
- GitHub: https://github.com/Mehak1578/Project-CureLink

---

**🎉 Your CureLink application is now ready for production!**
