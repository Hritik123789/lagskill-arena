# Player Detection Fix - Third-Person Games

## Problem Identified
The player was being incorrectly identified as an enemy in third-person gameplay videos. The character closer to the camera (the player) was getting a red box instead of a green box.

## Root Cause
1. **Variable Scope Issue**: The code was trying to use `person_id` before it was assigned, causing the scoring logic to fail
2. **Insufficient Size Weight**: The size-based scoring (which identifies the largest/closest character) wasn't weighted heavily enough
3. **Too High Threshold**: The minimum score threshold (100) was too high, preventing player detection
4. **Too Long Wait Time**: Waiting 10 frames before selecting a player was too conservative

## Solution Applied

### 1. Fixed Variable Order
- Moved person ID assignment BEFORE player score calculation
- Ensured `person_id` exists in `person_tracker` before calculating consistency score

### 2. Enhanced Scoring System
The player detection now uses a weighted scoring system:

```
Player Score = (Size × 5) + (Bottom Position × 2) + (Horizontal Center × 1) + (Consistency × 1)
```

**Score Components:**
- **Size Score (Weight: 5x)** - INCREASED from 3x
  - Larger boxes = closer to camera = likely player
  - Most important factor for third-person games
  
- **Bottom Position (Weight: 2x)**
  - Player character usually in bottom half of screen
  - Gives 0-50 points based on vertical position
  
- **Horizontal Center (Weight: 1x)**
  - Player often centered horizontally
  - Gives 0-50 points based on distance from center
  
- **Consistency (Weight: 1x)**
  - Characters tracked longer are more likely to be player
  - Up to 50 points over 100 frames

### 3. Improved Detection Parameters
- **Reduced Wait Time**: 5 frames (was 10) - faster player identification
- **Lower Threshold**: 50 points (was 100) - easier to qualify as player
- **Tighter Tracking Window**: 3 frames (was 5) - more responsive to changes

### 4. Added Debug Visualization
- Frame overlay shows "Player: ID X" or "Player: Detecting..."
- First 30 frames show player scores on all characters (yellow text)
- Helps verify the scoring system is working correctly

## How It Works Now

1. **Frame 1-5**: System tracks all detected persons, calculates scores
2. **Frame 5+**: Selects person with highest score (>50) as player
3. **Player Identified**: Green box with "YOU" label
4. **Enemies**: Red boxes with "ENEMY #X" labels
5. **Heat Map**: Only tracks enemy positions (not player)

## Expected Behavior

For third-person games like BGMI:
- ✅ Larger character (closer to camera) = GREEN box = Player
- ✅ Smaller characters (farther away) = RED boxes = Enemies
- ✅ Player detection happens within first 5-10 frames
- ✅ Heat map only shows enemy positions

## Testing Instructions

1. Upload a third-person gameplay video (BGMI, PUBG, etc.)
2. Check the annotated video output
3. Verify:
   - Your character (closest/largest) has GREEN box
   - Enemy characters have RED boxes
   - Frame overlay shows "Player: ID X" after ~5 frames
   - First 30 frames show score values for debugging

## If Player Detection Still Fails

If the system still identifies the wrong character as player:

1. **Check the debug scores** (visible in first 30 frames)
2. **Adjust weights** in the scoring system:
   - Increase size weight further (currently 5x)
   - Adjust bottom position weight
3. **Lower threshold** further (currently 50)
4. **Consider manual selection**: Add UI option for user to click on their character

## Files Modified
- `backend/main.py` - Fixed player detection logic in `analyze_video_internal()` function
