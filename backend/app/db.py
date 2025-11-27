import os
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
from urllib.parse import urlparse

# Force load backend/.env no matter where app runs
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

MONGO_URI = os.getenv("MONGODB_URI")
print("DEBUG MONGO_URI:", MONGO_URI)

def get_db():
    if not MONGO_URI:
        raise ValueError("MONGODB_URI environment variable not set")
    
    db_name = urlparse(MONGO_URI).path.lstrip('/')
    if not db_name:
        raise ValueError("Database not found in MONGODB_URI")

    client = MongoClient(MONGO_URI)
    return client[db_name]

db = get_db()
