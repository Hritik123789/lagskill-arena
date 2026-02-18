# 🧪 Testing New Features - Quick Guide

## 🚀 Quick Start

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
python start.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for both to start, then open: `http://localhost:5173`

---

## ✅ Feature Testing Checklist

### Feature 1: Benchmarking System

**Steps:**
1. Login as admin: `admin@lagskill.com` / `Admin@123`
2. Go to Demo page
3. Select a game preset (Valorant, CS:GO, or BGMI)
4. Upload a video
5. Wait for analysis
6. Go to Dashboard → Click "View Report" on the session

**What to look for:**
- ✅ "Community Benchmarks" section appears
- ✅ Three benchmark cards: Reaction Time, FPS, Performance
- ✅ Each shows percentile ranking (Top 1%, Top 10%, etc.)
- ✅ Color-coded badges (purple, gold, green, blue, gray)
- ✅ "Better than X% of players" text

**Expected Results:**
- Reaction Time: Shows your ms and ranking
- FPS: Shows your FPS and ranking
- Performance: Shows overall score and ranking

---

### Feature 2: Global Leaderboard

**Steps:**
1. Click "Leaderboard" in navigation
2. View the global rankings
3. Try filtering by game (All, Valorant, CS:GO, BGMI)
4. Upload another video to see your rank update

**What to look for:**
- ✅ Leaderboard page loads
- ✅ Shows rank, username, performance score, reaction time, FPS
- ✅ Top 3 have special icons (Crown for #1, Medals for #2-3)
- ✅ Top 10 have highlighted backgrounds
- ✅ Game filter buttons work
- ✅ Your entry appears after uploading video

**Expected Results:**
- Rankings sorted by performance score
- Real-time updates
- Smooth filtering
- Responsive design

---

### Feature 3: Export Report

**Steps:**
1. Login as Pro user (admin account is Pro)
2. Go to any session report
3. Look for "Export Report" button in top right
4. Click the button
5. Wait for export to complete
6. Check your Downloads folder

**What to look for:**
- ✅ "Export Report" button visible (Pro users only)
- ✅ Button shows "Exporting..." during process
- ✅ PNG file downloads automatically
- ✅ Image includes all report sections
- ✅ High quality (2x scale)

**Expected Results:**
- File named: `lagskill-report-{sessionId}.png`
- Contains full report with benchmarks, verdict, metrics
- Dark theme preserved
- Readable text and graphics

---

### Feature 4: Enhanced Benchmarks in Reports

**Steps:**
1. Upload a new video (after implementing benchmarks)
2. Go to the session report
3. Scroll through the report

**What to look for:**
- ✅ Benchmarks section at top (before verdict)
- ✅ Three cards with icons
- ✅ Percentile badges with colors
- ✅ "Better than X%" text
- ✅ Smooth animations

---

### Feature 5: Game Preset Integration

**Steps:**
1. Go to Demo page
2. Select different game presets
3. Upload videos for each game
4. Check leaderboard filtering

**What to look for:**
- ✅ Game preset selector works
- ✅ Different benchmarks per game
- ✅ Leaderboard shows game tags
- ✅ Filtering by game works
- ✅ Session reports show game preset

---

## 🐛 Common Issues & Fixes

### Issue: Benchmarks not showing
**Cause**: Old sessions don't have benchmark data
**Fix**: Upload a NEW video after the update

### Issue: Leaderboard empty
**Cause**: No sessions with leaderboard entries yet
**Fix**: Upload at least one video

### Issue: Export button not visible
**Cause**: User is not Pro
**Fix**: Login as admin@lagskill.com or upgrade to Pro

### Issue: Export fails
**Cause**: Browser compatibility or large report
**Fix**: Try Chrome/Edge, or reduce report size

---

## 📊 Test Data Scenarios

### Scenario 1: Top Performer
- Upload high FPS video (60+ FPS)
- Should show Top 10% or better
- Should rank high on leaderboard

### Scenario 2: Average Performer
- Upload medium quality video
- Should show "Above Average" or "Average"
- Should rank in middle of leaderboard

### Scenario 3: Multiple Games
- Upload videos for different games
- Check game-specific benchmarks
- Verify leaderboard filtering

---

## 🎯 Demo Script for Judges

### 1. Introduction (30 seconds)
"LagSkillArena helps gamers identify if performance issues are due to skills or hardware using AI-powered video analysis."

### 2. Show Problem (30 seconds)
"Gamers often blame their aim when it's actually FPS drops, or upgrade hardware when they just need practice."

### 3. Upload Video (1 minute)
- Select game preset
- Upload gameplay video
- Show real-time processing
- Explain YOLO detection

### 4. Show Results (2 minutes)
- **Benchmarks**: "You're in the Top 25% for reaction time"
- **AI Verdict**: "Your skills are solid, but system needs upgrade"
- **AI Coach Tips**: Show personalized recommendations
- **Export**: Download report as image

### 5. Show Leaderboard (30 seconds)
- "See how you rank globally"
- Filter by game
- Show competitive aspect

### 6. Show Monetization (30 seconds)
- Free: 3 credits/day
- Pro: Unlimited + AI insights + Export
- Clear value proposition

### 7. Wrap Up (30 seconds)
- Market size: 50M+ gamers in India
- Revenue model: Freemium
- Growth potential: Multi-game, mobile app, team features

**Total: 5 minutes**

---

## 🔍 Quality Checks

Before demo:
- [ ] Backend running without errors
- [ ] Frontend loads correctly
- [ ] Can login/register
- [ ] Video upload works
- [ ] Analysis completes successfully
- [ ] Benchmarks display correctly
- [ ] Leaderboard loads
- [ ] Export works (Pro users)
- [ ] All navigation links work
- [ ] No console errors
- [ ] Mobile responsive (bonus)

---

## 💡 Pro Tips for Demo

1. **Pre-upload videos**: Have 2-3 videos already analyzed
2. **Use admin account**: Already Pro, no upgrade needed
3. **Prepare short video**: < 30 seconds for quick analysis
4. **Test beforehand**: Run through entire flow once
5. **Have backup**: Screenshots if live demo fails
6. **Explain tech**: Mention YOLO, MongoDB, React
7. **Show code**: If judges ask, show clean architecture
8. **Emphasize AI**: Real ML, not mock data

---

## 📸 Screenshots to Capture

For documentation:
1. Landing page
2. Video upload interface
3. Analysis in progress
4. Session report with benchmarks
5. AI verdict section
6. AI coach tips (Pro)
7. Leaderboard page
8. Dashboard
9. Export feature
10. Mobile view (bonus)

---

## 🎉 Success Criteria

Your demo is successful if judges see:
- ✅ Real AI/ML working (YOLO detection)
- ✅ Professional UI/UX
- ✅ Complete feature set
- ✅ Clear value proposition
- ✅ Monetization strategy
- ✅ Community features (leaderboard)
- ✅ Scalable architecture
- ✅ Market potential

---

## 🚀 Ready to Impress!

All features are implemented and tested. You have:
- Real AI-powered analysis
- Community benchmarking
- Global leaderboard
- Export functionality
- Pro features
- Professional UI
- Complete documentation

**Go win that hackathon! 🏆**
