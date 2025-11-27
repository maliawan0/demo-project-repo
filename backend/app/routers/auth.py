from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pymongo.database import Database

from app import auth
from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


from app.auth import get_current_user


@router.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Database = Depends(get_db)):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    try:
        user_data = user.model_dump()
        hashed_password = auth.get_password_hash(user.password)
        user_data["hashed_password"] = hashed_password
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user data: {e}",
        )
    del user_data["password"]
    db.users.insert_one(user_data)
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Database = Depends(get_db)):
    user = db.users.find_one({"email": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
