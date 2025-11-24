from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class Analysis(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(...)
    name: str
    form_data: Dict[str, Any] = Field(alias="formData")
    accepted_suggestions: List[Dict[str, Any]] = Field(alias="acceptedSuggestions")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "My First Analysis",
                "formData": {
                    "script": "...",
                    "productionBudget": 100000
                },
                "acceptedSuggestions": [
                    {
                        "id": "1",
                        "term": "coffee",
                        "type": "product"
                    }
                ]
            }
        }