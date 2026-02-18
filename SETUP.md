# 🚀 LagSkillArena - Setup Guide

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- Git

---

## 📦 Quick Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd lagskill-arena
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download YOLO model (if not included)
# The model will auto-download on first run, or download manually:
# https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
# Place in backend/ folder

# Setup environment variables
copy .env.example .env
# Edit .env with your settings

# Start backend
python start.py
```

Backend will run on: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/lagskill`

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `backend/.env` with your connection string

---

## 🔑 Default Login

- **Email**: admin@lagskill.com
- **Password**: Admin@123

---

## 📁 Project Structure

```
lagskill-arena/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── auth.py           # Authentication
│   ├── models.py         # Data models
│   ├── database.py       # MongoDB connection
│   ├── config.py         # Configuration
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Environment variables (create from .env.example)
│   └── yolov8n.pt       # YOLO model (download separately)
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── pages/    # React pages
│   │       ├── components/ # React components
│   │       └── contexts/ # React contexts
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🎮 Usage

1. **Register/Login**: Create account or use admin credentials
2. **Upload Video**: Go to Demo page, select game preset, upload gameplay video
3. **View Analysis**: See annotated video, heat maps, timeline, AI insights
4. **Check Leaderboard**: View global rankings
5. **Export Report**: (Pro feature) Download analysis as PNG

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Ensure virtual environment is activated
- Check port 8000 is not in use

### Frontend won't start
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check port 5173 is not in use

### Video analysis fails
- Ensure YOLO model (`yolov8n.pt`) is in `backend/` folder
- Check video format (MP4, AVI, MOV supported)
- Try shorter video (30-60 seconds)
- Check backend logs for errors

### MongoDB connection fails
- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings
- For Atlas: Whitelist your IP address

---

## 📝 Notes

- **YOLO Model**: The `yolov8n.pt` file is ~6MB and not included in repo. Download from Ultralytics or it will auto-download on first run.
- **Uploads/Outputs**: These folders are gitignored. They'll be created automatically.
- **Environment Variables**: Never commit `.env` file. Use `.env.example` as template.

---

## 🚀 For Production Deployment

See `DEPLOYMENT_GUIDE.md` for instructions on deploying to:
- MongoDB Atlas (database)
- Render (backend)
- Vercel (frontend)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## 📧 Support

For issues or questions, contact the team or create an issue on GitHub.
