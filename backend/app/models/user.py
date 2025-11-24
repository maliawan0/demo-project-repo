from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from bson import ObjectId

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    username: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @validator("id", pre=True, always=True)
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "hashed_password": "...",
                "created_at": "2023-10-26T10:00:00Z"
            }
        }