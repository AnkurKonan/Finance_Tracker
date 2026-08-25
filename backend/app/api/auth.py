from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.schemas.user import UserLogin
from app.schemas.user import Token
from app.core.security import create_access_token
from app.utils.security import verify_password
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.user import UserResponse
from app.utils.security import hash_password
from app.api.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(prefix="/api/auth", tags=["Authentication"])
@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = (db.query(User).filter(User.email == user.email).first())
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    existing_username = (db.query(User).filter(User.username == user.username).first())
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = (db.query(User).filter(User.email == user.email).first())
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }
