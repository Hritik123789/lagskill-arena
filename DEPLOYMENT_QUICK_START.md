# 🚀 Quick Deployment Guide - Choose Your Path

## Path 1: Full Cloud (2-3 hours) ⭐ Recommended for Submission

### Step 1: MongoDB Atlas (10 min)
1. Go to mongodb.com/cloud/atlas → Sign up
2. Create FREE M0 cluster
3. Database Access → Add user (save password!)
4. Network Access → Add IP: `0.0.0.0/0`
5. Get connection string (replace `<password>`)

### Step 2: Deploy Backend to Render (20 min)
1. Go to render.com → Sign up with GitHub
2. New + → Web Service → Connect repo: `lagskill-arena`
3. Settings:
   - Name: `lagskill-backend`
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Instance: Free

4. Environment Variables (click "Add Environment Variable"):
   ```
   MONGODB_URL=your_mongodb_connection_string
   DATABASE_NAME=lagskill_arena
   SECRET_KEY=your-secret-key-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ADMIN_EMAIL=admin@lagskill.com
   ADMIN_PASSWORD=Admin@123
   ENVIRONMENT=production
   ```

5. Click "Create Web Service" → Wait 10 min
6. Copy your URL: `https://lagskill-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel (15 min)
1. Go to vercel.com → Sign up with GitHub
2. New Project → Import `lagskill-arena`
3. Settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`

4. Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://lagskill-backend.onrender.com` (your Render URL)

5. Deploy → Wait 3 min
6. Copy your URL: `https://lagskill-arena.vercel.app`

### Step 4: Update CORS (5 min)
Edit `backend/main.py` line ~50:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://lagskill-arena.vercel.app",  # Your Vercel URL
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push changes:
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-redeploy in 5 min.

### Step 5: Test (10 min)
1. Visit your Vercel URL
2. Register account
3. Upload SHORT video (10-15 sec)
4. Wait for analysis (2-3 min on free tier)
5. Check all features work

✅ **Done! Share your Vercel URL with judges**

---

## Path 2: Hybrid (30 min) ⚡ Best for Live Demo

### Step 1: Deploy Frontend Only (15 min)
Follow Step 3 above, but use temporary URL:
- `VITE_API_URL=https://temporary.ngrok.io` (we'll update this)

### Step 2: Setup ngrok (10 min)
1. Download: ngrok.com/download
2. Sign up → Get auth token
3. Install:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ```

### Step 3: Run for Demo (5 min)
**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\python.exe start.py
```

**Terminal 2 - ngrok:**
```bash
ngrok http 8000
```

Copy ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 4: Update Vercel
1. Go to Vercel project → Settings → Environment Variables
2. Edit `VITE_API_URL` → Paste ngrok URL
3. Redeploy

### Step 5: Update CORS
Add ngrok URL to `backend/main.py`:
```python
allow_origins=[
    "https://lagskill-arena.vercel.app",
    "https://abc123.ngrok.io",  # Your ngrok URL
    "http://localhost:5173"
]
```

✅ **Done! Fast processing + shareable link**

**⚠️ During Demo:**
- Keep both terminals running
- Don't close laptop
- Have backup screenshots

---

## Path 3: Local Only (5 min) 🏠 Backup Plan

Just run locally and share screen:
```bash
# Terminal 1
cd backend
.\venv\Scripts\python.exe start.py

# Terminal 2
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## Which Path Should You Choose?

| Scenario | Recommended Path | Why |
|----------|-----------------|-----|
| Judges will test themselves | Path 1 (Full Cloud) | Shareable link, always online |
| Live demo presentation | Path 2 (Hybrid) | Fast processing, easy debug |
| Internet issues / backup | Path 3 (Local) | Most reliable, no dependencies |
| 3+ days before deadline | Path 1 | Time to fix issues |
| 1 day before deadline | Path 2 | Faster setup |
| Demo day morning | Path 3 | Safest option |

---

## ⚠️ Important Notes

### For Free Tier Deployments:
- **Use SHORT videos** (10-20 seconds max)
- First request takes 30-60 seconds (cold start)
- Video processing is SLOW (2-3 min for 15 sec video)
- Pre-upload demo videos before presentation

### Demo Day Tips:
1. **Pre-process 3-4 videos** before demo
2. **Have screenshots** of all features
3. **Test 1 hour before** presentation
4. **Have local backup** running
5. **Use mobile hotspot** if WiFi fails

---

## 🐛 Quick Fixes

### "CORS Error"
→ Check CORS settings in `backend/main.py`
→ Verify frontend URL is correct

### "MongoDB Connection Failed"
→ Check connection string
→ Verify IP whitelist: `0.0.0.0/0`

### "Video Upload Fails"
→ Use shorter video (< 20 seconds)
→ Check file size (< 100MB)

### "Render is Slow"
→ Normal for free tier
→ Use Path 2 (Hybrid) instead

---

## 📊 What to Show Judges

1. **Homepage** - Professional landing page
2. **Registration** - Working auth system
3. **Upload & Analysis** - YOLO detection in action
4. **Dashboard** - Performance metrics
5. **Leaderboard** - Competitive element
6. **Highlights** - AI-powered highlight reel
7. **Pro Features** - Advanced analytics

---

## 🎉 You're Ready!

**Your Links:**
- Frontend: `https://lagskill-arena.vercel.app`
- Backend: `https://lagskill-backend.onrender.com`
- GitHub: `https://github.com/Hritik123789/lagskill-arena`

**Good luck with DevDash 2026! 🚀**

Need help? Check `HACKATHON_DEPLOYMENT.md` for detailed instructions.
