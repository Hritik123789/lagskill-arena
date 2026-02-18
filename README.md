# 🎮 LagSkillArena

**AI-Powered Gaming Performance Analysis Platform**

Discover whether your gaming performance is limited by your skills or your system hardware through comprehensive AI analysis.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production%20ready-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## 🌟 Features

### 🎯 Skill Testing
- **Reaction Time Test**: Interactive testing with game-specific benchmarks
- **Progress Tracking**: Visual graphs showing improvement over time
- **Performance Ratings**: Instant feedback (Excellent, Good, Average, Below Average)

### 🤖 AI Video Analysis
- **YOLO Character Detection**: Frame-by-frame person detection
- **Annotated Videos**: Download videos with bounding boxes
- **Scene Complexity**: Automatic complexity scoring
- **Combat Intensity**: Enemy encounter detection

### 📊 Performance Metrics
- **FPS Analysis**: Average, minimum, and stability metrics
- **Motion Tracking**: Smoothness and stutter detection
- **Reaction Time Estimation**: Based on gameplay patterns
- **Performance Score**: Overall rating (0-100%)

### 🧠 AI Intelligence
- **Smart Classification**: Skill-Limited, System-Limited, Mixed, or Excellent
- **AI Coach**: Personalized recommendations
- **Actionable Insights**: Specific steps to improve

### 🌐 Community Features
- **Benchmarks**: Compare against average, top 10%, and top 1% players
- **Game Presets**: BGMI, Valorant, CS:GO (more coming soon)
- **Performance Tiers**: Bronze → Silver → Gold → Platinum → Diamond

### 🔐 User Authentication
- **User Accounts**: Register and login to save your progress
- **Session History**: Track all your video analyses
- **Personal Dashboard**: View statistics and performance trends
- **Admin Panel**: Manage users and view platform statistics

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- 4GB RAM (8GB recommended)

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd lagskill-arena
```

**2. Setup Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
```

**Note**: For full authentication features, you need MongoDB running. See [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) for details.

**3. Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

**Open your browser:** http://localhost:5173

---

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup and usage
- **[AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)** - User authentication guide
- **[FRONTEND_AUTH_GUIDE.md](FRONTEND_AUTH_GUIDE.md)** - Frontend authentication details
- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[ROADMAP.md](ROADMAP.md)** - Future development plans
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive overview

---

## 🎮 Supported Games

| Game | Avg Reaction | Status |
|------|-------------|--------|
| BGMI | 220ms | ✅ Active |
| Valorant | 200ms | ✅ Active |
| CS:GO | 195ms | ✅ Active |
| Apex Legends | - | 🔜 Coming Soon |
| Fortnite | - | 🔜 Coming Soon |

---

## 💻 Technology Stack

### Backend
- FastAPI (Python)
- YOLOv8n (Ultralytics)
- OpenCV
- NumPy

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Recharts

---

## 📊 How It Works

```
1. Select Game → 2. Test Skills → 3. Upload Video → 4. AI Analysis → 5. Get Results
```

### The Process

1. **Choose Your Game**: Select from BGMI, Valorant, or CS:GO
2. **Test Reaction Time**: Complete interactive skill tests
3. **Upload Gameplay**: Provide a 2-5 minute gameplay video
4. **AI Processing**: YOLO analyzes every frame for characters and performance
5. **Get Verdict**: Receive classification and personalized recommendations
6. **Track Progress**: Compare with community benchmarks

---

## 🎯 Use Cases

✅ **Identify Bottlenecks**: Skill vs System limitations
✅ **Track Improvement**: Monitor progress over time
✅ **Optimize Settings**: Data-driven game configuration
✅ **Hardware Decisions**: Know when to upgrade
✅ **Competitive Edge**: Compare with top players
✅ **Content Creation**: Annotated gameplay videos

---

## 📈 Example Results

### AI Verdict: Mixed
```
Your aim and reaction times are above average (top 30%), 
but FPS drops during heavy combat suggest a system bottleneck.

Recommendations:
• Lower graphics settings during competitive matches
• Consider GPU upgrade for stable 144+ FPS
• Continue aim training—your progress is excellent
```

### Metrics
- Reaction Time: 186ms (Good)
- Average FPS: 142 (Excellent)
- Min FPS: 89 (Needs Improvement)
- Stability: 82% (Good)
- Performance Score: 78/100

---

## 🗺️ Roadmap

### ✅ Phase 1: Core Foundation (COMPLETED)
- Skill testing suite
- YOLO video analysis
- AI classification system
- Session reports
- Community benchmarks
- User authentication system
- Personal dashboards
- Admin panel

### 🚧 Phase 2: Enhanced Testing (IN PROGRESS)
- Full aim training suite
- Fatigue analysis
- Additional game presets

### 📅 Phase 3: Enhanced Features (Q2 2026)
- Historical tracking with charts
- Shareable reports
- Email notifications
- Profile customization

### 🎯 Phase 4: Advanced AI (Q3 2026)
- Enhanced video analysis
- Predictive analytics
- Live gameplay analysis

[View Full Roadmap](ROADMAP.md)

---

## 🤝 Contributing

We welcome contributions! Areas of interest:
- New game presets
- UI/UX improvements
- Performance optimizations
- Bug fixes
- Documentation
- Feature suggestions

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Ultralytics** for YOLOv8
- **FastAPI** for the amazing backend framework
- **React** and **Vite** for the frontend stack
- **Gaming Community** for feedback and support

---

## 📞 Support

### Documentation
- Check the docs folder for detailed guides
- Review troubleshooting in SETUP_GUIDE.md

### Common Issues
- **Backend won't start**: Ensure Python 3.8+ and dependencies installed
- **Frontend won't start**: Run `npm install` in frontend folder
- **Video upload fails**: Check backend is running on port 8000
- **Slow processing**: Normal for first analysis, subsequent ones are faster

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📊 Project Stats

- **Lines of Code**: 5,000+
- **Components**: 15+
- **API Endpoints**: 4
- **Supported Games**: 3
- **Metrics Tracked**: 15+
- **Documentation Pages**: 6

---

## 🎉 Get Started Now!

```bash
# Quick start
cd backend && venv\Scripts\activate && uvicorn main:app --reload
cd frontend && npm run dev
# Open http://localhost:5173
```

**Happy Gaming! May your FPS be high and your reaction times low! 🎮🚀**

---

<div align="center">

Made with ❤️ for the gaming community

[Documentation](SETUP_GUIDE.md) • [Features](FEATURES.md) • [Roadmap](ROADMAP.md) • [Quick Start](QUICK_START.md)

</div>
