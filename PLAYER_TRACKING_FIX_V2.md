# Player Tracking Fix V2 - Persistent Player ID

## Issue Reported
Player was initially detected correctly (green box "YOU") but after 2 seconds, the ID changed and player was marked as "ENEMY #2" with increasing numbers.

## Root Cause
The tracking system was creating new IDs too easily when the player moved or was temporarily occluded. The player ID wasn't being prioritized for re-matching.

## Solution Applied

### 1. Priority Player Tracking
```python
# PRIORITY: If player_id exists, try to match with player first
if player_id is not None and player_id in person_tracker:
    # Very lenient for player - they can move fast
    if dist < 200:  # 200 pixels (was 100)
        person_id = player_id
```

**Changes:**
- Player gets checked FIRST before other persons
- Player can move up to 200 pixels between frames (vs 100 for enemies)
- Player can be missing for up to 5 frames (vs 2 for enemies)
- This prevents creating new IDs when player moves quickly

### 2. Player Status Lock
```python
# If player exists, ensure they keep their player status
elif player_id is not None and person_id == player_id:
    person_tracker[person_id]['is_player'] = True
```

**Changes:**
- Once a person is marked as player, they stay as player
- Player status is reinforced every frame
- Prevents accidental status changes

### 3. Debug Logging
Added console output to track what's happening:
- `🆕 New person detected: ID X at frame Y`
- `🎯 PLAYER LOCKED: ID X with score Y at frame Z`
- `⚠️ WARNING: Player ID X lost player status at frame Y`

This helps identify when and why tracking fails.

### 4. More Lenient Tracking
- **Player**: Can be missing for 5 frames, move 200 pixels
- **Enemies**: Can be missing for 2 frames, move 100 pixels

This accounts for:
- Fast player movement
- Camera shake
- Temporary occlusion
- Frame drops

## How It Works Now

### Frame-by-Frame Process:

1. **Detection Phase**
   - YOLO detects all persons in frame
   - Calculates box properties (position, size, etc.)

2. **ID Assignment Phase** (CRITICAL)
   - **Step 1**: Check if current box matches PLAYER (priority)
     - Distance < 200 pixels from last known position
     - Can be missing for up to 5 frames
   - **Step 2**: If not player, check other tracked persons
     - Distance < 100 pixels from last known position
     - Can be missing for up to 2 frames
   - **Step 3**: If no match, create NEW ID

3. **Player Selection Phase** (Frame 5+)
   - If no player selected yet, find highest scoring person
   - Lock that person as player
   - Never change unless completely lost

4. **Status Enforcement Phase**
   - If person_id == player_id, mark as player
   - Ensure is_player flag is set
   - Apply green box and "YOU" label

## Expected Behavior

✅ **Correct:**
- Player detected within 5-10 frames
- Player keeps same ID throughout video
- Green box stays on player
- Player can move quickly without losing ID
- Console shows "PLAYER LOCKED: ID X"

❌ **Incorrect (should not happen now):**
- Player ID changes mid-video
- Player becomes "ENEMY #2"
- Multiple "New person detected" for same player
- Console shows "WARNING: Player lost status"

## Testing

1. **Start backend** and watch console output
2. **Upload video** with clear player character
3. **Check console** for:
   ```
   🆕 New person detected: ID 1 at frame 1
   🆕 New person detected: ID 2 at frame 3
   🎯 PLAYER LOCKED: ID 1 with score 156.3 at frame 6
   ```
4. **Verify** no more "New person detected" for player
5. **Watch video** - green box should stay on player

## If Issue Persists

### Check Console Output:
- Are new IDs being created every few frames?
- Is player being locked and then lost?
- What are the player scores?

### Possible Adjustments:

1. **Increase player tracking distance**
   ```python
   if dist < 300:  # Increase from 200
   ```

2. **Increase player missing frames tolerance**
   ```python
   if pdata['last_seen'] >= frame_count - 10:  # Increase from 5
   ```

3. **Lower player detection threshold**
   ```python
   if best_candidate and best_score > 30:  # Decrease from 50
   ```

4. **Increase size weight even more**
   ```python
   player_score += size_score * 7  # Increase from 5
   ```

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| Player tracking distance | 100px | 200px |
| Player missing frames | 1 frame | 5 frames |
| Player priority | None | Checked first |
| Status lock | No | Yes |
| Debug logging | No | Yes |
| Re-matching logic | Generic | Player-specific |

## Files Modified
- `backend/main.py` - Enhanced player tracking in `analyze_video_internal()` function

## Next Steps
1. Test with your video again
2. Check console output for debug messages
3. Verify player ID stays consistent
4. If still issues, share console output for further diagnosis
