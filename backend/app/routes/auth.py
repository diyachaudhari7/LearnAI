from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.activity import UserActivity
from app.schemas.schemas import UserRegister, UserLogin, Token, UserOut, ForgotPasswordRequest, APIResponse
from app.auth.password import verify_password, get_password_hash
from app.auth.jwt_handler import create_access_token
from app.auth.deps import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=APIResponse[dict])
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role or "Student",
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.flush()

    # Log initial registration activity
    act = UserActivity(
        user_id=user.id,
        activity_type="account_created",
        title="Welcome to LearnAI!",
        description="Account successfully created. Upload your first PDF to begin.",
        timestamp=datetime.utcnow()
    )
    db.add(act)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return APIResponse(
        success=True,
        message="Registration successful",
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": UserOut.from_orm(user).dict()
        }
    )

@router.post("/login", response_model=APIResponse[dict])
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return APIResponse(
        success=True,
        message="Login successful",
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": UserOut.from_orm(user).dict()
        }
    )

@router.get("/me", response_model=APIResponse[UserOut])
def get_me(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Current user profile retrieved",
        data=UserOut.from_orm(current_user)
    )

@router.post("/logout", response_model=APIResponse[dict])
def logout(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Logged out successfully",
        data={"status": "logged_out"}
    )

@router.post("/forgot-password", response_model=APIResponse[dict])
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    # For security & dev demo, always return success state
    return APIResponse(
        success=True,
        message=f"If an account with {req.email} exists, a password reset link has been dispatched.",
        data={"email": req.email, "simulated_reset_dispatched": True}
    )
