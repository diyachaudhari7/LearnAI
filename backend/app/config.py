import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Learning Platform"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./learnai.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_change_in_production_987654321")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:4173"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
