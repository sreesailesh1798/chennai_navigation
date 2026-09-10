import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.core.database import Base

class Subway(Base):
    __tablename__ = "subways"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    area_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(30), default="OPEN_CLEAR")  # OPEN_CLEAR, WATERLOGGED_WARNING, CLOSED_SUBMERGED
    water_depth_inches = Column(Float, default=0.0)
    pump_status = Column(String(30), default="OPERATIONAL")  # OPERATIONAL, OVERWHELMED, OFFLINE
    vehicle_clearance_notes = Column(String(255), default="Passable for all vehicles")
    upvotes = Column(Integer, default=5)
    downvotes = Column(Integer, default=0)
    last_reported_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Canal(Base):
    __tablename__ = "canals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    catchment_area = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    water_level_percent = Column(Integer, default=50)  # 0 to 100+
    status = Column(String(30), default="NORMAL")  # NORMAL, HIGH_ALERT, OVERFLOWING
    flow_rate_desc = Column(String(150), default="Normal gravitational drainage")
    flood_risk_level = Column(String(20), default="LOW")  # LOW, MODERATE, CRITICAL
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class FloodReport(Base):
    __tablename__ = "flood_reports"

    id = Column(Integer, primary_key=True, index=True)
    area_name = Column(String(100), nullable=False)
    road_name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    depth_level = Column(String(30), nullable=False)  # ANKLE_DEEP, CALF_DEEP, KNEE_DEEP, WAIST_DEEP_SUBMERGED
    depth_inches = Column(Float, default=3.0)
    passable_vehicles = Column(Text, default="[]")  # JSON array string: ["suv", "bus"]
    hazard_tags = Column(Text, default="[]")  # JSON array string: ["open_manhole", "stalled_vehicle"]
    description = Column(Text, nullable=True)
    reporter_role = Column(String(30), default="CITIZEN")  # CITIZEN, TRAFFIC_POLICE, VOLUNTEER
    upvotes = Column(Integer, default=1)
    downvotes = Column(Integer, default=0)
    verification_status = Column(String(30), default="COMMUNITY_REPORTED")  # VERIFIED, COMMUNITY_REPORTED, RESOLVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WaterBowl(Base):
    __tablename__ = "water_bowls"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    area_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_meters = Column(Integer, default=600)
    severity_level = Column(String(30), default="EXTREME_BOWL")  # EXTREME_BOWL, MODERATE_BOWL
    elevation_deficit_m = Column(Float, default=2.5)
    description = Column(Text, nullable=True)
    elevated_alternative = Column(String(200), nullable=True)

class SafeCorridor(Base):
    __tablename__ = "safe_corridors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    corridor_type = Column(String(50), default="ELEVATED_FLYOVER")  # ELEVATED_FLYOVER, ARTERIAL_RIDGE, EXPRESSWAY
    description = Column(Text, nullable=True)
    waypoints_json = Column(Text, default="[]")  # JSON array of [lat, lng]
    elevation_advantage_m = Column(Float, default=6.0)
    status = Column(String(30), default="CLEAR_ELEVATED")


class CivicWorkReport(Base):
    __tablename__ = "civic_works"

    id = Column(Integer, primary_key=True, index=True)
    area_name = Column(String(100), nullable=False)
    road_name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    work_type = Column(String(50), nullable=False)  # SWD_DRAIN_TRENCH, MOTOR_PUMP_DEPLOYED, METROWATER_ROAD_CUT, TANGEDCO_ELECTRICAL, DEBRIS_TREE_FALL, POLICE_BARRICADE
    work_title = Column(String(150), nullable=False)
    impact_level = Column(String(40), default="LANE_PARTIALLY_BLOCKED")  # LANE_PARTIALLY_BLOCKED, ROAD_FULLY_CLOSED, SLOW_MOVING
    description = Column(Text, nullable=True)
    reported_by = Column(String(50), default="CITIZEN")
    upvotes = Column(Integer, default=1)
    status = Column(String(30), default="ACTIVE_WORK")  # ACTIVE_WORK, COMPLETED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
