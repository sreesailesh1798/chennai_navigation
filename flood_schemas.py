from pydantic import ConfigDict
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class SubwayBase(BaseModel):
    name: str
    area_name: str
    latitude: float
    longitude: float
    status: str = "OPEN_CLEAR"
    water_depth_inches: float = 0.0
    pump_status: str = "OPERATIONAL"
    vehicle_clearance_notes: Optional[str] = None

class SubwayCreate(SubwayBase):
    pass

class SubwayReportUpdate(BaseModel):
    status: str
    water_depth_inches: float
    pump_status: Optional[str] = "OPERATIONAL"
    vehicle_clearance_notes: Optional[str] = None

class SubwayResponse(SubwayBase):
    id: int
    upvotes: int
    downvotes: int
    last_reported_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CanalResponse(BaseModel):
    id: int
    name: str
    catchment_area: str
    latitude: float
    longitude: float
    water_level_percent: int
    status: str
    flow_rate_desc: str
    flood_risk_level: str
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FloodReportCreate(BaseModel):
    area_name: str
    road_name: str
    latitude: float
    longitude: float
    depth_level: str  # ANKLE_DEEP, CALF_DEEP, KNEE_DEEP, WAIST_DEEP_SUBMERGED
    depth_inches: Optional[float] = None
    passable_vehicles: List[str] = []
    hazard_tags: List[str] = []
    description: Optional[str] = None
    reporter_role: Optional[str] = "CITIZEN"

class FloodReportResponse(BaseModel):
    id: int
    area_name: str
    road_name: str
    latitude: float
    longitude: float
    depth_level: str
    depth_inches: float
    passable_vehicles: List[str]
    hazard_tags: List[str]
    description: Optional[str]
    reporter_role: str
    upvotes: int
    downvotes: int
    verification_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WaterBowlResponse(BaseModel):
    id: int
    name: str
    area_name: str
    latitude: float
    longitude: float
    radius_meters: int
    severity_level: str
    elevation_deficit_m: float
    description: Optional[str]
    elevated_alternative: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class SafeCorridorResponse(BaseModel):
    id: int
    name: str
    corridor_type: str
    description: Optional[str]
    waypoints: List[List[float]]
    elevation_advantage_m: float
    status: str

    model_config = ConfigDict(from_attributes=True)

class RoutePoint(BaseModel):
    name: str
    latitude: float
    longitude: float

class NavigationStep(BaseModel):
    instruction: str
    distance_meters: int
    elevation_type: str  # ELEVATED, GROUND, SUBWAY, DEPRESSION
    is_hazard: bool = False
    water_depth_inches: float = 0.0
    hazard_description: Optional[str] = None

class RouteDetail(BaseModel):
    route_name: str
    route_type: str  # MONSOON_SAFE_ELEVATED or STANDARD_DIRECT
    total_distance_km: float
    estimated_duration_mins: int
    flood_safety_score_percent: int
    passable_for_vehicle: bool
    risk_level: str  # LOW, MODERATE, HIGH, EXTREME
    submerged_subways_hit: List[str] = []
    water_bowls_intersected: List[str] = []
    civic_works_on_route: List[Dict[str, Any]] = []
    coordinates: List[List[float]]
    steps: List[NavigationStep]

class RouteComparisonResponse(BaseModel):
    vehicle_type: str  # two_wheeler, sedan_hatchback, suv, bus_heavy
    origin: RoutePoint
    destination: RoutePoint
    monsoon_safe_route: RouteDetail
    standard_route: RouteDetail
    recommendation: str
    critical_warning: Optional[str] = None

class EmergencyContact(BaseModel):
    organization: str
    purpose: str
    helpline: str
    available_hours: str


class CivicWorkCreate(BaseModel):
    area_name: str
    road_name: str
    latitude: float
    longitude: float
    work_type: str  # SWD_DRAIN_TRENCH, MOTOR_PUMP_DEPLOYED, METROWATER_ROAD_CUT, TANGEDCO_ELECTRICAL, DEBRIS_TREE_FALL, POLICE_BARRICADE
    work_title: Optional[str] = None
    impact_level: Optional[str] = "LANE_PARTIALLY_BLOCKED"
    description: Optional[str] = None
    reported_by: Optional[str] = "CITIZEN"

class CivicWorkResponse(BaseModel):
    id: int
    area_name: str
    road_name: str
    latitude: float
    longitude: float
    work_type: str
    work_title: str
    impact_level: str
    description: Optional[str]
    reported_by: str
    upvotes: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
