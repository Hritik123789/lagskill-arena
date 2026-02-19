# 🆘 Teammate Setup Help

## Can't Access Localhost?

### Step 1: Check Prerequisites
```bash
# Check Python version (need 3.10+)
python --version

# Check Node version (need 18+)
node --version

# Check if MongoDB is installed
mongod --version
```

If any are missing, install them first.

---

### Step 2: Setup MongoDB

**Option A: Local MongoDB (Easier)**
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install it
3. MongoDB should auto-start as a service
4. In `backend/.env`, use: `MONGODB_URL=mongodb://localhost:27017/lagskill`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. In `backend/.env`, paste it: `MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/lagskill`

---

### Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate

# If activation fails, try:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env file with your MongoDB URL
# Use notepad or any text editor
notepad .env
```

**Your .env should look like:**
```
MONGODB_URL=mongodb://localhost:27017/lagskill
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

```bash
# Start backend
python start.py
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test it:** Open browser → http://localhost:8000/docs (should see API docs)

---

### Step 4: Frontend Setup (New Terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# If npm install fails:
npm cache clean --force
npm install

# Start frontend
npm run dev
```

**You should see:**
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Test it:** Open browser → http://localhost:5173 (should see the app)

---

## Common Issues

### Issue 1: "Port already in use"
```bash
# Backend (port 8000)
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <process_id> /F
```

### Issue 2: "Cannot activate venv"
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating again
.\venv\Scripts\activate
```

### Issue 3: "MongoDB connection failed"
- Check MongoDB is running: `mongod --version`
- For local MongoDB, start the service:
  - Windows: Services → MongoDB → Start
  - Or use MongoDB Compass (GUI tool)
- For Atlas: Check connection string has correct username/password

### Issue 4: "Module not found" errors
```bash
# Backend
cd backend
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Can't access from browser"
- Make sure both backend AND frontend are running (2 terminals)
- Try http://127.0.0.1:5173 instead of localhost:5173
- Check Windows Firewall isn't blocking ports 8000 or 5173
- Try different browser (Chrome/Edge/Firefox)

### Issue 6: "YOLO model not found"
The model auto-downloads on first video upload. Or download manually:
1. Go to: https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
2. Save as `yolov8n.pt` in the `backend/` folder

---

## Quick Checklist

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] MongoDB installed (local) OR Atlas account created
- [ ] Cloned repo: `git clone https://github.com/Hritik123789/lagskill-arena.git`
- [ ] Backend: Created `.env` file with MongoDB URL
- [ ] Backend: Ran `pip install -r requirements.txt`
- [ ] Backend: Running `python start.py` (port 8000)
- [ ] Frontend: Ran `npm install`
- [ ] Frontend: Running `npm run dev` (port 5173)
- [ ] Browser: Can access http://localhost:5173

---

## Still Not Working?

**Send me:**
1. Screenshot of backend terminal output
2. Screenshot of frontend terminal output
3. Screenshot of browser error (if any)
4. Your `.env` file (hide the password if using Atlas)

**Or try this:**
```bash
# Backend terminal - show me this output
cd backend
python start.py

# Frontend terminal - show me this output
cd frontend
npm run dev
```

---

## Video Tutorial (If Needed)

If you're still stuck, I can walk you through it on a call. The setup should take 10-15 minutes max once you have Python, Node, and MongoDB installed.

---

## Login Credentials

Once it's running:
- **Email**: admin@lagskill.com
- **Password**: Admin@123
