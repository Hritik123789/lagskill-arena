from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
import shutil
import os
import cv2
import numpy as np
from ultralytics import YOLO
from typing import List

# Import our modules
from config import settings
from database import connect_to_mongo, close_mongo_connection, get_collection
from models import (
    UserCreate, UserLogin, User, Token, 
    SessionCreate, Session, ReactionTestResult, VideoAnalysisResult,
    UserStats
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_active_user, get_current_admin_user, get_current_user
)

app = FastAPI(title="LagSkillArena API WITH AUTH", version="1.0.0")
print("=" * 60)
print("LOADING MAIN.PY WITH AUTHENTICATION")
print("=" * 60)

# CORS - Allow all origins for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# YOLO Model - Patch torch.load to use weights_only=False
import torch
_original_torch_load = torch.load
def patched_torch_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_torch_load(*args, **kwargs)
torch.load = patched_torch_load

yolo_model = YOLO("yolov8n.pt")

# Startup/Shutdown Events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    # Create admin user if doesn't exist
    await create_admin_user()

# Mount static files for outputs with proper MIME types
from fastapi.staticfiles import StaticFiles

class VideoStaticFiles(StaticFiles):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if path.endswith('.mp4'):
            response.headers['Content-Type'] = 'video/mp4'
            response.headers['Accept-Ranges'] = 'bytes'
        return response

