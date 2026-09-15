import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database.database import Base, engine, SessionLocal
from app.services.seed_data import seed_database
import app.models  # ensure all models are registered

# Import all API routers
from app.routes.auth import router as auth_router
from app.routes.documents import router as documents_router
from app.routes.ai import router as ai_router
from app.routes.quizzes import router as quizzes_router
from app.routes.flashcards import router as flashcards_router
from app.routes.competency import router as competency_router
from app.routes.learning_path import router as learning_path_router
from app.routes.dashboard import router as dashboard_router
from app.routes.progress import router as progress_router
from app.routes.profile import router as profile_router
from app.routes.settings import router as settings_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Auto-seed demo database on launch
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-Stack AI Learning Platform API with Competency Gap Analysis & Personalized Learning Paths",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for PDF uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Centralized Error Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "error": f"HTTP_{exc.status_code}"
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0]["msg"] if errors else "Invalid input data"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": f"Validation Error: {msg}",
            "error": "VALIDATION_ERROR",
            "details": errors
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal Server Error",
            "error": str(exc)
        }
    )

# Include Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(quizzes_router, prefix=settings.API_V1_STR)
app.include_router(flashcards_router, prefix=settings.API_V1_STR)
app.include_router(competency_router, prefix=settings.API_V1_STR)
app.include_router(learning_path_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(progress_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "success": True,
        "message": "AI Learning Platform API is operational",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "ai_provider": settings.AI_PROVIDER,
        "ai_key_configured": bool(settings.AI_API_KEY)
    }
