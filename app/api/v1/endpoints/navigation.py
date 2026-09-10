from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.routing_engine import calculate_dual_route, PRESET_ROUTES, VEHICLE_THRESHOLDS
from app.schemas.flood_schemas import RouteComparisonResponse

router = APIRouter()

class RouteRequest(BaseModel):
    origin_name: str = Field(..., json_schema_extra={"example": "Velachery Vijayanagar Junction"})
    origin_lat: float = Field(..., json_schema_extra={"example": 12.9815})
    origin_lng: float = Field(..., json_schema_extra={"example": 80.2212})
    dest_name: str = Field(..., json_schema_extra={"example": "T. Nagar Panagal Park"})
    dest_lat: float = Field(..., json_schema_extra={"example": 13.0416})
    dest_lng: float = Field(..., json_schema_extra={"example": 80.2312})
    vehicle_type: str = Field("two_wheeler", json_schema_extra={"example": "two_wheeler"}) # two_wheeler, sedan_hatchback, suv, bus_heavy

@router.get("/presets")
def get_preset_routes():
    return PRESET_ROUTES

@router.get("/vehicles")
def get_vehicle_specs():
    return VEHICLE_THRESHOLDS

@router.post("/route", response_model=RouteComparisonResponse)
def calculate_route(
    req: RouteRequest,
    db: Session = Depends(get_db)
):
    return calculate_dual_route(
        db=db,
        origin_name=req.origin_name,
        origin_lat=req.origin_lat,
        origin_lng=req.origin_lng,
        dest_name=req.dest_name,
        dest_lat=req.dest_lat,
        dest_lng=req.dest_lng,
        vehicle_type=req.vehicle_type
    )