app.mount("/outputs", VideoStaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

async def create_admin_user():
    """Create default admin user"""
    users_collection = get_collection("users")
    admin = await users_collection.find_one({"email": settings.admin_email})
    if not admin:
        admin_user = {
            "email": settings.admin_email,
            "username": "admin",
            "full_name": "Administrator",
            "hashed_password": get_password_hash(settings.admin_password),
            "is_active": True,
            "is_admin": True,
            "is_pro": True,  # Admin is Pro
            "credits": 999,  # Unlimited credits
            "credits_reset_date": datetime.utcnow(),
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(admin_user)
        print(f"Admin user created: {settings.admin_email}")

# Root
@app.get("/")
def root():
    return {"message": "LagSkillArena API", "version": "1.0.0"}

# ==================== AUTH ROUTES ====================

@app.post("/api/auth/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """Register new user"""
    users_collection = get_collection("users")
    
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check username
    existing_username = await users_collection.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    user_dict = {
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "hashed_password": get_password_hash(user.password),
        "is_active": True,
        "is_admin": False,
        "is_pro": False,  # Free tier by default
        "credits": 3,  # 3 free credits
        "credits_reset_date": datetime.utcnow(),
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    # Create user stats
    stats_collection = get_collection("user_stats")
    await stats_collection.insert_one({
        "user_id": str(result.inserted_id),
        "total_sessions": 0,
        "total_reaction_tests": 0,
        "total_videos_analyzed": 0,
        "performance_tier": "Bronze"
    })
    
    return user_dict

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Login: User data from DB: is_pro={user.get('is_pro')}, credits={user.get('credits')}")
    
    # Include ALL user data in the JWT token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    token_data = {
        "sub": user["email"],
        "_id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "is_admin": user.get("is_admin", False),
        "is_pro": user.get("is_pro", False),
        "credits": user.get("credits", 3),
        "is_active": user.get("is_active", True),
    }
    print(f"Login: Token data: {token_data}")
    
    access_token = create_access_token(
        data=token_data, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_active_user)):
    """Get current user - returns current_user dict from JWT"""
    return current_user

# ==================== PRO/CREDITS ROUTES ====================

@app.post("/api/user/upgrade-pro")
async def upgrade_to_pro(current_user: dict = Depends(get_current_active_user)):
    """Upgrade user to Pro (mock payment for hackathon)"""
    users_collection = get_collection("users")
    
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "is_pro": True,
                "credits": 999  # Unlimited credits
            }
        }
    )
    
    return {
        "message": "Successfully upgraded to Pro!",
        "is_pro": True,
        "credits": 999
    }

@app.post("/api/user/use-credit")
async def use_credit(current_user: dict = Depends(get_current_active_user)):
    """Use one credit for video analysis"""
    users_collection = get_collection("users")
    
    # Pro users have unlimited credits
    if current_user.get("is_pro", False):
        return {"success": True, "credits_remaining": 999}
    
    # Check if user has credits
    credits = current_user.get("credits", 0)
    if credits <= 0:
        raise HTTPException(
            status_code=403,
            detail="No credits remaining. Upgrade to Pro for unlimited analysis!"
        )
    
    # Deduct credit
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$inc": {"credits": -1}}
    )
    
    return {
        "success": True,
        "credits_remaining": credits - 1
    }

# ==================== USER ROUTES ====================

@app.get("/api/users/stats")
async def get_user_stats(current_user: dict = Depends(get_current_active_user)):
    """Get user statistics"""
    stats_collection = get_collection("user_stats")
    stats = await stats_collection.find_one({"user_id": current_user["_id"]})
    if not stats:
        # Create default stats
        stats = {
            "user_id": current_user["_id"],
            "total_sessions": 0,
            "total_reaction_tests": 0,
            "total_videos_analyzed": 0,
            "performance_tier": "Bronze"
        }
        await stats_collection.insert_one(stats)
    
    stats["_id"] = str(stats["_id"])
    return stats

@app.get("/api/users/sessions")
async def get_user_sessions(
    limit: int = 10,
    current_user: dict = Depends(get_current_active_user)
):
    """Get user sessions"""
    sessions_collection = get_collection("sessions")
    cursor = sessions_collection.find({"user_id": current_user["_id"]}).sort("created_at", -1).limit(limit)
    sessions = await cursor.to_list(length=limit)
    
    for session in sessions:
        session["id"] = str(session["_id"])
        del session["_id"]
    
    return sessions

# ==================== SESSION ROUTES ====================

@app.post("/api/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(
    session: SessionCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create new session"""
    sessions_collection = get_collection("sessions")
    
    session_dict = session.dict()
    session_dict["user_id"] = current_user["_id"]
    session_dict["created_at"] = datetime.utcnow()
    
    result = await sessions_collection.insert_one(session_dict)
    
    # Update user stats
    stats_collection = get_collection("user_stats")
    update_data = {"$inc": {"total_sessions": 1}}
    
    if session.reaction_tests:
        update_data["$inc"]["total_reaction_tests"] = len(session.reaction_tests)
    
    if session.video_analysis:
        update_data["$inc"]["total_videos_analyzed"] = 1
    
    await stats_collection.update_one(
        {"user_id": current_user["_id"]},
        update_data
    )
    
    return {"id": str(result.inserted_id), "message": "Session created successfully"}

@app.get("/api/sessions/{session_id}")
async def get_session(
    session_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get session by ID"""
    from bson import ObjectId
    sessions_collection = get_collection("sessions")
    
    try:
        session = await sessions_collection.find_one({
            "_id": ObjectId(session_id),
            "user_id": current_user["_id"]
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid session ID format: {str(e)}")
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Convert _id to id for frontend
    session["id"] = str(session["_id"])
    del session["_id"]
    
    return session

# ==================== ADMIN ROUTES ====================

@app.get("/api/leaderboard")
async def get_leaderboard(
    game_preset: str = "all",
    limit: int = 100
):
    """Get global leaderboard (public endpoint)"""
    leaderboard_collection = get_collection("leaderboard")
    
    # Build query
    query = {}
    if game_preset != "all":
        query["game_preset"] = game_preset
    
    # Get top performers by best performance score
    cursor = leaderboard_collection.find(query).sort("best_performance_score", -1).limit(limit)
    entries = await cursor.to_list(length=limit)
    
    # Format response
    leaderboard = []
    for idx, entry in enumerate(entries):
        leaderboard.append({
            "rank": idx + 1,
            "username": entry.get("username", "Anonymous"),
            "performance_score": entry.get("best_performance_score", 0),
            "reaction_time": entry.get("best_reaction_time", 0),
            "fps": entry.get("latest_fps", 0),
            "game_preset": entry.get("game_preset", "unknown"),
            "updated_at": entry.get("updated_at", datetime.utcnow()).isoformat()
        })
    
    return {"leaderboard": leaderboard, "total": len(leaderboard)}

@app.get("/api/admin/users")
async def get_all_users(
    current_user: dict = Depends(get_current_admin_user)
):
    """Get all users (admin only)"""
    users_collection = get_collection("users")
    cursor = users_collection.find({})
    users = await cursor.to_list(length=100)
    
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("hashed_password", None)
    
    return users

@app.get("/api/admin/stats")
async def get_platform_stats(
    current_user: dict = Depends(get_current_admin_user)
):
    """Get platform statistics (admin only)"""
    users_collection = get_collection("users")
    sessions_collection = get_collection("sessions")
    
    total_users = await users_collection.count_documents({})
    total_sessions = await sessions_collection.count_documents({})
    
    return {
        "total_users": total_users,
        "total_sessions": total_sessions,
        "active_users": total_users  # Can be refined with activity tracking
    }

# ==================== VIDEO ANALYSIS ROUTES ====================

def analyze_video_file(path: str):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        return None

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_times = []
    motion_scores = []

    prev_gray = None
    prev_time = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Motion intensity via frame difference
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            motion = np.mean(diff)
            motion_scores.append(motion)

        prev_gray = gray

    cap.release()

    if len(motion_scores) == 0:
        avg_motion = 0.0
    else:
        avg_motion = float(np.mean(motion_scores))

    # Fake frame time stats from video FPS (recording-based)
    if fps and fps > 0:
        frame_time = 1000.0 / fps
        avg_frame_time = frame_time
        frame_time_std = 0.0  # we can't get real per-frame time from encoded video easily
    else:
        avg_frame_time = 0.0
        frame_time_std = 0.0

    # Simple stutter score proxy: higher motion + lower fps = more stress
    stutter_score = avg_motion / (fps + 1e-6)

    return {
        "video_fps": float(fps) if fps else 0.0,
        "avg_frame_time_ms": avg_frame_time,
        "frame_time_std_ms": frame_time_std,
        "avg_motion_intensity": avg_motion,
        "stutter_score": float(stutter_score),
    }

@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    stats = analyze_video_file(file_path)

    if stats is None:
        return {"error": "Could not process video"}

    return {
        "status": "analyzed",
        "filename": file.filename,
        "stats": stats
    }

@app.post("/analyze-video-version")
async def analyze_video_version(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    stats = analyze_video_file(file_path)

    if stats is None:
        return {"error": "Could not process video"}

    return {
        "status": "analyzed",
        "filename": file.filename,
        "stats": stats
    }

# ==================== VIDEO ANALYSIS ROUTES ====================

@app.post("/api/analyze-video")
async def analyze_video_authenticated(
    file: UploadFile = File(...),
    game_preset: str = "valorant",
    current_user: dict = Depends(get_current_active_user)
):
    """Analyze video (authenticated) - saves to user's session"""
    
    # Check credits (Pro users have unlimited)
    if not current_user.get("is_pro", False):
        credits = current_user.get("credits", 0)
        if credits <= 0:
            raise HTTPException(
                status_code=403,
                detail="No credits remaining. Upgrade to Pro for unlimited video analysis!"
            )
        
        # Deduct credit
        users_collection = get_collection("users")
        await users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$inc": {"credits": -1}}
        )
    
    result = await analyze_video_internal(file)
    
    # Save session to database with full details
    if result and "error" not in result:
        # Calculate benchmarks
        reaction_benchmark = calculate_percentile(
            result.get("estimated_reaction_time_ms", 0),
            "reaction_time",
            game_preset
        )
        fps_benchmark = calculate_percentile(
            result.get("video_fps", 0),
            "fps",
            game_preset
        )
        performance_benchmark = calculate_percentile(
            result.get("performance_score", 0),
            "performance",
            game_preset
        )
        
        sessions_collection = get_collection("sessions")
        session_data = {
            "user_id": current_user["_id"],
            "game_preset": game_preset,
            "video_filename": file.filename,
            "avg_characters": result.get("avg_characters", 0),
            "max_characters": result.get("max_characters", 0),
            "total_frames": result.get("total_frames", 0),
            "video_fps": result.get("video_fps", 0),
            "frame_time_ms": result.get("frame_time_ms", 0),
            "avg_motion_intensity": result.get("avg_motion_intensity", 0),
            "motion_stability": result.get("motion_stability", 0),
            "estimated_reaction_time_ms": result.get("estimated_reaction_time_ms", 0),
            "min_reaction_time_ms": result.get("min_reaction_time_ms", 0),
            "max_reaction_time_ms": result.get("max_reaction_time_ms", 0),
            "sudden_enemy_encounters": result.get("sudden_enemy_encounters", 0),
            "successful_eliminations": result.get("successful_eliminations", 0),
            "reaction_time_details": result.get("reaction_time_details", []),
            "performance_score": result.get("performance_score", 0),
            "scene_complexity_score": result.get("scene_complexity_score", 0),
            "annotated_video": result.get("annotated_video", ""),
            "heat_map": result.get("heat_map", []),  # NEW
            "timeline": result.get("timeline", []),  # NEW
            "benchmarks": {
                "reaction_time": reaction_benchmark,
                "fps": fps_benchmark,
                "performance": performance_benchmark
            },
            "created_at": datetime.utcnow()
        }
        
        # Generate verdict based on results
        verdict = generate_verdict(result)
        session_data["verdict"] = verdict
        
        # Generate AI coach tips
        ai_tips = generate_ai_tips(result)
        session_data["ai_tips"] = ai_tips
        
        result_id = await sessions_collection.insert_one(session_data)
        
        # Update user stats and leaderboard
        stats_collection = get_collection("user_stats")
        await stats_collection.update_one(
            {"user_id": current_user["_id"]},
            {
                "$inc": {"total_videos_analyzed": 1, "total_sessions": 1},
                "$max": {
                    "best_reaction_time": result.get("estimated_reaction_time_ms", 999),
                    "best_fps": result.get("video_fps", 0),
                    "best_performance_score": result.get("performance_score", 0)
                },
                "$setOnInsert": {
                    "total_reaction_tests": 0,
                    "performance_tier": "Bronze"
                }
            },
            upsert=True
        )
        
        # Update leaderboard entry
        leaderboard_collection = get_collection("leaderboard")
        await leaderboard_collection.update_one(
            {"user_id": current_user["_id"]},
            {
                "$set": {
                    "username": current_user.get("username", "Anonymous"),
                    "latest_performance_score": result.get("performance_score", 0),
                    "latest_reaction_time": result.get("estimated_reaction_time_ms", 0),
                    "latest_fps": result.get("video_fps", 0),
                    "game_preset": game_preset,
                    "updated_at": datetime.utcnow()
                },
                "$max": {
                    "best_performance_score": result.get("performance_score", 0)
                },
                "$min": {
                    "best_reaction_time": result.get("estimated_reaction_time_ms", 999)
                },
                "$setOnInsert": {
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        # Add verdict and benchmarks to result
        result["verdict"] = verdict
        result["benchmarks"] = {
            "reaction_time": reaction_benchmark,
            "fps": fps_benchmark,
            "performance": performance_benchmark
        }
        result["session_id"] = str(result_id.inserted_id)
    
    return result

def calculate_percentile(value: float, metric_type: str, game_preset: str = "valorant") -> dict:
    """Calculate percentile ranking for a metric"""
    # Community benchmarks by game (based on research data)
    benchmarks = {
        "valorant": {
            "reaction_time": {"avg": 250, "top25": 210, "top10": 180, "top1": 150},
            "fps": {"avg": 60, "top25": 90, "top10": 144, "top1": 240},
            "performance": {"avg": 60, "top25": 75, "top10": 85, "top1": 95}
        },
        "csgo": {
            "reaction_time": {"avg": 240, "top25": 200, "top10": 170, "top1": 140},
            "fps": {"avg": 80, "top25": 120, "top10": 200, "top1": 300},
            "performance": {"avg": 65, "top25": 78, "top10": 88, "top1": 96}
        },
        "bgmi": {
            "reaction_time": {"avg": 280, "top25": 240, "top10": 200, "top1": 160},
            "fps": {"avg": 45, "top25": 60, "top10": 90, "top1": 120},
            "performance": {"avg": 55, "top25": 70, "top10": 82, "top1": 93}
        }
    }
    
    game_data = benchmarks.get(game_preset.lower(), benchmarks["valorant"])
    metric_data = game_data.get(metric_type, {})
    
    if metric_type == "reaction_time":
        # Lower is better for reaction time
        if value <= metric_data.get("top1", 150):
            return {"percentile": "Top 1%", "rank": 99, "color": "purple"}
        elif value <= metric_data.get("top10", 180):
            return {"percentile": "Top 10%", "rank": 90, "color": "gold"}
        elif value <= metric_data.get("top25", 210):
            return {"percentile": "Top 25%", "rank": 75, "color": "green"}
        elif value <= metric_data.get("avg", 250):
            return {"percentile": "Above Average", "rank": 60, "color": "blue"}
        else:
            return {"percentile": "Below Average", "rank": 40, "color": "gray"}
    else:
        # Higher is better for FPS and performance
        if value >= metric_data.get("top1", 95):
            return {"percentile": "Top 1%", "rank": 99, "color": "purple"}
        elif value >= metric_data.get("top10", 85):
            return {"percentile": "Top 10%", "rank": 90, "color": "gold"}
        elif value >= metric_data.get("top25", 75):
            return {"percentile": "Top 25%", "rank": 75, "color": "green"}
        elif value >= metric_data.get("avg", 60):
            return {"percentile": "Above Average", "rank": 60, "color": "blue"}
        else:
            return {"percentile": "Below Average", "rank": 40, "color": "gray"}

def generate_verdict(results: dict) -> dict:
    """Generate a verdict based on analysis results"""
    fps = results.get("video_fps", 0)
    reaction_time = results.get("estimated_reaction_time_ms", 0)
    stability = results.get("motion_stability", 0)
    performance_score = results.get("performance_score", 0)
    
    good_fps = fps >= 60
    good_stability = stability >= 70
    good_reaction = reaction_time <= 250
    excellent_reaction = reaction_time <= 200
    
    # Excellent - Everything is great
    if good_fps and good_stability and excellent_reaction:
        return {
            "type": "excellent",
            "title": "🏆 Excellent Performance!",
            "description": "Your system is running smoothly and your skills are on point. You're in the top tier!",
            "recommendations": [
                "Keep practicing to maintain your edge",
                "Try more challenging scenarios",
                "Consider competitive play",
                "Share your setup with others"
            ]
        }
    
    # Good - System good, skills need work
    if good_fps and good_stability and not good_reaction:
        return {
            "type": "needs_work",
            "title": "⚡ Your Skills Need Work",
            "description": "Your system is performing well, but your reaction time and gameplay mechanics could use improvement.",
            "recommendations": [
                "Practice reaction time drills daily",
                "Focus on crosshair placement",
                "Review your gameplay to identify mistakes",
                "Work on game sense and positioning"
            ]
        }
    
    # System issues
    if not good_fps or not good_stability:
        return {
            "type": "upgrade",
            "title": "🖥️ System Upgrade Recommended",
            "description": "Your hardware is holding you back. Low FPS or instability is affecting your performance.",
            "recommendations": [
                "Lower graphics settings for better FPS",
                "Close background applications",
                "Consider hardware upgrades (GPU/CPU)",
                "Check for driver updates",
                "Monitor temperatures during gameplay"
            ]
        }
    
    # Good overall
    if good_fps and good_reaction:
        return {
            "type": "good",
            "title": "✅ Good Performance",
            "description": "You're doing well! Your system and skills are both solid. Keep it up!",
            "recommendations": [
                "Continue regular practice",
                "Fine-tune your sensitivity settings",
                "Watch pro player streams for tips",
                "Stay consistent with your routine"
            ]
        }
    
    # Default
    return {
        "type": "average",
        "title": "📊 Average Performance",
        "description": "You're doing okay, but there's room for improvement in both system and skills.",
        "recommendations": [
            "Optimize your game settings",
            "Practice aim training regularly",
            "Review your hardware specs",
            "Join community forums for tips"
        ]
    }

def generate_ai_tips(results: dict) -> list:
    """Generate AI coach tips based on analysis results"""
    tips = []
    
    reaction = results.get("estimated_reaction_time_ms", 0)
    fps = results.get("video_fps", 0)
    stability = results.get("motion_stability", 0)
    eliminations = results.get("successful_eliminations", 0)
    encounters = results.get("sudden_enemy_encounters", 0)
    
    # Reaction time tip
    if reaction < 180:
        tips.append("✓ Outstanding reaction speed! You're in the top 5% of players.")
    elif reaction < 220:
        tips.append("✓ Excellent reaction time - you have the reflexes for competitive play.")
    elif reaction < 260:
        tips.append("→ Good reaction time, but there's room for improvement with daily aim training.")
    else:
        tips.append("⚠ Reaction time needs work - try aim trainers like Aim Lab or Kovaak's for 15 minutes daily.")
    
    # FPS tip
    if fps >= 144:
        tips.append("✓ System running smoothly at high FPS - no performance bottlenecks detected.")
    elif fps >= 90:
        tips.append("→ Good FPS, but competitive players benefit from 144+ FPS for smoother gameplay.")
    elif fps >= 60:
        tips.append("→ Decent FPS, but consider lowering graphics settings for better responsiveness.")
    else:
        tips.append("⚠ Low FPS detected - this is significantly impacting your performance. Lower settings or upgrade GPU.")
    
    # Stability tip
    if stability >= 85:
        tips.append("✓ Frame times are very stable - smooth and consistent gameplay experience.")
    elif stability >= 70:
        tips.append("→ Frame times are mostly stable with minor variance during intense scenes.")
    elif stability >= 50:
        tips.append("⚠ Noticeable frame time variance - close background applications and check CPU usage.")
    else:
        tips.append("⚠ Significant frame drops and stuttering detected - system bottleneck likely affecting gameplay.")
    
    # Combat performance tip
    if encounters > 0:
        success_rate = (eliminations / encounters) * 100 if encounters > 0 else 0
        if success_rate >= 70:
            tips.append(f"✓ Strong combat performance - {int(success_rate)}% success rate in enemy encounters.")
        elif success_rate >= 50:
            tips.append(f"→ Decent combat performance ({int(success_rate)}% success rate) - focus on positioning and crosshair placement.")
        else:
            tips.append(f"⚠ Low combat success rate ({int(success_rate)}%) - work on pre-aiming common angles and reaction drills.")
    
    # Overall recommendation
    if fps < 60 and reaction > 250:
        tips.append("💡 Both system and skills need attention - start by optimizing settings, then practice aim training.")
    elif fps < 60:
        tips.append("💡 Your skills are solid, but your system is the main bottleneck - prioritize hardware upgrades.")
    elif reaction > 250:
        tips.append("💡 Your system is fine - focus on consistent practice and aim training to improve reaction time.")
    
    return tips

def detect_highlight_moments(timeline_data, enemy_encounters, reaction_times, fps, total_frames):
    """
    Detect exciting moments in gameplay for highlight reel
    Returns list of moments with start/end frames and scores
    """
    moments = []
    
    # 1. KILL STREAKS - Multiple enemies in short time
    for i, encounter in enumerate(enemy_encounters):
        encounter_frame = encounter['frame']
        enemies_in_window = encounter['new_persons']
        
        # Check for multiple enemies within 5 seconds
        window_start = encounter_frame
        window_end = encounter_frame + int(fps * 5)
        
        for j in range(i + 1, len(enemy_encounters)):
            if enemy_encounters[j]['frame'] <= window_end:
                enemies_in_window += enemy_encounters[j]['new_persons']
        
        # If 2+ enemies in 5 seconds, it's a highlight
        if enemies_in_window >= 2:
            moments.append({
                'type': 'kill_streak',
                'start_frame': max(0, encounter_frame - int(fps * 2)),  # 2 sec before
                'end_frame': min(total_frames, window_end + int(fps * 1)),  # 1 sec after
                'score': enemies_in_window * 30,  # Higher score for more enemies
                'description': f'{enemies_in_window} enemies in quick succession'
            })
    
    # 2. FAST REACTIONS - Quick eliminations
    for rt in reaction_times:
        if rt['reaction_time_ms'] < 800:  # Under 800ms is impressive
            reaction_score = 100 - (rt['reaction_time_ms'] / 10)
            moments.append({
                'type': 'fast_reaction',
                'start_frame': max(0, rt['encounter_frame'] - int(fps * 1.5)),
                'end_frame': min(total_frames, rt['elimination_frame'] + int(fps * 1)),
                'score': reaction_score,
                'description': f'Quick elimination ({int(rt["reaction_time_ms"])}ms)'
            })
    
    # 3. HIGH INTENSITY MOMENTS - Lots of movement/action
    if len(timeline_data) > 0:
        # Calculate motion intensity for each 3-second window
        window_size = int(fps * 3)
        for i in range(0, len(timeline_data) - window_size, int(fps)):
            window = timeline_data[i:i + window_size]
            avg_persons = sum(f['persons'] for f in window) / len(window)
            avg_motion = sum(f['motion'] for f in window) / len(window)
            
            # High intensity = many persons + high motion
            intensity_score = (avg_persons * 20) + (avg_motion / 5)
            
            if intensity_score > 50:  # Threshold for "exciting"
                moments.append({
                    'type': 'high_intensity',
                    'start_frame': window[0]['frame'],
                    'end_frame': window[-1]['frame'],
                    'score': intensity_score,
                    'description': f'Intense combat action'
                })
    
    # 4. CLUTCH MOMENTS - Surviving against multiple enemies
    # Look for frames with 3+ enemies where player survives for 5+ seconds
    for i, frame_data in enumerate(timeline_data):
        if frame_data['persons'] >= 3:
            # Check if player survives next 5 seconds
            survival_frames = int(fps * 5)
            end_idx = min(len(timeline_data), i + survival_frames)
            survived = True
            
            # Simple survival check: if enemies decrease, player likely survived
            if end_idx < len(timeline_data):
                if timeline_data[end_idx]['persons'] < frame_data['persons']:
                    moments.append({
                        'type': 'clutch',
                        'start_frame': max(0, frame_data['frame'] - int(fps * 2)),
                        'end_frame': min(total_frames, timeline_data[end_idx]['frame'] + int(fps * 1)),
                        'score': frame_data['persons'] * 25,
                        'description': f'Clutch vs {frame_data["persons"]} enemies'
                    })
    
    # Remove overlapping moments (keep highest score)
    moments = merge_overlapping_moments(moments)
    
    # Sort by score and take top 5
    moments.sort(key=lambda x: x['score'], reverse=True)
    top_moments = moments[:5]
    
    print(f"🎬 Detected {len(moments)} highlight moments, selected top {len(top_moments)}")
    for m in top_moments:
        print(f"   - {m['type']}: {m['description']} (score: {m['score']:.1f})")
    
    return top_moments

def merge_overlapping_moments(moments):
    """Merge overlapping moments, keeping the one with higher score"""
    if len(moments) <= 1:
        return moments
    
    # Sort by start frame
    moments.sort(key=lambda x: x['start_frame'])
    
    merged = []
    current = moments[0]
    
    for next_moment in moments[1:]:
        # Check if overlapping
        if next_moment['start_frame'] <= current['end_frame']:
            # Keep the one with higher score
            if next_moment['score'] > current['score']:
                current = next_moment
        else:
            merged.append(current)
            current = next_moment
    
    merged.append(current)
    return merged

def generate_highlight_reel(input_video_path, moments, fps, original_filename):
    """
    Generate a highlight reel video from selected moments
    """
    if len(moments) == 0:
        print("⚠ No highlight moments to generate reel")
        return None
    
    # Open input video
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        print("❌ Could not open video for highlight generation")
        return None
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Create output path
    highlight_filename = f"highlights_{original_filename}"
    highlight_path = os.path.join(OUTPUT_DIR, highlight_filename)
    
    # Video writer
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(highlight_path, fourcc, fps, (width, height))
    
    print(f"🎬 Generating highlight reel: {highlight_filename}")
    
    # Extract and write each moment
    for idx, moment in enumerate(moments):
        print(f"   Processing moment {idx + 1}/{len(moments)}: {moment['description']}")
        
        # Seek to start frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, moment['start_frame'])
        
        # Read and write frames for this moment
        frames_to_write = moment['end_frame'] - moment['start_frame']
        frames_written = 0
        
        while frames_written < frames_to_write:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Add moment label overlay
            label = f"#{idx + 1}: {moment['description']}"
            cv2.rectangle(frame, (10, height - 50), (width - 10, height - 10), (0, 0, 0), -1)
            cv2.putText(frame, label, (20, height - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
            out.write(frame)
            frames_written += 1
        
        # Add transition frame (black frame with text)
        if idx < len(moments) - 1:  # Not last moment
            transition_frame = np.zeros((height, width, 3), dtype=np.uint8)
            cv2.putText(transition_frame, "NEXT HIGHLIGHT", (width // 2 - 150, height // 2), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 3)
            for _ in range(int(fps * 0.5)):  # 0.5 second transition
                out.write(transition_frame)
    
    cap.release()
    out.release()
    
    print(f"✅ Highlight reel generated: {highlight_filename}")
    return highlight_filename

@app.post("/analyze-video-vision")
async def analyze_video_vision(file: UploadFile = File(...)):
    """Analyze video (public demo)"""
    return await analyze_video_internal(file)

async def analyze_video_internal(file: UploadFile):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return {"error": "Could not open video"}

    # Get video properties for output
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Create output video path
    output_filename = f"annotated_{file.filename}"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Video writer for annotated output
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_count = 0
    total_persons = 0
    max_persons_in_frame = 0
    motion_scores = []
    persons_per_frame = []
    prev_gray = None
    
    # Enhanced tracking
    person_positions = []
    enemy_encounters = []
    reaction_times = []
    
    # Heat map data - track where characters appear
    heat_map_data = np.zeros((height // 10, width // 10))
    
    # Frame-by-frame timeline data
    timeline_data = []
    
    # Advanced tracking - assign IDs to persons
    person_tracker = {}  # {id: {positions: [], last_seen: frame, is_player: bool}}
    next_person_id = 1
    
    # Player detection (assume center-most person is player)
    player_id = None
    
    # Previous frame data
    prev_person_count = 0
    prev_person_boxes = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Calculate motion intensity
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            motion = np.mean(diff)
            motion_scores.append(motion)
        prev_gray = gray

        # Run YOLO with enhanced parameters
        results = yolo_model(
            frame, 
            verbose=False,
            conf=0.3,  # Lower confidence threshold for better detection
            iou=0.5,   # Intersection over union threshold
            max_det=10  # Maximum detections per frame
        )

        persons_in_frame = 0
        current_person_boxes = []
        frame_detections = []
        temp_detections = []  # Store all detections first for two-pass processing
        
        # Center of frame (for player detection)
        center_x = width / 2
        center_y = height / 2
        
        # FIRST PASS: Collect all detections
        for r in results:
            if r.boxes is not None:
                for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
                    if int(cls) == 0:  # 0 = person class
                        x1, y1, x2, y2 = map(int, box)
                        
                        # Calculate box properties
                        box_center_x = (x1 + x2) / 2
                        box_center_y = (y1 + y2) / 2
                        box_width = x2 - x1
                        box_height = y2 - y1
                        box_area = box_width * box_height
                        
                        persons_in_frame += 1
                        
                        # Estimate distance from camera based on box size
                        estimated_distance = 1000 / (box_height + 1)
                        
                        temp_detections.append({
                            'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                            'box_center_x': box_center_x,
                            'box_center_y': box_center_y,
                            'box_width': box_width,
                            'box_height': box_height,
                            'box_area': box_area,
                            'conf': conf,
                            'estimated_distance': estimated_distance
                        })
        
        # Find largest box in this frame (likely the player)
        largest_box_area = 0
        largest_box_idx = -1
        for idx, det in enumerate(temp_detections):
            if det['box_area'] > largest_box_area:
                largest_box_area = det['box_area']
                largest_box_idx = idx
        
        # SECOND PASS: Process detections with tracking
        player_matched_this_frame = False  # Track if player was already matched
        
        for idx, det in enumerate(temp_detections):
            x1, y1, x2, y2 = det['x1'], det['y1'], det['x2'], det['y2']
            box_center_x = det['box_center_x']
            box_center_y = det['box_center_y']
            box_width = det['box_width']
            box_height = det['box_height']
            box_area = det['box_area']
            conf = det['conf']
            estimated_distance = det['estimated_distance']
            is_largest_box = (idx == largest_box_idx)
            
            # Track or assign ID FIRST
            person_id = None
            min_dist = float('inf')
            
            # Try to match with existing player using distance first
            if player_id is not None and player_id in person_tracker and not player_matched_this_frame:
                pdata = person_tracker[player_id]
                if pdata['last_seen'] >= frame_count - 10:
                    last_pos = pdata['positions'][-1]
                    dist = np.sqrt(
                        (box_center_x - last_pos['x'])**2 + 
                        (box_center_y - last_pos['y'])**2
                    )
                    if dist < 300:
                        person_id = player_id
                        player_matched_this_frame = True
                        print(f"✅ Player ID {player_id} matched by distance ({dist:.1f}px) at frame {frame_count}")
            
            # If player not matched by distance, check if this is largest box
            if person_id is None and player_id is not None and is_largest_box and not player_matched_this_frame:
                person_id = player_id
                player_matched_this_frame = True
                print(f"✅ Player ID {player_id} matched as LARGEST BOX at frame {frame_count}")
            
            # If not matched to player, try other tracked persons (enemies)
            if person_id is None:
                best_match_score = 0
                best_match_id = None
                
                for pid, pdata in person_tracker.items():
                    if pid == player_id:  # Skip player, already checked
                        continue
                    if pdata['last_seen'] >= frame_count - 15:  # Very lenient: 15 frames
                        last_pos = pdata['positions'][-1]
                        dist = np.sqrt(
                            (box_center_x - last_pos['x'])**2 + 
                            (box_center_y - last_pos['y'])**2
                        )
                        
                        # Calculate match score based on distance and size similarity
                        if dist < 300:  # Very lenient distance
                            # Distance score (closer = better)
                            distance_score = max(0, 100 - (dist / 3))
                            
                            # Size similarity score (similar size = likely same person)
                            if 'last_area' in pdata:
                                size_diff = abs(box_area - pdata['last_area']) / pdata['last_area']
                                size_score = max(0, 100 - (size_diff * 100))
                            else:
                                size_score = 50
                            
                            # Combined score
                            match_score = distance_score * 0.7 + size_score * 0.3
                            
                            if match_score > best_match_score:
                                best_match_score = match_score
                                best_match_id = pid
                
                if best_match_id is not None and best_match_score > 30:  # Low threshold
                    person_id = best_match_id
            
            # New person detected
            if person_id is None:
                person_id = next_person_id
                next_person_id += 1
                person_tracker[person_id] = {
                    'positions': [],
                    'last_seen': frame_count,
                    'is_player': False,
                    'first_seen': frame_count,
                    'player_score': 0
                }
                print(f"🆕 New person detected: ID {person_id} at frame {frame_count}")
            
            # Update tracker
            person_tracker[person_id]['positions'].append({
                'x': box_center_x,
                'y': box_center_y,
                'frame': frame_count
            })
            person_tracker[person_id]['last_seen'] = frame_count
            person_tracker[person_id]['last_area'] = box_area  # Store area for size matching
            
            # IMPROVED PLAYER DETECTION
            # For third-person games, player is usually:
            # 1. Largest box (closest to camera) - MOST IMPORTANT
            # 2. In bottom-center of screen
            # 3. Most consistent across frames
            
            # Calculate position score for player detection
            # Higher score = more likely to be player
            player_score = 0
            
            # Score 1: Size (larger = closer = likely player) - HIGHEST WEIGHT
            size_score = box_area / (width * height) * 100  # Percentage of screen
            player_score += size_score * 5  # Weight: 5x (increased from 3x)
            
            # Score 2: Bottom position (player usually in bottom half)
            if box_center_y > height * 0.5:  # Bottom half
                bottom_score = (box_center_y / height) * 50  # 0-50 points
                player_score += bottom_score * 2  # Weight: 2x
            
            # Score 3: Horizontal center (player usually centered horizontally)
            horizontal_center_dist = abs(box_center_x - center_x)
            horizontal_score = max(0, 50 - (horizontal_center_dist / width * 100))
            player_score += horizontal_score
            
            # Score 4: Consistency (if tracked for many frames)
            frames_tracked = frame_count - person_tracker[person_id]['first_seen']
            consistency_score = min(50, frames_tracked / 2)  # Up to 50 points over 100 frames
            player_score += consistency_score
            
            # Store the score
            person_tracker[person_id]['player_score'] = player_score
            
            # Calculate velocity (if we have previous position)
            velocity_x, velocity_y = 0, 0
            if len(person_tracker[person_id]['positions']) > 1:
                prev_pos = person_tracker[person_id]['positions'][-2]
                velocity_x = box_center_x - prev_pos['x']
                velocity_y = box_center_y - prev_pos['y']
            
            # CRITICAL: is_player is ONLY true if this person_id matches the locked player_id
            # This prevents multiple people from being marked as player
            is_player = (player_id is not None and person_id == player_id)
            
            # DEBUG: Log when someone is marked as player
            if is_player:
                print(f"🎮 Marking person ID {person_id} as PLAYER at frame {frame_count} (box area: {box_area:.0f})")
            
            # Update heat map (only for enemies)
            if not is_player:
                heat_x = int(box_center_x / 10)
                heat_y = int(box_center_y / 10)
                if 0 <= heat_y < heat_map_data.shape[0] and 0 <= heat_x < heat_map_data.shape[1]:
                    heat_map_data[heat_y, heat_x] += 1
            
            current_person_boxes.append({
                'id': person_id,
                'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                'center_x': box_center_x,
                'center_y': box_center_y,
                'area': box_area,
                'conf': float(conf),
                'is_player': is_player,
                'distance': estimated_distance,
                'velocity_x': velocity_x,
                'velocity_y': velocity_y
            })
            
            frame_detections.append({
                'id': person_id,
                'x': int(box_center_x),
                'y': int(box_center_y),
                'confidence': float(conf),
                'is_player': is_player
            })
            
            # ENHANCED VISUALIZATION
            # Choose color based on player/enemy
            if is_player:
                color = (0, 255, 0)  # Green for player
                label = f"YOU"  # Simplified - no ID shown
                thickness = 3
            else:
                # Red for enemies
                color = (0, 0, 255)  # Red for enemy
                label = f"ENEMY"  # Simplified - no ID shown to avoid confusion from ID changes
                thickness = 2
            
            # Draw main bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)
            
            # Draw label background
            label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
            cv2.rectangle(
                frame,
                (x1, y1 - label_size[1] - 10),
                (x1 + label_size[0] + 10, y1),
                color,
                -1  # Filled
            )
            
            # Draw label text
            cv2.putText(
                frame,
                label,
                (x1 + 5, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),  # White text
                2
            )
            
            # Draw confidence score
            conf_text = f"{conf:.0%}"
            cv2.putText(
                frame,
                conf_text,
                (x1, y2 + 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                2
            )
            
            # DEBUG: Show player score for first 30 frames to help verify detection
            if frame_count <= 30 and not is_player:
                score_text = f"Score: {player_score:.0f}"
                cv2.putText(
                    frame,
                    score_text,
                    (x1, y1 - 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.4,
                    (255, 255, 0),  # Yellow
                    1
                )
            
            # Draw distance indicator (for enemies)
            if not is_player:
                dist_text = f"{estimated_distance:.0f}m"
                cv2.putText(
                    frame,
                    dist_text,
                    (x1, y2 + 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 255, 0),  # Yellow
                    2
                )
            
            # Draw velocity arrow (movement prediction)
            if abs(velocity_x) > 2 or abs(velocity_y) > 2:
                arrow_end_x = int(box_center_x + velocity_x * 3)
                arrow_end_y = int(box_center_y + velocity_y * 3)
                cv2.arrowedLine(
                    frame,
                    (int(box_center_x), int(box_center_y)),
                    (arrow_end_x, arrow_end_y),
                    (255, 255, 0),  # Yellow arrow
                    2,
                    tipLength=0.3
                )
            
            # Draw center dot
            cv2.circle(frame, (int(box_center_x), int(box_center_y)), 3, color, -1)

        # PLAYER SELECTION LOGIC - After all detections processed
        # Determine if we need to select/lock a player
        if player_id is None and frame_count > 5:
            # Find person with highest player score (should be largest box)
            best_score = 0
            best_candidate = None
            for pid, pdata in person_tracker.items():
                if pdata['last_seen'] >= frame_count - 3:  # Active in last 3 frames
                    score = pdata.get('player_score', 0)
                    if score > best_score:
                        best_score = score
                        best_candidate = pid
            
            # Lock the player
            if best_candidate and best_score > 50:
                player_id = best_candidate
                person_tracker[best_candidate]['is_player'] = True
                print(f"🎯 PLAYER LOCKED: ID {player_id} with score {best_score:.1f} at frame {frame_count}")
        
        # Ensure player status is set
        if player_id is not None and player_id in person_tracker:
            person_tracker[player_id]['is_player'] = True

        # Add frame info overlay with player detection status
        player_detected_text = f"Player: ID {player_id}" if player_id else "Player: Detecting..."
        info_text = f"Frame: {frame_count} | {player_detected_text} | Enemies: {persons_in_frame - (1 if player_id else 0)} | FPS: {fps:.1f}"
        cv2.rectangle(frame, (10, 10), (600, 40), (0, 0, 0), -1)
        cv2.putText(frame, info_text, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

        # Store timeline data for this frame
        timeline_data.append({
            'frame': frame_count,
            'time': frame_count / fps if fps > 0 else 0,
            'persons': persons_in_frame,
            'motion': float(motion_scores[-1]) if motion_scores else 0,
            'detections': frame_detections
        })

        # Detect new enemy encounters
        if persons_in_frame > prev_person_count:
            new_persons = persons_in_frame - prev_person_count
            new_boxes = []
            for curr_box in current_person_boxes:
                if not curr_box['is_player']:  # Only count enemies
                    is_new = True
                    for prev_box in prev_person_boxes:
                        if prev_box['id'] == curr_box['id']:
                            is_new = False
                            break
                    if is_new:
                        new_boxes.append(curr_box)
            
            if len(new_boxes) > 0:
                enemy_encounters.append({
                    'frame': frame_count,
                    'time_sec': frame_count / fps if fps > 0 else 0,
                    'new_persons': len(new_boxes),
                    'boxes': new_boxes
                })

        # Track eliminations
        if persons_in_frame < prev_person_count and len(enemy_encounters) > 0:
            last_encounter = enemy_encounters[-1]
            frames_since_encounter = frame_count - last_encounter['frame']
            
            if 0 < frames_since_encounter < (fps * 3):
                reaction_time_ms = (frames_since_encounter / fps) * 1000 if fps > 0 else 0
                reaction_times.append({
                    'encounter_frame': last_encounter['frame'],
                    'elimination_frame': frame_count,
                    'reaction_time_ms': reaction_time_ms,
                    'frames_elapsed': frames_since_encounter
                })

        persons_per_frame.append(persons_in_frame)
        total_persons += persons_in_frame
        max_persons_in_frame = max(max_persons_in_frame, persons_in_frame)

        # Update previous frame data
        prev_person_count = persons_in_frame
        prev_person_boxes = current_person_boxes

        # Write annotated frame
        out.write(frame)

    cap.release()
    out.release()

    if frame_count > 0:
        avg_characters = total_persons / frame_count
        avg_motion = float(np.mean(motion_scores)) if motion_scores else 0.0
        motion_std = float(np.std(motion_scores)) if motion_scores else 0.0
    else:
        avg_characters = 0.0
        avg_motion = 0.0
        motion_std = 0.0

    # Calculate FPS metrics
    video_fps = float(fps) if fps else 0.0
    frame_time_ms = (1000.0 / fps) if fps > 0 else 0.0
    
    # Calculate average reaction time
    if len(reaction_times) > 0:
        avg_reaction_time = sum(rt['reaction_time_ms'] for rt in reaction_times) / len(reaction_times)
        min_reaction_time = min(rt['reaction_time_ms'] for rt in reaction_times)
        max_reaction_time = max(rt['reaction_time_ms'] for rt in reaction_times)
    else:
        avg_reaction_time = 250
        min_reaction_time = 200
        max_reaction_time = 300

    # Calculate performance score
    scene_complexity_score = avg_characters + 0.5 * max_persons_in_frame
    fps_stability = 100 - min(motion_std / 10, 100) if motion_std > 0 else 100
    performance_score = min(100, (fps_stability * 0.4) + ((100 - min(avg_motion, 100)) * 0.3) + (min(video_fps / 60 * 100, 100) * 0.3))

    # Prepare heat map data
    heat_map_normalized = (heat_map_data / heat_map_data.max() * 100).tolist() if heat_map_data.max() > 0 else []

    # Prepare encounter summary
    encounter_summary = []
    for i, encounter in enumerate(enemy_encounters[:10]):
        encounter_summary.append({
            'encounter_num': i + 1,
            'time_sec': round(encounter['time_sec'], 2),
            'new_enemies': encounter['new_persons']
        })

    # Prepare reaction time summary
    reaction_summary = []
    for i, rt in enumerate(reaction_times[:10]):
        reaction_summary.append({
            'encounter_num': i + 1,
            'reaction_time_ms': round(rt['reaction_time_ms'], 0),
            'time_sec': round(rt['encounter_frame'] / fps, 2) if fps > 0 else 0
        })

    return {
        "status": "analyzed",
        "filename": file.filename,
        "avg_characters": round(avg_characters, 3),
        "max_characters": int(max_persons_in_frame),
        "total_frames": int(frame_count),
        "scene_complexity_score": round(scene_complexity_score, 3),
        "annotated_video": output_filename,
        "video_fps": round(video_fps, 2),
        "frame_time_ms": round(frame_time_ms, 2),
        "avg_motion_intensity": round(avg_motion, 2),
        "motion_stability": round(fps_stability, 2),
        "estimated_reaction_time_ms": int(avg_reaction_time),
        "min_reaction_time_ms": int(min_reaction_time),
        "max_reaction_time_ms": int(max_reaction_time),
        "sudden_enemy_encounters": len(enemy_encounters),
        "successful_eliminations": len(reaction_times),
        "performance_score": round(performance_score, 2),
        "persons_per_frame": persons_per_frame[:100],
        "encounter_details": encounter_summary,
        "reaction_time_details": reaction_summary,
        "heat_map": heat_map_normalized,
        "timeline": timeline_data[:100],
        "total_persons_tracked": len(person_tracker),  # NEW
        "player_detected": player_id is not None  # NEW
    }
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return {"error": "Could not open video"}

    # Get video properties for output
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Create output video path
    output_filename = f"annotated_{file.filename}"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Video writer for annotated output
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_count = 0
    total_persons = 0
    max_persons_in_frame = 0
    motion_scores = []
    persons_per_frame = []
    prev_gray = None
    
    # Enhanced tracking
    person_positions = []
    enemy_encounters = []
    reaction_times = []
    
    # Heat map data - track where characters appear
    heat_map_data = np.zeros((height // 10, width // 10))  # Reduced resolution for heat map
    
    # Frame-by-frame timeline data
    timeline_data = []
    
    # Previous frame data
    prev_person_count = 0
    prev_person_boxes = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Calculate motion intensity
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            motion = np.mean(diff)
            motion_scores.append(motion)
        prev_gray = gray

        # Run YOLO on frame
        results = yolo_model(frame, verbose=False)

        persons_in_frame = 0
        current_person_boxes = []
        frame_detections = []
        
        for r in results:
            if r.boxes is not None:
                for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
                    if int(cls) == 0:  # 0 = person class
                        persons_in_frame += 1
                        x1, y1, x2, y2 = map(int, box)
                        
                        # Store box info for tracking
                        box_center_x = (x1 + x2) / 2
                        box_center_y = (y1 + y2) / 2
                        box_area = (x2 - x1) * (y2 - y1)
                        
                        # Update heat map
                        heat_x = int(box_center_x / 10)
                        heat_y = int(box_center_y / 10)
                        if 0 <= heat_y < heat_map_data.shape[0] and 0 <= heat_x < heat_map_data.shape[1]:
                            heat_map_data[heat_y, heat_x] += 1
                        
                        current_person_boxes.append({
                            'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                            'center_x': box_center_x,
                            'center_y': box_center_y,
                            'area': box_area,
                            'conf': float(conf)
                        })
                        
                        frame_detections.append({
                            'x': int(box_center_x),
                            'y': int(box_center_y),
                            'confidence': float(conf)
                        })
                        
                        label = f"Person {conf:.2f}"

                        # Draw rectangle
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        # Draw label
                        cv2.putText(
                            frame,
                            label,
                            (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.6,
                            (0, 255, 0),
                            2,
                        )

        # Store timeline data for this frame
        timeline_data.append({
            'frame': frame_count,
            'time': frame_count / fps if fps > 0 else 0,
            'persons': persons_in_frame,
            'motion': float(motion_scores[-1]) if motion_scores else 0,
            'detections': frame_detections
        })

        # Detect new enemy encounters (sudden appearance of new person)
        if persons_in_frame > prev_person_count:
            # New person(s) appeared
            new_persons = persons_in_frame - prev_person_count
            
            # Try to identify which boxes are new by comparing positions
            new_boxes = []
            for curr_box in current_person_boxes:
                is_new = True
                for prev_box in prev_person_boxes:
                    # Calculate distance between centers
                    dist = np.sqrt(
                        (curr_box['center_x'] - prev_box['center_x'])**2 + 
                        (curr_box['center_y'] - prev_box['center_y'])**2
                    )
                    # If close to previous position, not a new person
                    if dist < 100:  # threshold in pixels
                        is_new = False
                        break
                
                if is_new:
                    new_boxes.append(curr_box)
            
            if len(new_boxes) > 0:
                enemy_encounters.append({
                    'frame': frame_count,
                    'time_sec': frame_count / fps if fps > 0 else 0,
                    'new_persons': len(new_boxes),
                    'boxes': new_boxes
                })

        # Track when persons disappear (potential kills/eliminations)
        if persons_in_frame < prev_person_count and len(enemy_encounters) > 0:
            # Person disappeared - calculate reaction time from last encounter
            last_encounter = enemy_encounters[-1]
            frames_since_encounter = frame_count - last_encounter['frame']
            
            # Only count if disappearance is within reasonable time (1-3 seconds)
            if 0 < frames_since_encounter < (fps * 3):
                reaction_time_ms = (frames_since_encounter / fps) * 1000 if fps > 0 else 0
                reaction_times.append({
                    'encounter_frame': last_encounter['frame'],
                    'elimination_frame': frame_count,
                    'reaction_time_ms': reaction_time_ms,
                    'frames_elapsed': frames_since_encounter
                })

        persons_per_frame.append(persons_in_frame)
        total_persons += persons_in_frame
        max_persons_in_frame = max(max_persons_in_frame, persons_in_frame)

        # Update previous frame data
        prev_person_count = persons_in_frame
        prev_person_boxes = current_person_boxes

        # Write annotated frame
        out.write(frame)

    cap.release()
    out.release()

    if frame_count > 0:
        avg_characters = total_persons / frame_count
        avg_motion = float(np.mean(motion_scores)) if motion_scores else 0.0
        motion_std = float(np.std(motion_scores)) if motion_scores else 0.0
    else:
        avg_characters = 0.0
        avg_motion = 0.0
        motion_std = 0.0

    # Calculate FPS metrics
    video_fps = float(fps) if fps else 0.0
    frame_time_ms = (1000.0 / fps) if fps > 0 else 0.0
    
    # Calculate average reaction time from actual gameplay
    if len(reaction_times) > 0:
        avg_reaction_time = sum(rt['reaction_time_ms'] for rt in reaction_times) / len(reaction_times)
        min_reaction_time = min(rt['reaction_time_ms'] for rt in reaction_times)
        max_reaction_time = max(rt['reaction_time_ms'] for rt in reaction_times)
    else:
        # Fallback to estimation if no clear eliminations detected
        avg_reaction_time = 250  # Default estimate
        min_reaction_time = 200
        max_reaction_time = 300

    # Calculate performance score
    scene_complexity_score = avg_characters + 0.5 * max_persons_in_frame
    
    # FPS stability score (lower std = more stable)
    fps_stability = 100 - min(motion_std / 10, 100) if motion_std > 0 else 100
    
    # Overall performance score
    performance_score = min(100, (fps_stability * 0.4) + ((100 - min(avg_motion, 100)) * 0.3) + (min(video_fps / 60 * 100, 100) * 0.3))

    # Prepare heat map data for frontend (normalize and convert to list)
    heat_map_normalized = (heat_map_data / heat_map_data.max() * 100).tolist() if heat_map_data.max() > 0 else []

    # Prepare detailed encounter data for frontend
    encounter_summary = []
    for i, encounter in enumerate(enemy_encounters[:10]):  # Limit to first 10 for response size
        encounter_summary.append({
            'encounter_num': i + 1,
            'time_sec': round(encounter['time_sec'], 2),
            'new_enemies': encounter['new_persons']
        })

    # Prepare reaction time summary
    reaction_summary = []
    for i, rt in enumerate(reaction_times[:10]):  # Limit to first 10
        reaction_summary.append({
            'encounter_num': i + 1,
            'reaction_time_ms': round(rt['reaction_time_ms'], 0),
            'time_sec': round(rt['encounter_frame'] / fps, 2) if fps > 0 else 0
        })

    return {
        "status": "analyzed",
        "filename": file.filename,
        "avg_characters": round(avg_characters, 3),
        "max_characters": int(max_persons_in_frame),
        "total_frames": int(frame_count),
        "scene_complexity_score": round(scene_complexity_score, 3),
        "annotated_video": output_filename,
        "video_fps": round(video_fps, 2),
        "frame_time_ms": round(frame_time_ms, 2),
        "avg_motion_intensity": round(avg_motion, 2),
        "motion_stability": round(fps_stability, 2),
        "estimated_reaction_time_ms": int(avg_reaction_time),
        "min_reaction_time_ms": int(min_reaction_time),
        "max_reaction_time_ms": int(max_reaction_time),
        "sudden_enemy_encounters": len(enemy_encounters),
        "successful_eliminations": len(reaction_times),
        "performance_score": round(performance_score, 2),
        "persons_per_frame": persons_per_frame[:100],  # First 100 frames for graphing
        "encounter_details": encounter_summary,
        "reaction_time_details": reaction_summary,
        "heat_map": heat_map_normalized,  # NEW: Heat map data
        "timeline": timeline_data[:100]  # NEW: Frame-by-frame timeline (first 100 frames)
    }

@app.get("/download-video/{filename}")
async def download_video(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    return FileResponse(file_path, media_type="video/mp4", filename=filename)


# ============================================
# HIGHLIGHT REEL GENERATION
# ============================================

def detect_highlight_moments(timeline_data, enemy_encounters, reaction_times, fps, total_frames):
    """
    Detect exciting moments in gameplay based on multiple factors:
    - High enemy activity (multiple enemies)
    - Quick eliminations (fast reaction times)
    - Intense combat (high motion + enemies)
    - Clutch moments (surviving intense situations)
    """
    highlights = []
    
    # Score each moment in the timeline
    for i, frame_data in enumerate(timeline_data):
        frame_num = frame_data['frame']
        time_sec = frame_data['time']
        persons = frame_data['persons']
        motion = frame_data['motion']
        
        excitement_score = 0
        moment_type = []
        
        # Factor 1: Multiple enemies (high person count)
        if persons >= 3:
            excitement_score += 30 * persons
            moment_type.append("multi_enemy")
        elif persons >= 2:
            excitement_score += 20 * persons
            moment_type.append("combat")
        
        # Factor 2: High motion (intense action)
        if motion > 15:
            excitement_score += motion * 2
            moment_type.append("intense_action")
        
        # Factor 3: Enemy encounter nearby
        for encounter in enemy_encounters:
            frames_diff = abs(frame_num - encounter['frame'])
            if frames_diff < fps * 2:  # Within 2 seconds
                excitement_score += 40
                moment_type.append("enemy_encounter")
                break
        
        # Factor 4: Quick elimination nearby
        for rt in reaction_times:
            frames_diff = abs(frame_num - rt['elimination_frame'])
            if frames_diff < fps * 1:  # Within 1 second
                # Bonus for fast reactions
                if rt['reaction_time_ms'] < 300:
                    excitement_score += 50
                    moment_type.append("quick_kill")
                else:
                    excitement_score += 30
                    moment_type.append("elimination")
                break
        
        # Store if exciting enough
        if excitement_score > 50:
            highlights.append({
                'frame': frame_num,
                'time_sec': time_sec,
                'score': excitement_score,
                'types': moment_type,
                'persons': persons,
                'motion': motion
            })
    
    # Merge nearby highlights (avoid overlapping clips)
    merged_highlights = []
    if highlights:
        highlights.sort(key=lambda x: x['score'], reverse=True)
        
        for highlight in highlights:
            # Check if too close to existing highlight
            too_close = False
            for existing in merged_highlights:
                time_diff = abs(highlight['time_sec'] - existing['time_sec'])
                if time_diff < 5:  # Less than 5 seconds apart
                    too_close = True
                    # Keep the higher score
                    if highlight['score'] > existing['score']:
                        merged_highlights.remove(existing)
                        too_close = False
                    break
            
            if not too_close:
                merged_highlights.append(highlight)
        
        # Sort by time
        merged_highlights.sort(key=lambda x: x['time_sec'])
        
        # Limit to top 5 moments
        merged_highlights = merged_highlights[:5]
    
    return merged_highlights

def generate_highlight_reel(input_video_path, highlight_moments, fps, original_filename):
    """
    Generate a highlight reel video from detected moments.
    Each moment gets 3-5 seconds of footage.
    """
    if not highlight_moments:
        return None
    
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        return None
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Create output path with sanitized filename (remove spaces and special chars)
    safe_filename = original_filename.replace(" ", "_").replace("%", "")
    highlight_filename = f"highlights_{safe_filename}"
    highlight_path = os.path.join(OUTPUT_DIR, highlight_filename)
    
    # Video writer - use same codec as main analysis (mp4v works for playback)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(highlight_path, fourcc, fps, (width, height))
    
    if not out.isOpened():
        print(f"❌ Failed to create video writer for {highlight_path}")
        cap.release()
        return None
    
    clip_duration_sec = 4  # 4 seconds per highlight
    clip_frames = int(clip_duration_sec * fps)
    
    for idx, moment in enumerate(highlight_moments):
        center_frame = moment['frame']
        start_frame = max(0, center_frame - clip_frames // 2)
        end_frame = start_frame + clip_frames
        
        # Seek to start frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        
        frames_written = 0
        while frames_written < clip_frames:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Add highlight overlay
            overlay_text = f"Highlight #{idx + 1}"
            moment_types = ", ".join(moment['types'][:2])  # Show first 2 types
            score_text = f"Score: {int(moment['score'])}"
            
            # Draw semi-transparent overlay at top
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (width, 80), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)
            
            # Draw text
            cv2.putText(frame, overlay_text, (20, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
            cv2.putText(frame, moment_types.upper(), (20, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Draw progress bar
            progress = frames_written / clip_frames
            bar_width = int(progress * (width - 40))
            cv2.rectangle(frame, (20, height - 30), (20 + bar_width, height - 20), 
                         (0, 255, 255), -1)
            
            out.write(frame)
            frames_written += 1
        
        # Add transition frame (black frame with "Next Highlight")
        if idx < len(highlight_moments) - 1:
            transition_frames = int(fps * 0.5)  # 0.5 second transition
            black_frame = np.zeros((height, width, 3), dtype=np.uint8)
            cv2.putText(black_frame, "NEXT HIGHLIGHT", 
                       (width // 2 - 150, height // 2), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)
            for _ in range(transition_frames):
                out.write(black_frame)
    
    cap.release()
    out.release()
    
    return highlight_filename

@app.post("/generate-highlights")
async def generate_highlights_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Generate highlight reel from uploaded gameplay video.
    Detects exciting moments and creates a compilation.
    Requires authentication to save highlights.
    """
    print(f"🎬 Generating highlights for: {file.filename}")
    print(f"👤 User: {current_user.get('username', 'Unknown')}")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return {"error": "Could not open video"}
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    frame_count = 0
    timeline_data = []
    enemy_encounters = []
    reaction_times = []
    motion_scores = []
    prev_gray = None
    prev_person_count = 0
    prev_person_boxes = []
    
    # Quick analysis pass (no annotation, just detection)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Calculate motion
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            motion = np.mean(diff)
            motion_scores.append(motion)
        prev_gray = gray
        
        # Run YOLO
        results = yolo_model(frame, verbose=False, conf=0.3)
        
        persons_in_frame = 0
        current_person_boxes = []
        frame_detections = []
        
        for r in results:
            if r.boxes is not None:
                for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
                    if int(cls) == 0:  # person
                        persons_in_frame += 1
                        x1, y1, x2, y2 = map(int, box)
                        box_center_x = (x1 + x2) / 2
                        box_center_y = (y1 + y2) / 2
                        
                        current_person_boxes.append({
                            'center_x': box_center_x,
                            'center_y': box_center_y,
                            'conf': float(conf)
                        })
                        
                        frame_detections.append({
                            'x': int(box_center_x),
                            'y': int(box_center_y),
                            'confidence': float(conf)
                        })
        
        # Store timeline data
        timeline_data.append({
            'frame': frame_count,
            'time': frame_count / fps if fps > 0 else 0,
            'persons': persons_in_frame,
            'motion': float(motion_scores[-1]) if motion_scores else 0,
            'detections': frame_detections
        })
        
        # Detect enemy encounters
        if persons_in_frame > prev_person_count:
            new_boxes = []
            for curr_box in current_person_boxes:
                is_new = True
                for prev_box in prev_person_boxes:
                    dist = np.sqrt(
                        (curr_box['center_x'] - prev_box['center_x'])**2 + 
                        (curr_box['center_y'] - prev_box['center_y'])**2
                    )
                    if dist < 100:
                        is_new = False
                        break
                if is_new:
                    new_boxes.append(curr_box)
            
            if len(new_boxes) > 0:
                enemy_encounters.append({
                    'frame': frame_count,
                    'time_sec': frame_count / fps if fps > 0 else 0,
                    'new_persons': len(new_boxes),
                    'boxes': new_boxes
                })
        
        # Track eliminations
        if persons_in_frame < prev_person_count and len(enemy_encounters) > 0:
            last_encounter = enemy_encounters[-1]
            frames_since = frame_count - last_encounter['frame']
            if 0 < frames_since < (fps * 3):
                reaction_time_ms = (frames_since / fps) * 1000 if fps > 0 else 0
                reaction_times.append({
                    'encounter_frame': last_encounter['frame'],
                    'elimination_frame': frame_count,
                    'reaction_time_ms': reaction_time_ms
                })
        
        prev_person_count = persons_in_frame
        prev_person_boxes = current_person_boxes
    
    cap.release()
    
    # Detect highlight moments
    highlight_moments = detect_highlight_moments(
        timeline_data,
        enemy_encounters,
        reaction_times,
        fps,
        total_frames
    )
    
    if not highlight_moments:
        return {
            "status": "no_highlights",
            "message": "No exciting moments detected in this video. Try uploading gameplay with more action!",
            "suggestions": [
                "Include combat sequences",
                "Upload longer gameplay (2-5 minutes)",
                "Ensure video has clear enemy encounters"
            ]
        }
    
    # Generate highlight reel
    highlight_filename = generate_highlight_reel(
        file_path,
        highlight_moments,
        fps,
        file.filename
    )
    
    if not highlight_filename:
        return {"error": "Failed to generate highlight reel"}
    
    # Save to database
    session_id = None
    try:
        highlight_sessions = get_collection("highlight_sessions")
        session_data = {
            "user_id": current_user["_id"],
            "username": current_user["username"],
            "video_filename": file.filename,
            "highlight_filename": highlight_filename,
            "num_highlights": len(highlight_moments),
            "total_duration_sec": sum(4 for _ in highlight_moments),  # 4 sec per clip
            "highlight_moments": highlight_moments,
            "created_at": datetime.utcnow()
        }
        
        result = await highlight_sessions.insert_one(session_data)
        session_id = str(result.inserted_id)
        print(f"✅ Saved highlight to database with ID: {session_id}")
    except Exception as e:
        print(f"❌ Failed to save to database: {e}")
    
    return {
        "status": "success",
        "highlight_video": highlight_filename,
        "num_highlights": len(highlight_moments),
        "total_duration_sec": len(highlight_moments) * 4,
        "moments": [
            {
                "number": idx + 1,
                "time_sec": round(m['time_sec'], 1),
                "score": int(m['score']),
                "types": m['types']
            }
            for idx, m in enumerate(highlight_moments)
        ],
        "session_id": session_id
    }


@app.get("/download-highlight/{filename}")
async def download_highlight(filename: str):
    """
    Force download of highlight video file
    """
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        media_type='video/mp4',
        filename=filename,
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@app.get("/highlight-stats")
async def get_highlight_stats():
    """
    Get global highlight generation statistics
    """
    try:
        highlight_sessions = get_collection("highlight_sessions")
        
        # Count total highlights generated
        total_highlights = await highlight_sessions.count_documents({})
        
        # Count unique users (if they exist)
        unique_users = len(await highlight_sessions.distinct("user_id"))
        
        # Get total moments detected
        pipeline = [
            {"$group": {
                "_id": None,
                "total_moments": {"$sum": "$num_highlights"}
            }}
        ]
        result = await highlight_sessions.aggregate(pipeline).to_list(1)
        total_moments = result[0]["total_moments"] if result else 0
        
        return {
            "total_highlights_generated": total_highlights,
            "total_moments_detected": total_moments,
            "unique_users": unique_users if unique_users > 0 else total_highlights
        }
    except:
        # Fallback if database not available
        return {
            "total_highlights_generated": 0,
            "total_moments_detected": 0,
            "unique_users": 0
        }


@app.get("/my-highlights")
async def get_my_highlights(current_user: dict = Depends(get_current_user)):
    """
    Get all highlights generated by the current user
    """
    try:
        highlight_sessions = get_collection("highlight_sessions")
        highlights = await highlight_sessions.find(
            {"user_id": current_user["_id"]}
        ).sort("created_at", -1).to_list(100)  # Last 100 highlights
        
        # Convert ObjectId to string
        for highlight in highlights:
            highlight["_id"] = str(highlight["_id"])
            # Format date
            if "created_at" in highlight:
                highlight["created_at"] = highlight["created_at"].isoformat()
        
        return {
            "status": "success",
            "highlights": highlights,
            "total": len(highlights)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "highlights": [],
            "total": 0
        }
