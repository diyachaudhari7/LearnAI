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

__all__ = [
    "auth_router",
    "documents_router",
    "ai_router",
    "quizzes_router",
    "flashcards_router",
    "competency_router",
    "learning_path_router",
    "dashboard_router",
    "progress_router",
    "profile_router",
    "settings_router",
]
