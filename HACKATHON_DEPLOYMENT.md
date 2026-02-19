# 🚀 LagSkillArena - Hackathon Deployment Guide

## Quick Decision: Which Deployment?

### Option A: Full Cloud Deployment (Render + Vercel)
**Time**: 2-3 hours  
**Best for**: If judges will test it themselves  
**Pros**: Fully online, shareable link  
**Cons**: Video processing might be slow on free tier

### Option B: Hybrid (Vercel + Local Backend + ngrok)
**Time**: 30 minutes  
**Best for**: Live demo presentation  
**Pros**: Fast video processing, easy setup  
**Cons**: Need to run backend during demo

**Recommendation**: Start with Option B, upgrade to Option A if needed.

---

## 🎯 OPTION A: Full Cloud Deployment

### Step 1: MongoDB Atlas (5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create FREE cluster (M0)
4. Create database user:
   - Username: `lagskill_user`
   - Password: (generate strong password, save it!)
5. Network Access → Add IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy: `mongodb+srv://lagskill_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

### Step 2: Backend on Render (20 minutes)

1. **Create files in backend folder:**

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: lagskill-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

2. **Go to [render.com](https://render.com)**
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select repository: `lagskill-arena`

3. **Configure:**
   - Name: `lagskill-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: `Free`

4. **Add Environment Variables:**
   ```
   MONGODB_URL=mongodb+srv://lagskill_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=lagskill_arena
   SECRET_KEY=hackathon-super-secret-key-2026-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ADMIN_EMAIL=admin@lagskill.com
   ADMIN_PASSWORD=Admin@123
   ENVIRONMENT=production
   ```

5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. **Save your backend URL**: `https://lagskill-backend.onrender.com`

### Step 3: Update Backend CORS (5 minutes)

You'll need to update CORS after deploying frontend. For now, allow all origins:

In `backend/main.py`, find the CORS section and update:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary - will update after frontend deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push this change:
```bash
git add backend/main.py
git commit -m "Update CORS for deployment"
git push origin main
```

Render will auto-redeploy.

### Step 4: Frontend on Vercel (10 minutes)

1. **Create environment file:**

Create `frontend/.env.production`:
```
VITE_API_URL=https://lagskill-backend.onrender.com
```

2. **Update API configuration:**

Check `frontend/src/app/contexts/AuthContext.tsx` - make sure it uses:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

3. **Go to [vercel.com](https://vercel.com)**
   - Sign up with GitHub
   - Click "Add New..." → "Project"
   - Import your GitHub repo: `lagskill-arena`

4. **Configure:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://lagskill-backend.onrender.com`

6. Click "Deploy"
7. Wait 2-3 minutes
8. **Save your frontend URL**: `https://lagskill-arena.vercel.app`

### Step 5: Update CORS with Frontend URL (5 minutes)

Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lagskill-arena.vercel.app",  # Your actual Vercel URL
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push:
```bash
git add backend/main.py
git commit -m "Update CORS with frontend URL"
git push origin main
```

### Step 6: Test Everything (10 minutes)

1. Visit your Vercel URL
2. Register a new account
3. Upload a SHORT test video (10-15 seconds)
4. Wait for analysis (might take 2-3 minutes on free tier)
5. Check dashboard, leaderboard, highlights

**⚠️ Important**: Free tier is SLOW for video processing. For demo, use short videos (10-20 seconds max).

---

## 🎯 OPTION B: Hybrid Deployment (FASTER FOR DEMO)

### Step 1: Deploy Frontend Only (10 minutes)

Follow Step 4 from Option A, but use:
- Environment Variable: `VITE_API_URL=https://YOUR-NGROK-URL` (we'll get this next)

### Step 2: Setup ngrok (5 minutes)

1. Download ngrok: [ngrok.com/download](https://ngrok.com/download)
2. Sign up for free account
3. Install and authenticate:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ```

### Step 3: Run Backend Locally with ngrok (2 minutes)

1. Start your backend:
   ```bash
   cd backend
   .\venv\Scripts\python.exe start.py
   ```

2. In another terminal, start ngrok:
   ```bash
   ngrok http 8000
   ```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 4: Update Frontend Environment

Update Vercel environment variable:
- `VITE_API_URL=https://abc123.ngrok.io`

Redeploy frontend on Vercel.

### Step 5: Update Backend CORS

Add ngrok URL to CORS:
```python
allow_origins=[
    "https://lagskill-arena.vercel.app",
    "https://abc123.ngrok.io",
    "http://localhost:5173"
]
```

**✅ Benefits:**
- Fast video processing (local machine)
- Easy to debug during demo
- Can show code if needed
- Shareable link for judges

**⚠️ During Demo:**
- Keep backend running
- Keep ngrok running
- Don't close terminals

---

## 🎬 Demo Day Checklist

### Before Demo:
- [ ] Test with 3 different videos
- [ ] Create demo account: `demo@lagskill.com` / `Demo@123`
- [ ] Pre-upload 2-3 analyzed videos
- [ ] Check leaderboard has data
- [ ] Test highlight generator
- [ ] Prepare 10-15 second gameplay clip
- [ ] Screenshot your best results
- [ ] Have backup video ready

### During Demo:
- [ ] Show homepage and features
- [ ] Login with demo account
- [ ] Show dashboard with existing data
- [ ] Upload NEW video (short!)
- [ ] While processing, show leaderboard
- [ ] Show highlight generator
- [ ] Show Pro features
- [ ] Explain AI coach insights

### Backup Plan:
- [ ] Have screenshots of all features
- [ ] Record video demo beforehand
- [ ] Local version ready to run

---

## 🐛 Common Issues

### Issue: Render backend is slow
**Fix**: Use Option B (hybrid) for demo

### Issue: Video upload fails
**Fix**: 
- Check file size (max 100MB)
- Use shorter videos (10-20 seconds)
- Check Render logs

### Issue: CORS errors
**Fix**: 
- Verify frontend URL in CORS settings
- Check environment variables
- Redeploy backend

### Issue: MongoDB connection fails
**Fix**:
- Check connection string
- Verify IP whitelist: `0.0.0.0/0`
- Test connection in Render logs

---

## 💡 Pro Tips

1. **Use short videos for demo** (10-20 seconds)
2. **Pre-process videos before demo** (show results immediately)
3. **Have local backup** (in case cloud fails)
4. **Test on mobile** (judges might check)
5. **Monitor Render logs** during demo
6. **Keep ngrok running** if using Option B

---

## 📊 What Judges Will See

**Your deployed app:**
- Frontend: `https://lagskill-arena.vercel.app`
- Working registration/login
- Video upload and analysis
- Real-time leaderboard
- Highlight generator
- Pro features
- AI coach insights

**Make sure:**
- At least 5 users on leaderboard
- Multiple analyzed videos
- Highlight reels generated
- All features working

---

## 🎉 You're Ready!

**Deployment complete! Now focus on:**
1. Testing thoroughly
2. Preparing demo script
3. Creating backup materials
4. Practicing presentation

**Good luck with DevDash 2026! 🚀**
