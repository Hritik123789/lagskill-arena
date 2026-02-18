# Upgrade to Pro - Troubleshooting Guide

## Issue: Still Shows Locked After Upgrade

### Quick Fix (Try These in Order):

#### 1. Hard Refresh the Browser
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- This clears the cache and reloads everything

#### 2. Clear Browser Storage Manually
1. Open browser DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Local Storage" → `http://localhost:5173`
4. Delete all items
5. Refresh the page and login again

#### 3. Check if Backend Updated
Open browser console (F12) and run:
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

You should see:
```json
{
  "id": "...",
  "email": "...",
  "username": "...",
  "is_admin": false,
  "is_pro": true,    // ← Should be true
  "credits": 999     // ← Should be 999
}
```

If `is_pro` is still `false`, the localStorage wasn't updated.

#### 4. Manual Fix (If Above Doesn't Work)
Run this in browser console:
```javascript
// Get current user
let user = JSON.parse(localStorage.getItem('user'));
// Update to Pro
user.is_pro = true;
user.credits = 999;
// Save back
localStorage.setItem('user', JSON.stringify(user));
// Reload page
window.location.reload();
```

#### 5. Logout and Login Again
Sometimes the cleanest fix:
1. Click "Logout" in dashboard
2. Login again with your credentials
3. The backend will send fresh user data with Pro status

### What Was Fixed:

The upgrade flow now:
1. Calls `/api/user/upgrade-pro` to update database
2. Fetches fresh user data from `/api/auth/me`
3. Updates localStorage with the fresh data
4. Redirects to dashboard (instead of reload)

### Testing the Fix:

1. **Restart the frontend** (if it's running):
   ```bash
   # Stop the frontend (Ctrl+C)
   # Start it again
   npm run dev
   ```

2. **Try upgrading again** with a test user:
   - Go to `/upgrade`
   - Click "Upgrade to Pro"
   - Wait for success message
   - Should redirect to dashboard with Pro badge

3. **Verify Pro Features**:
   - Dashboard should show "PRO" badge
   - Credits should show "999" or "Unlimited"
   - Session detail page should show AI Coach insights (not locked)
   - No credit warnings on video upload

### Backend Verification:

Check if the database was updated:
```bash
# In MongoDB Compass or shell
db.users.find({ email: "your-email@example.com" })
```

Should show:
```json
{
  "is_pro": true,
  "credits": 999
}
```

### Common Issues:

1. **Browser Cache**: Hard refresh fixes this
2. **Old localStorage**: Clear and re-login
3. **Backend Not Running**: Make sure backend is running on port 8000
4. **Token Expired**: Logout and login again

### After Fix Works:

You should see:
- ✅ Pro badge in dashboard header
- ✅ "Plan: Pro" in plan status card
- ✅ "Unlimited analysis" message
- ✅ AI Coach insights unlocked in session reports
- ✅ No credit warnings
- ✅ "You're Already Pro!" message on upgrade page

---

**If still not working after all these steps, let me know and I'll investigate further!**
