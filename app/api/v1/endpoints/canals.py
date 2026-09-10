from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.flood_models import Canal
from app.schemas.flood_schemas import CanalResponse

router = APIRouter()

@router.get("", response_model=List[CanalResponse])
def get_all_canals(db: Session = Depends(get_db)):
    return db.query(Canal).order_by(Canal.water_level_percent.desc()).all()

@router.get("/{canal_id}", response_model=CanalResponse)
def get_canal(canal_id: int, db: Session = Depends(get_db)):
    canal = db.query(Canal).filter(Canal.id == canal_id).first()
    if not canal:
        raise HTTPException(status_code=404, detail="Canal not found")
    return canal
