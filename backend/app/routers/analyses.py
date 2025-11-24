from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database
from app.db import get_db
from app.auth import get_current_user
from app.models.user import User
from app.schemas.analysis import AnalysisCreate, AnalysisOut, AnalysisInDB
from bson import ObjectId

router = APIRouter()

@router.post("", response_model=AnalysisInDB)
async def create_analysis(
    analysis: AnalysisCreate,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis_data = analysis.dict(by_alias=True)
    analysis_data["user_id"] = current_user.id
    result = await db.analyses.insert_one(analysis_data)
    created_analysis = await db.analyses.find_one({"_id": result.inserted_id})
    return created_analysis

@router.get("", response_model=List[AnalysisOut])
async def list_analyses(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analyses = await db.analyses.find({"user_id": current_user.id}).to_list(100)
    return analyses

@router.delete("/{analysis_id}", status_code=204)
async def delete_analysis(
    analysis_id: str,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = await db.analyses.find_one({"_id": ObjectId(analysis_id)})
    if analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if analysis["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this analysis")
    
    await db.analyses.delete_one({"_id": ObjectId(analysis_id)})
    return