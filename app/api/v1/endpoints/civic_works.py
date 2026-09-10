from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from app.core.database import get_db
from app.models.flood_models import CivicWorkReport
from app.schemas.flood_schemas import CivicWorkCreate, CivicWorkResponse

router = APIRouter()

WORK_TYPE_LABELS = {
    "SWD_DRAIN_TRENCH": "Stormwater Drain Excavation / Trench",
    "MOTOR_PUMP_DEPLOYED": "Corporation Motor Pump Hoses on Road",
    "METROWATER_ROAD_CUT": "MetroWater Pipeline Trench Work",
    "TANGEDCO_ELECTRICAL": "TANGEDCO Cable / Transformer Repair",
    "DEBRIS_TREE_FALL": "Fallen Tree / Debris Clearance",
    "POLICE_BARRICADE": "Police Flood Diversion Barricade"
}

@router.get("", response_model=List[CivicWorkResponse])
def get_civic_works(
    status: Optional[str] = Query(None, description="Filter by status: ACTIVE_WORK, COMPLETED"),
    db: Session = Depends(get_db)
):
    query = db.query(CivicWorkReport)
    if status:
        query = query.filter(CivicWorkReport.status == status)
    return query.order_by(CivicWorkReport.created_at.desc()).all()

@router.post("", response_model=CivicWorkResponse)
def report_civic_work(
    report_in: CivicWorkCreate,
    db: Session = Depends(get_db)
):
    title = report_in.work_title
    if not title:
        title = WORK_TYPE_LABELS.get(report_in.work_type, "Road Work in Progress")

    db_work = CivicWorkReport(
        area_name=report_in.area_name,
        road_name=report_in.road_name,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        work_type=report_in.work_type,
        work_title=title,
        impact_level=report_in.impact_level or "LANE_PARTIALLY_BLOCKED",
        description=report_in.description,
        reported_by=report_in.reported_by or "CITIZEN",
        upvotes=1,
        status="ACTIVE_WORK"
    )
    db.add(db_work)
    db.commit()
    db.refresh(db_work)
    return db_work

@router.post("/{work_id}/upvote", response_model=CivicWorkResponse)
def upvote_civic_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(CivicWorkReport).filter(CivicWorkReport.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Civic work report not found")
    work.upvotes += 1
    db.commit()
    db.refresh(work)
    return work
