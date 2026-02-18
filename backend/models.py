from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(alias="_id")
    is_active: bool = True
    is_admin: bool = False
    is_pro: bool = False  # Pro subscription status
    credits: int = 3  # Free users get 3 credits per day
    credits_reset_date: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserInDB(User):
    hashed_password: str

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Session Models
class ReactionTestResult(BaseModel):
    mode: str  # 'click', 'target', 'precision'
    average_time: Optional[float] = None
    best_time: Optional[float] = None
    attempts: int = 0
    accuracy: Optional[float] = None
    score: Optional[int] = None

class VideoAnalysisResult(BaseModel):
    filename: str
    video_fps: float
    avg_characters: float
    max_characters: int
    total_frames: int
    scene_complexity_score: float
    estimated_reaction_time_ms: int
    min_reaction_time_ms: int
    max_reaction_time_ms: int
    sudden_enemy_encounters: int
    successful_eliminations: int
    motion_stability: float
    performance_score: float
    annotated_video: str

class SessionCreate(BaseModel):
    game_preset: str  # 'bgmi', 'valorant', 'csgo'
    reaction_tests: List[ReactionTestResult] = []
    video_analysis: Optional[VideoAnalysisResult] = None

class Session(SessionCreate):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Stats Models
class UserStats(BaseModel):
    user_id: str
    total_sessions: int = 0
    total_reaction_tests: int = 0
    total_videos_analyzed: int = 0
    best_reaction_time: Optional[float] = None
    average_reaction_time: Optional[float] = None
    favorite_game: Optional[str] = None
    performance_tier: str = "Bronze"  # Bronze, Silver, Gold, Platinum, Diamond
    
    class Config:
        json_encoders = {ObjectId: str}
