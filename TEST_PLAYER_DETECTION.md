# Testing Player Detection Fix

## Quick Test Steps

1. **Start Backend**
   ```bash
   cd backend
   .\venv\Scripts\python.exe start.py
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login**
   - Email: `admin@lagskill.com`
   - Password: `Admin@123`

4. **Upload Test Video**
   - Go to Demo page
   - Select game preset (BGMI recommended)
   - Upload a third-person gameplay video
   - Wait for analysis

5. **Verify Results**
   
   **In the annotated video, check:**
   
   ✅ **Player Character (closest/largest)**
   - Has GREEN box
   - Label says "YOU (ID:X)"
   - Thicker border (3px)
   
   ✅ **Enemy Characters (farther/smaller)**
   - Have RED boxes
   - Labels say "ENEMY #X"
   - Show distance in meters
   
   ✅ **Frame Overlay (top-left)**
   - Shows "Player: ID X" after ~5 frames
   - Shows "Player: Detecting..." before that
   - Shows enemy count (excludes player)
   
   ✅ **Debug Info (first 30 frames only)**
   - Yellow "Score: XXX" text above non-player characters
   - Helps verify scoring system
   - Player should have highest score

## What to Look For

### ✅ CORRECT Behavior:
- Your character (closer to camera) = GREEN box
- Enemy characters (farther away) = RED boxes
- Player detected within 5-10 frames
- Consistent tracking (IDs don't jump around)
- Heat map only shows enemy positions

### ❌ INCORRECT Behavior:
- Your character has RED box (enemy)
- Enemies have GREEN boxes
- Player never detected (always says "Detecting...")
- IDs change every frame
- Multiple characters marked as player

## Troubleshooting

### If player is still detected as enemy:

1. **Check debug scores** (visible in first 30 frames)
   - Player should have highest score
   - Look for score values above characters

2. **Verify video type**
   - Works best with third-person games (BGMI, PUBG)
   - First-person games may need different logic

3. **Check character size**
   - Player should be largest box in frame
   - If enemies are closer, detection may fail

4. **Adjust parameters** (if needed)
   - In `backend/main.py`, line ~950
   - Increase size weight: `player_score += size_score * 7` (from 5)
   - Lower threshold: `if best_candidate and best_score > 30` (from 50)

## Expected Timeline

- **Frame 1-5**: System tracks all persons, calculates scores
- **Frame 5**: Player selected (highest score > 50)
- **Frame 6+**: Player marked with green box, enemies with red

## Debug Information

The system now shows:
1. **Frame overlay**: Player ID and detection status
2. **Score values**: First 30 frames show scores for debugging
3. **Consistent IDs**: Each person keeps same ID across frames

## Success Criteria

✅ Player correctly identified with green box
✅ Enemies correctly identified with red boxes
✅ Detection happens within 5-10 frames
✅ Tracking is consistent (no ID jumping)
✅ Heat map only tracks enemies
✅ No backend errors or crashes

## Test Videos

Best test videos:
- Third-person shooters (BGMI, PUBG, Fortnite)
- Clear view of player character
- Multiple enemies visible
- Good lighting and resolution

Avoid:
- First-person only views
- Very dark or low-quality videos
- Videos with no enemies
- Cutscenes or menus

## Next Steps After Testing

If everything works:
- ✅ Player detection is fixed!
- ✅ Ready for demo/presentation
- ✅ Document the fix in presentation

If issues persist:
- Share the annotated video
- Note the frame where detection fails
- Check the debug scores
- May need further parameter tuning
