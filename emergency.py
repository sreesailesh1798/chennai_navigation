import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.flood_models import WaterBowl, SafeCorridor
from app.schemas.flood_schemas import WaterBowlResponse, SafeCorridorResponse, EmergencyContact

router = APIRouter()

EMERGENCY_CONTACTS = [
    {
        "organization": "Greater Chennai Corporation (GCC) Central Command",
        "purpose": "Flood control room, tree fall, subway pumping, motor requests",
        "helpline": "1913",
        "available_hours": "24/7 Toll-Free"
    },
    {
        "organization": "Tamil Nadu State Disaster Management (TNDR)",
        "purpose": "State disaster emergency, SDRF boat deployment, evacuation",
        "helpline": "1070",
        "available_hours": "24/7 Toll-Free"
    },
    {
        "organization": "Chennai City Traffic Police (Control Room)",
        "purpose": "Road barricade updates, vehicle breakdown, traffic diversions",
        "helpline": "103",
        "available_hours": "24/7 Dedicated"
    },
    {
        "organization": "Chennai MetroWater Emergency Drinking Water",
        "purpose": "Emergency tanker water & sewer overflow clearance",
        "helpline": "044-45674567",
        "available_hours": "24/7 Dedicated"
    },
    {
        "organization": "TANGEDCO (Electricity Board Emergency)",
        "purpose": "Downed power lines, transformer spark in water, shock hazard",
        "helpline": "9498794987",
        "available_hours": "24/7 Dedicated"
    }
]

@router.get("/contacts", response_model=List[EmergencyContact])
def get_emergency_contacts():
    return EMERGENCY_CONTACTS

@router.get("/bowls", response_model=List[WaterBowlResponse])
def get_water_bowls(db: Session = Depends(get_db)):
    return db.query(WaterBowl).all()

@router.get("/corridors", response_model=List[SafeCorridorResponse])
def get_safe_corridors(db: Session = Depends(get_db)):
    corridors = db.query(SafeCorridor).all()
    results = []
    for c in corridors:
        try:
            pts = json.loads(c.waypoints_json) if c.waypoints_json else []
        except Exception:
            pts = []
        results.append(SafeCorridorResponse(
            id=c.id,
            name=c.name,
            corridor_type=c.corridor_type,
            description=c.description,
            waypoints=pts,
            elevation_advantage_m=c.elevation_advantage_m,
            status=c.status
        ))
    return results
