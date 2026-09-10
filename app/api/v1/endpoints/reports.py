from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.core.database import get_db
from app.models.flood_models import FloodReport
from app.schemas.flood_schemas import FloodReportCreate, FloodReportResponse

router = APIRouter()

def format_report_response(r: FloodReport) -> FloodReportResponse:
    try:
        passable = json.loads(r.passable_vehicles) if r.passable_vehicles else []
    except Exception:
        passable = []
    try:
        hazards = json.loads(r.hazard_tags) if r.hazard_tags else []
    except Exception:
        hazards = []

    return FloodReportResponse(
        id=r.id,
        area_name=r.area_name,
        road_name=r.road_name,
        latitude=r.latitude,
        longitude=r.longitude,
        depth_level=r.depth_level,
        depth_inches=r.depth_inches,
        passable_vehicles=passable,
        hazard_tags=hazards,
        description=r.description,
        reporter_role=r.reporter_role,
        upvotes=r.upvotes,
        downvotes=r.downvotes,
        verification_status=r.verification_status,
        created_at=r.created_at
    )

@router.get("", response_model=List[FloodReportResponse])
def get_flood_reports(
    area: Optional[str] = None,
    depth: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FloodReport)
    if area:
        query = query.filter(FloodReport.area_name.ilike(f"%{area}%"))
    if depth:
        query = query.filter(FloodReport.depth_level == depth)
    reports = query.order_by(FloodReport.created_at.desc()).all()
    return [format_report_response(r) for r in reports]

@router.post("", response_model=FloodReportResponse)
def submit_flood_report(
    report_in: FloodReportCreate,
    db: Session = Depends(get_db)
):
    depth_inches_val = report_in.depth_inches
    if depth_inches_val is None:
        depth_mapping = {
            "ANKLE_DEEP": 3.0,
            "CALF_DEEP": 7.0,
            "KNEE_DEEP": 14.0,
            "WAIST_DEEP_SUBMERGED": 24.0
        }
        depth_inches_val = depth_mapping.get(report_in.depth_level, 5.0)

    db_report = FloodReport(
        area_name=report_in.area_name,
        road_name=report_in.road_name,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        depth_level=report_in.depth_level,
        depth_inches=depth_inches_val,
        passable_vehicles=json.dumps(report_in.passable_vehicles),
        hazard_tags=json.dumps(report_in.hazard_tags),
        description=report_in.description,
        reporter_role=report_in.reporter_role or "CITIZEN",
        upvotes=1,
        downvotes=0,
        verification_status="COMMUNITY_REPORTED"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return format_report_response(db_report)

@router.post("/{report_id}/vote")
def vote_report(
    report_id: int,
    action: str = Query(..., pattern="^(upvote|downvote)$"),
    db: Session = Depends(get_db)
):
    report = db.query(FloodReport).filter(FloodReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if action == "upvote":
        report.upvotes += 1
        if report.upvotes >= 3:
            report.verification_status = "VERIFIED"
    else:
        report.downvotes += 1
    
    db.commit()
    db.refresh(report)
    return {"id": report.id, "upvotes": report.upvotes, "downvotes": report.downvotes, "status": report.verification_status}
