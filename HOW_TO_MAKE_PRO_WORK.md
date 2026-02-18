# How to Make Pro Upgrade Work - Complete Guide

## Current Situation
- Upgrade to Pro button works (database gets updated)
- But frontend doesn't show Pro status
- AI Coach insights remain locked

## Root Cause
The JWT token contains user data from login time. When you upgrade, the database updates but the token still has old data (`is_pro: false`). The frontend uses this stale token data.

## THE WORKING SOLUTION

### Option 1: Use Admin Account (EASIEST)
The admin account (`admin@lagskill.com` / `Admin@123`) is already Pro by default.

1. Logout
2. Login as: `admin@lagskill.com` / `Admin@123`
3. Everything will work with Pro features!

### Option 2: Manual Database Update (FOR DEMO)
If you need a specific user to be Pro:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Go to database: `lagskill_arena`
4. Go to collection: `users`
5. Find your user (e.g., `test@example.com`)
6. Edit the document:
   ```json
   {
     "is_pro": true,
     "credits": 999
   }
   ```
7. Save
8. Logout from website
9. Login again
10. Pro features will work!

### Option 3: Fix the Code (PROPER FIX)

The issue is that `/api/auth/me` returns data from JWT token, not from database.

**Backend Fix (backend/auth.py):**

Find the `create_access_token` function and make sure it includes all user fields:

```python
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    # Make sure to include is_pro and credits in the token
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**Backend Fix (backend/main.py):**

Update the login endpoint to include fresh user data in token:

```python
@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch fresh user data from database
    users_collection = get_collection("users")
    fresh_user = await users_collection.find_one({"email": user["email"]})
    
    # Create token with ALL user data
    access_token = create_access_token(
        data={
            "sub": str(fresh_user["_id"]),
            "_id": str(fresh_user["_id"]),
            "email": fresh_user["email"],
            "username": fresh_user["username"],
            "is_admin": fresh_user.get("is_admin", False),
            "is_pro": fresh_user.get("is_pro", False),
            "credits": fresh_user.get("credits", 3),
            "is_active": fresh_user.get("is_active", True),
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}
```

After making these changes:
1. Restart backend
2. Logout
3. Login
4. Upgrade to Pro
5. Logout
6. Login again
7. Pro features will work!

## Quick Test (Console Commands)

Run these in browser console to test:

```javascript
// 1. Check localStorage
console.log('User:', JSON.parse(localStorage.getItem('user')));

// 2. Manually set Pro (temporary fix)
let user = JSON.parse(localStorage.getItem('user'));
user.is_pro = true;
user.credits = 999;
localStorage.setItem('user', JSON.stringify(user));
window.location.reload();

// 3. Check if backend upgrade worked
fetch('http://localhost:8000/api/user/upgrade-pro', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(console.log);
```

## For Hackathon Demo

**Simplest approach:**
1. Use admin account for demo
2. Or manually set users to Pro in MongoDB before demo
3. Show the upgrade flow (even if it requires logout/login)

## What's Working
✅ Backend upgrade endpoint (database updates correctly)
✅ Pro badge display logic
✅ AI Coach tips generation
✅ Credit system
✅ Feature gating UI

## What Needs Fix
❌ JWT token doesn't refresh after upgrade
❌ Need logout/login to see Pro status

## Recommended for Hackathon
Just use the admin account or pre-set users to Pro in MongoDB. The upgrade flow can be shown as a feature, and you can explain that in production it would trigger a token refresh or session update.

---

**Bottom line:** The easiest way right now is to use `admin@lagskill.com` / `Admin@123` which is already Pro, or manually update users in MongoDB Compass.
