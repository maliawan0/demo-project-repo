from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db import get_db
from app.routers import auth, analyses, users
import os

# Load .env variables
load_dotenv()

app = FastAPI()

# CORS configuration (now fully environment-driven)
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(analyses.router, prefix="/api/v1/analyses", tags=["analyses"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])


@app.get("/healthz")
def health_check():
    try:
        db = get_db()
        db.command("ping")
        return {"status": "ok", "database_connection": "successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")