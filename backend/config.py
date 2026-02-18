from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "lagskill_arena"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Admin
    admin_email: str = "admin@lagskill.com"
    admin_password: str = "admin123"
    
    # Application
    environment: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
