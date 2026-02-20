# 🎮 LagSkillArena

**AI-Powered Gaming Performance Analysis Platform**

Analyze your gameplay with advanced AI to identify whether your performance is limited by skills or hardware. Get real-time player tracking, heat maps, timeline analysis, and personalized coaching.


## 🌐 Live Demo

**🚀 [Try LagSkillArena Now](https://lagskill-arena-gaming-hritik123789s-projects.vercel.app)**

- Demo Account: `admin@lagskill.com` / `Admin@123`
- Backend API: `https://lagskill-arena.onrender.com`
- API Docs: `https://lagskill-arena.onrender.com/docs`

---

## 🌟 Features

### 🎯 Real-Time AI Analysis
- **YOLO v8 Player Tracking**: Precise player and enemy detection
- **Smart Tracking**: Maintains player identity across frames
- **Annotated Videos**: Download gameplay with bounding boxes and labels
- **Two-Pass Detection**: Size-based player identification for accuracy

### 📊 Advanced Analytics
- **Heat Maps**: Visualize player movement and enemy encounters
- **Timeline Visualization**: Frame-by-frame activity tracking
- **Performance Metrics**: FPS, reaction time, combat intensity
- **AI Insights**: Personalized recommendations and coaching

### 🏆 Community Features
- **Global Leaderboard**: Compare with players worldwide
- **Game Presets**: BGMI, Valorant, CS:GO, Apex Legends, Fortnite
- **Benchmarking**: See how you stack up against top players
- **Performance Tiers**: Bronze → Silver → Gold → Platinum → Diamond

### 💎 Pro Features
- **Export Reports**: Download analysis as PNG
- **Priority Processing**: Faster video analysis
- **Advanced Metrics**: Detailed performance breakdowns
- **Ad-Free Experience**: Clean interface

### 🔐 User System
- **Authentication**: Secure JWT-based login
- **Session History**: Track all your analyses
- **Personal Dashboard**: View stats and progress
- **Admin Panel**: Platform management and user analytics

---

## 🚀 Quick Start

See [SETUP.md](SETUP.md) for detailed instructions.

```bash
# Clone
git clone https://github.com/Hritik123789/lagskill-arena.git
cd lagskill-arena

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env  # Edit with your MongoDB URL
python start.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Login**: admin@lagskill.com / Admin@123

---

## 💻 Technology Stack

### Backend
- FastAPI + Uvicorn
- YOLOv8n (Ultralytics)
- OpenCV + NumPy
- MongoDB + Motor (async)
- JWT Authentication

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS 4
- Radix UI Components
- Recharts
- React Router 7

---

## 🎮 Supported Games

| Game | Avg Reaction | Status |
|------|-------------|--------|
| BGMI | 220ms | ✅ Active |
| Valorant | 200ms | ✅ Active |
| CS:GO | 195ms | ✅ Active |
| Apex Legends | 210ms | ✅ Active |
| Fortnite | 205ms | ✅ Active |

---

## 📊 How It Works

1. **Select Game**: Choose your game preset
2. **Upload Video**: 30-60 second gameplay clip
3. **AI Processing**: YOLO analyzes every frame
4. **Get Results**: View annotated video, heat maps, timeline, and AI insights
5. **Track Progress**: Compare with benchmarks and leaderboard

---

## 🎯 Key Capabilities

✅ **Player Detection**: Identifies YOU vs ENEMIES accurately
✅ **Movement Tracking**: Heat maps show positioning patterns
✅ **Combat Analysis**: Timeline of enemy encounters
✅ **Performance Scoring**: Overall rating with breakdown
✅ **AI Coaching**: Personalized improvement suggestions
✅ **Export Reports**: Share your analysis (Pro)

---

## 📈 Example Analysis

### Metrics
- Reaction Time: 186ms (Top 25%)
- Average FPS: 142
- Combat Intensity: High
- Movement Efficiency: 78%
- Performance Score: 82/100

### AI Verdict
```
Strong positioning and reaction times. Consider:
• More aggressive flanking in mid-game
• Reduce time in open areas (heat map shows vulnerability)
• Your aim is excellent—focus on game sense
```

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)
- ✅ YOLO v8 player/enemy detection
- ✅ Heat map visualization
- ✅ Timeline analysis
- ✅ User authentication & JWT
- ✅ Global leaderboard
- ✅ Pro features & credits system
- ✅ Admin panel
- ✅ Highlight reel generator
- ✅ Social sharing features
- ✅ Full deployment (Vercel + Render)

### 🔜 Coming Soon (v2.0)
- 🔄 Live gameplay analysis
- 🔄 Team coordination tracking
- 🔄 Custom model training per game
- 🔄 Mobile app (iOS/Android)
- 🔄 Twitch/YouTube integration
- 🔄 Advanced aim analysis

[View Full Roadmap](ROADMAP.md)

---

## 📝 Documentation

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Complete project details, market analysis, and future scope
- [SETUP.md](SETUP.md) - Local development setup
- [ROADMAP.md](ROADMAP.md) - Future features and plans

---

## 🤝 Contributing

Contributions welcome! Areas of interest:
- Additional game presets
- UI/UX improvements
- Performance optimizations
- New analytics features

---

## Need help with

**Common Issues:**
- Backend won't start: Check MongoDB connection in `.env`
- Frontend won't start: Run `npm install` again
- Video fails: Ensure YOLO model (`yolov8n.pt`) is in backend folder
- Slow processing: Normal for first run (model loading)

See [SETUP.md](SETUP.md) troubleshooting section.

---

## 🙏 Acknowledgments

- **Ultralytics** for YOLOv8
- **FastAPI** for backend framework
- **React** ecosystem for frontend
- Gaming community for feedback

---

## 📊 Project Stats

- **Lines of Code**: 8,000+
- **Components**: 25+
- **API Endpoints**: 15+
- **Supported Games**: 5
- **Metrics Tracked**: 20+

---

<div align="center">

Made with ❤️ for gamers who want to improve

**🌐 [Live Demo](https://lagskill-arena-gaming-hritik123789s-projects.vercel.app)** • [Setup Guide](SETUP.md) • [Roadmap](ROADMAP.md)

**Happy Gaming! 🎮🚀**

</div>
