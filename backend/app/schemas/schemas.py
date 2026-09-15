from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict, Generic, TypeVar
from datetime import datetime

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    error: Optional[str] = None

# Auth schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "Student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None

class SettingsUpdateRequest(BaseModel):
    daily_goal_minutes: Optional[int] = None
    preferred_difficulty: Optional[str] = None
    dark_mode: Optional[bool] = None
    email_notifications: Optional[bool] = None
    learning_reminders: Optional[bool] = None
    quiz_reminders: Optional[bool] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    daily_goal_minutes: int = 30
    preferred_difficulty: str = "Intermediate"
    dark_mode: bool = False
    email_notifications: bool = True
    learning_reminders: bool = True
    quiz_reminders: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

# Document schemas
class TopicOut(BaseModel):
    id: int
    name: str
    difficulty: str
    importance: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class SummaryDefinition(BaseModel):
    term: str
    definition: str

class TopicSummaryItem(BaseModel):
    topic: str
    points: List[str]

class SummaryOut(BaseModel):
    id: int
    document_id: int
    overview: str
    executive_points: List[str] = []
    topic_summaries: List[TopicSummaryItem] = []
    key_concepts: List[str] = []
    definitions: List[SummaryDefinition] = []
    key_takeaways: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id: int
    filename: str
    file_size: int
    page_count: int
    status: str
    created_at: datetime
    topic_count: int = 0
    quiz_count: int = 0
    flashcard_count: int = 0
    has_summary: bool = False
    topics: List[TopicOut] = []

    class Config:
        from_attributes = True

class DocumentDetail(DocumentOut):
    extracted_text: Optional[str] = None
    summary: Optional[SummaryOut] = None

# Quiz schemas
class QuestionOut(BaseModel):
    id: int
    quiz_id: int
    question: str
    options: List[str]
    explanation: Optional[str] = None
    topic: str = "General"
    difficulty: str = "Medium"

    class Config:
        from_attributes = True

class QuestionWithAnswer(QuestionOut):
    correct_answer: int

class QuizOut(BaseModel):
    id: int
    document_id: Optional[int] = None
    title: str
    topic: str
    difficulty: str
    question_count: int = 0
    created_at: datetime
    last_score: Optional[float] = None
    attempts_count: int = 0

    class Config:
        from_attributes = True

class QuizDetail(QuizOut):
    questions: List[QuestionOut] = []

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: int

class QuizSubmitRequest(BaseModel):
    time_taken_seconds: int = 0
    answers: List[AnswerSubmission]

class TopicMastery(BaseModel):
    topic: str
    score_percentage: float
    correct: int
    total: int
    status: str

class AnswerReview(BaseModel):
    question_id: int
    question: str
    options: List[str]
    selected_option: int
    correct_answer: int
    is_correct: bool
    explanation: Optional[str] = None
    topic: str

class QuizSubmitResult(BaseModel):
    attempt_id: int
    quiz_id: int
    score: int
    total_questions: int
    percentage: float
    time_taken_seconds: int
    ai_recommendation: str
    topic_breakdown: List[TopicMastery]
    answer_reviews: List[AnswerReview]

class QuizAttemptOut(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    score: int
    total_questions: int
    percentage: float
    time_taken_seconds: int
    completed_at: datetime

    class Config:
        from_attributes = True

# Flashcard schemas
class FlashcardOut(BaseModel):
    id: int
    document_id: Optional[int] = None
    front: str
    back: str
    topic: str
    known: bool
    review_required: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FlashcardUpdate(BaseModel):
    known: Optional[bool] = None
    review_required: Optional[bool] = None

# Competency schemas
class CompetencyOut(BaseModel):
    id: int
    skill: str
    score: float
    status: str
    total_questions: int
    correct_questions: int
    updated_at: datetime

    class Config:
        from_attributes = True

class CompetencyAnalysisOut(BaseModel):
    competencies: List[CompetencyOut]
    strongest_skill: Optional[str] = None
    weakest_skill: Optional[str] = None
    ai_analysis: str
    recommended_focus: List[str]

# Learning Path schemas
class LearningPathTopicOut(BaseModel):
    id: int
    name: str
    completed: bool

    class Config:
        from_attributes = True

class LearningPathWeekOut(BaseModel):
    id: int
    week_number: int
    title: str
    description: str
    status: str
    progress: int
    estimated_hours: int
    difficulty: str
    topics: List[LearningPathTopicOut] = []

    class Config:
        from_attributes = True

class LearningPathOut(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    created_at: datetime
    weeks: List[LearningPathWeekOut] = []

    class Config:
        from_attributes = True

# Dashboard schemas
class StatCardData(BaseModel):
    total_documents: int
    quizzes_completed: int
    average_score: float
    learning_streak_days: int
    skills_mastered: int
    flashcards_reviewed: int

class RecentActivityItem(BaseModel):
    id: int
    activity_type: str
    title: str
    description: Optional[str] = None
    timestamp: datetime

class DashboardOut(BaseModel):
    user: UserOut
    stats: StatCardData
    competencies: List[CompetencyOut]
    ai_recommendation: Dict[str, Any]
    recent_activity: List[RecentActivityItem]
    active_learning_path: Optional[LearningPathOut] = None

# Progress schemas
class ScoreDataPoint(BaseModel):
    date: str
    score: float
    quiz_title: str

class WeeklyActivityPoint(BaseModel):
    day: str
    hours: float
    questions_answered: int

class ProgressAnalyticsOut(BaseModel):
    overall_progress: float
    weekly_study_hours: float
    total_questions_answered: int
    learning_streak_days: int
    score_history: List[ScoreDataPoint]
    weekly_activity: List[WeeklyActivityPoint]
    skill_breakdown: List[CompetencyOut]
    quizzes_by_difficulty: Dict[str, int]
