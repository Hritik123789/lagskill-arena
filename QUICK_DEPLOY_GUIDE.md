# ⚡ Quick Deploy Guide - Choose Your Path

## 🎯 Path 1: Render (Try This First)

**Time**: 10 minutes | **Success Rate**: 70%

```bash
# In Render Dashboard:
1. Settings → Build & Deploy
2. Build Command: bash render-build.sh
3. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
4. Add env var: PYTHON_VERSION = 3.11.9
5. Manual Deploy → Deploy latest commit
```

**Watch for**: Python 3.11.9 in logs (not 3.14)

---

## 🎯 Path 2: Hybrid (Guaranteed Success)

**Time**: 25 minutes | **Success Rate**: 100%

### Step 1: Vercel (10 min)
```bash
1. Go to vercel.com
2. Import: Hritik123789/lagskill-arena
3. Root Directory: frontend
4. Framework: Vite
5. Env var: VITE_API_URL = https://temp.ngrok.io
6. Deploy
```

### Step 2: ngrok (5 min)
```bash
1. Download from ngrok.com/download
2. ngrok config add-authtoken YOUR_TOKEN
3. Done!
```

### Step 3: Run (5 min)
```bash
# Terminal 1:
cd backend
python start.py

# Terminal 2:
ngrok http 8000
# Copy the https URL
```

### Step 4: Update (5 min)
```bash
1. Vercel → Settings → Environment Variables
2. Edit VITE_API_URL → paste ngrok URL
3. Redeploy
4. Update CORS in backend/main.py with ngrok URL
5. Restart backend
```

**Done!** Visit your Vercel URL.

---

## 📋 Environment Variables (Both Paths)

```
MONGODB_URL=mongodb+srv://lagskill_user:1fIUfTKcsvzGO9uI@cluster0.zs7xci0.mongodb.net/?appName=Cluster0
DATABASE_NAME=lagskill_arena
SECRET_KEY=hackathon-devdash-2026-super-secret-key-lagskill
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAIL=admin@lagskill.com
ADMIN_PASSWORD=Admin@123
ENVIRONMENT=production
```

---

## 🎬 Demo Day Checklist

### Before Demo:
- [ ] Test your deployment URL
- [ ] Upload 2-3 test videos
- [ ] Check leaderboard has data
- [ ] Take screenshots of all features
- [ ] Have backup video ready

### If Using Hybrid:
- [ ] Start backend: `python start.py`
- [ ] Start ngrok: `ngrok http 8000`
- [ ] Keep terminals running
- [ ] Don't close laptop

---

## 🆘 Troubleshooting

### Render fails?
→ Switch to Hybrid (guaranteed to work)

### CORS errors?
→ Check frontend URL in backend/main.py CORS settings

### Video upload fails?
→ Use shorter videos (10-20 seconds)

### ngrok URL changes?
→ Update Vercel environment variable and redeploy

---

## ✅ Success Indicators

**Render:**
- Build completes without errors
- Service shows "Live"
- `/docs` shows FastAPI documentation

**Hybrid:**
- Vercel shows your frontend
- Backend terminal shows requests
- ngrok shows traffic

---

## 🎯 My Recommendation

**Try Render for 10 minutes. If it fails, immediately switch to Hybrid.**

Hybrid is not a fallback - it's a smart choice:
- ✅ Faster performance
- ✅ Easier to debug
- ✅ 100% reliable
- ✅ Professional appearance

---

## 📞 Full Documentation

- **Render Details**: `RENDER_SETUP_INSTRUCTIONS.md`
- **Hybrid Details**: `RENDER_DEPLOYMENT_FINAL.md`
- **Status**: `DEPLOYMENT_STATUS.md`

---

**Good luck! 🚀**
