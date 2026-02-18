# Debug Guide: Player Tracking Issues

## What to Look For in Console

When you run the backend and upload a video, watch the console output:

### ✅ GOOD Output (Working Correctly):
```
🆕 New person detected: ID 1 at frame 1
🆕 New person detected: ID 2 at frame 3
🎯 PLAYER LOCKED: ID 1 with score 156.3 at frame 6
(no more "New person detected" for ID 1)
```

### ❌ BAD Output (Tracking Lost):
```
🆕 New person detected: ID 1 at frame 1
🎯 PLAYER LOCKED: ID 1 with score 156.3 at frame 6
🆕 New person detected: ID 3 at frame 15  ← Player lost, new ID created
⚠️ WARNING: Player ID 1 lost player status at frame 15
```

## Understanding the Problem

### Scenario 1: Player ID Keeps Changing
**Symptoms:**
- Green box appears, then disappears
- New "ENEMY #X" appears where player was
- Numbers keep increasing (ENEMY #2, #3, #4...)

**Cause:**
- Tracking distance too small (player moves too fast)
- Player temporarily occluded (behind object)
- Detection confidence drops below threshold

**Fix Applied:**
- Increased player tracking distance: 100px → 200px
- Increased missing frames tolerance: 1 → 5 frames
- Player checked FIRST before creating new IDs

### Scenario 2: Wrong Person Marked as Player
**Symptoms:**
- Enemy gets green box
- Player gets red box
- Happens from the start

**Cause:**
- Player scoring system incorrect
- Enemy is larger/closer than player
- Player not in expected position

**Fix Applied:**
- Increased size weight: 3x → 5x
- Lowered threshold: 100 → 50
- Better scoring algorithm

### Scenario 3: Player Detected Then Lost
**Symptoms:**
- Starts correct (green box on player)
- After 2-3 seconds, switches to enemy
- Console shows "Player lost status"

**Cause:**
- Player ID not being prioritized for re-matching
- New ID created when player moves
- Status not locked properly

**Fix Applied:**
- Priority player tracking (checked first)
- Status lock (once player, always player)
- More lenient tracking parameters

## How to Debug

### Step 1: Check Console Output
Look for patterns:
- How many "New person detected" messages?
- When is "PLAYER LOCKED" shown?
- Any "WARNING" messages?

### Step 2: Check Video Frames
- Frame 1-5: Should see multiple detections
- Frame 6+: Should see "PLAYER LOCKED"
- Frame 10+: Should NOT see new IDs for player

### Step 3: Check Player Scores
In the video (first 30 frames):
- Yellow "Score: XXX" text above characters
- Player should have HIGHEST score
- Typical player score: 150-300
- Typical enemy score: 50-100

### Step 4: Identify the Issue

| Observation | Issue | Solution |
|-------------|-------|----------|
| New IDs every few frames | Tracking lost | Increase distance/frames |
| Wrong person is player | Scoring wrong | Adjust weights |
| Player switches mid-video | Not locked | Check priority logic |
| No player detected | Threshold too high | Lower threshold |

## Quick Fixes

### If player tracking keeps breaking:

1. **Open `backend/main.py`**
2. **Find line ~935** (player tracking section)
3. **Increase distance:**
   ```python
   if dist < 300:  # Change from 200
   ```
4. **Increase missing frames:**
   ```python
   if pdata['last_seen'] >= frame_count - 10:  # Change from 5
   ```

### If wrong person is player:

1. **Open `backend/main.py`**
2. **Find line ~980** (player scoring section)
3. **Increase size weight:**
   ```python
   player_score += size_score * 7  # Change from 5
   ```
4. **Lower threshold:**
   ```python
   if best_candidate and best_score > 30:  # Change from 50
   ```

## Test Checklist

After making changes:

- [ ] Restart backend
- [ ] Upload test video
- [ ] Check console for "PLAYER LOCKED"
- [ ] Verify no new IDs for player after lock
- [ ] Watch annotated video
- [ ] Confirm green box stays on player
- [ ] Check player ID doesn't change

## Common Issues

### Issue: "Player keeps getting new IDs"
**Solution:** Increase tracking distance and missing frames tolerance

### Issue: "Enemy is marked as player"
**Solution:** Increase size weight, ensure player is largest character

### Issue: "No player detected at all"
**Solution:** Lower threshold, check if persons are detected at all

### Issue: "Player detected then immediately lost"
**Solution:** Check priority tracking logic, ensure player checked first

## What the Code Does

### Priority Tracking (NEW):
```python
# Step 1: Check if box matches PLAYER first
if player_id exists:
    if distance < 200px:
        person_id = player_id  # Keep same ID
        
# Step 2: Check other tracked persons
else:
    for each tracked person:
        if distance < 100px:
            person_id = existing_id
            
# Step 3: Create new ID only if no match
if person_id is None:
    person_id = new_id
```

### Status Lock (NEW):
```python
# Once player is identified
if person_id == player_id:
    mark as player  # Always
    green box       # Always
    "YOU" label     # Always
```

## Expected Timeline

- **Frame 1-5**: Detection and tracking initialization
- **Frame 6**: Player locked (highest score)
- **Frame 7+**: Player keeps same ID, green box stays
- **Throughout**: Enemies get red boxes, different IDs

## Success Indicators

✅ Console shows "PLAYER LOCKED" once
✅ No new IDs created for player after lock
✅ Green box stays on same character
✅ Player ID visible in frame overlay
✅ No "WARNING" messages in console

## Need More Help?

If issue persists:
1. Share console output (copy/paste)
2. Note the frame where it breaks
3. Check player scores in video
4. Describe player position (center, edge, moving fast, etc.)
