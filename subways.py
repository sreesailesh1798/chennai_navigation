from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from app.core.database import get_db
from app.models.flood_models import Subway
from app.schemas.flood_schemas import SubwayResponse, SubwayReportUpdate

from app.services.weather_service import fetch_live_chennai_weather

router = APIRouter()

@router.get("", response_model=List[SubwayResponse])
def get_all_subways(
    status: Optional[str] = Query(None, description="Filter by status: OPEN_CLEAR, WATERLOGGED_WARNING, CLOSED_SUBMERGED"),
    apply_weather: bool = Query(True, description="When true, synchronizes subway status with live rainfall"),
    db: Session = Depends(get_db)
):
    query = db.query(Subway)
    if status:
        query = query.filter(Subway.status == status)
    
    subways = query.order_by(Subway.water_depth_inches.desc()).all()
    
    if apply_weather and not status:
        weather = fetch_live_chennai_weather()
        if not weather.get("subways_flooded", False):
            # When dry weather in Chennai (no rain yesterday/today):
            dry_subways = []
            for s in subways:
                data = SubwayResponse.model_validate(s)
                data.water_depth_inches = 0.0
                data.status = "OPEN_CLEAR"
                data.pump_status = "STANDBY_DRY"
                data.vehicle_clearance_notes = "Clear weather / dry roadway. 100% passable for all vehicles."
                dry_subways.append(data)
            return dry_subways

    return subways

@router.get("/{subway_id}", response_model=SubwayResponse)
def get_subway_by_id(
    subway_id: int, 
    apply_weather: bool = Query(True),
    db: Session = Depends(get_db)
):
    subway = db.query(Subway).filter(Subway.id == subway_id).first()
    if not subway:
        raise HTTPException(status_code=404, detail="Subway not found")
    
    resp = SubwayResponse.model_validate(subway)
    if apply_weather:
        weather = fetch_live_chennai_weather()
        if not weather.get("subways_flooded", False):
            resp.water_depth_inches = 0.0
            resp.status = "OPEN_CLEAR"
            resp.pump_status = "STANDBY_DRY"
            resp.vehicle_clearance_notes = "Clear weather / dry roadway. 100% passable for all vehicles."
    return resp

@router.post("/{subway_id}/report", response_model=SubwayResponse)
def report_subway_status(
    subway_id: int, 
    report: SubwayReportUpdate, 
    db: Session = Depends(get_db)
):
    subway = db.query(Subway).filter(Subway.id == subway_id).first()
    if not subway:
        raise HTTPException(status_code=404, detail="Subway not found")
    
    subway.status = report.status
    subway.water_depth_inches = report.water_depth_inches
    if report.pump_status:
        subway.pump_status = report.pump_status
    if report.vehicle_clearance_notes:
        subway.vehicle_clearance_notes = report.vehicle_clearance_notes
    subway.last_reported_at = datetime.datetime.utcnow()
    subway.upvotes += 1
    
    db.commit()
    db.refresh(subway)
    return subway

@router.post("/{subway_id}/upvote", response_model=SubwayResponse)
def upvote_subway_report(subway_id: int, db: Session = Depends(get_db)):
    subway = db.query(Subway).filter(Subway.id == subway_id).first()
    if not subway:
        raise HTTPException(status_code=404, detail="Subway not found")
    subway.upvotes += 1
    db.commit()
    db.refresh(subway)
    return subway

@router.post("/{subway_id}/downvote", response_model=SubwayResponse)
def downvote_subway_report(subway_id: int, db: Session = Depends(get_db)):
    subway = db.query(Subway).filter(Subway.id == subway_id).first()
    if not subway:
        raise HTTPException(status_code=404, detail="Subway not found")
    subway.downvotes += 1
    db.commit()
    db.refresh(subway)
    return subway
