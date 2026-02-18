# LagSkillArena - Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- GitHub account
- Vercel account (free tier)
- Railway/Render account (free tier)
- MongoDB Atlas account (free tier)

---

## 📦 Backend Deployment (Railway)

### Step 1: Prepare Backend for Production

1. **Update requirements.txt** (if needed):
```bash
cd backend
pip freeze > requirements.txt
```

2. **Create Procfile** in backend folder:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

3. **Create runtime.txt** in backend folder:
```
python-3.11.0
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/lagskill_arena
DATABASE_NAME=lagskill_arena
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAIL=admin@lagskill.com
ADMIN_PASSWORD=Admin@123
ENVIRONMENT=production
```

6. Deploy and note your backend URL (e.g., `https://your-app.railway.app`)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API URL

1. Create `.env.production` in frontend folder:
```
VITE_API_URL=https://your-backend-url.railway.app
```

2. Update API calls to use environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
```
VITE_API_URL=https://your-backend-url.railway.app
```

6. Deploy and note your frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)

### Step 2: Get Connection String

1. Click "Connect" → "Connect your application"
2. Copy connection string
3. Replace `<password>` with your database password
4. Use this in Railway environment variables

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "http://localhost:5173"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Test Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Upload a video
4. Check if analysis works
5. Verify leaderboard loads

---

## 📊 Monitoring & Logs

### Railway Logs
- Go to your Railway project
- Click "Deployments" → "View Logs"
- Monitor for errors

### Vercel Logs
- Go to your Vercel project
- Click "Deployments" → Select deployment → "View Function Logs"

---

## 🐛 Common Issues & Fixes

### Issue: CORS Errors
**Fix**: Update `allow_origins` in backend to include your Vercel URL

### Issue: MongoDB Connection Failed
**Fix**: 
- Check connection string format
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### Issue: Video Upload Fails
**Fix**: 
- Railway free tier has limited storage
- Consider using AWS S3 or Cloudinary for video storage

### Issue: Build Fails on Vercel
**Fix**:
- Check `package.json` for correct dependencies
- Verify build command is `npm run build`
- Check Node version compatibility

---

## 💰 Cost Estimate

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: 500 hours/month, 1GB RAM
- **MongoDB Atlas**: 512MB storage

### Upgrade Recommendations
For production with real users:
- **Railway Pro**: $5/month (better performance)
- **MongoDB M10**: $10/month (better performance)
- **Vercel Pro**: $20/month (custom domain, more bandwidth)

---

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` to a strong random string
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS only (automatic with Vercel/Railway)
- [ ] Set up rate limiting (optional)
- [ ] Enable MongoDB IP whitelist (production)

---

## 📝 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Railway
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Share your links:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app`
- Leaderboard: `https://your-app.vercel.app/leaderboard`

---

## 📞 Support

If you encounter issues:
1. Check Railway/Vercel logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection

**Happy deploying! 🚀**
