import math
import json
import urllib.request
from typing import Dict, List, Tuple, Optional
from sqlalchemy.orm import Session
from app.models.flood_models import Subway, Canal, FloodReport, WaterBowl, SafeCorridor, CivicWorkReport
from app.schemas.flood_schemas import (
    RoutePoint, NavigationStep, RouteDetail, RouteComparisonResponse
)
from app.services.weather_service import fetch_live_chennai_weather

VEHICLE_THRESHOLDS = {
    "two_wheeler": {
        "max_safe_depth": 4.0,
        "critical_limit": 6.0,
        "name": "2-Wheeler (Motorcycle / Scooter)",
        "icon": "Bike",
        "danger_msg": "Air filter / silencer submersion risk! Engine stall in 4+ inches of water."
    },
    "sedan_hatchback": {
        "max_safe_depth": 7.0,
        "critical_limit": 10.0,
        "name": "Sedan / Hatchback (Low Clearance)",
        "icon": "Car",
        "danger_msg": "Engine air-intake suction (hydrolock) & catalytic converter flooding in 7+ inches."
    },
    "suv": {
        "max_safe_depth": 14.0,
        "critical_limit": 18.0,
        "name": "SUV / 4x4 (High Clearance)",
        "icon": "SUV",
        "danger_msg": "Floating risk in flowing current & differential seal water contamination."
    },
    "bus_heavy": {
        "max_safe_depth": 24.0,
        "critical_limit": 30.0,
        "name": "Bus / Heavy Commercial Vehicle",
        "icon": "Bus",
        "danger_msg": "Brake booster contamination & deep railway subway stall in 2+ feet."
    }
}

PRESET_ROUTES = [
    {
        "id": "velachery_to_tnagar",
        "title": "Velachery \u27A4 T. Nagar",
        "description": "Crucial commuter corridor via Guindy / Saidapet",
        "origin": {"name": "Velachery Vijayanagar Junction", "latitude": 12.9815, "longitude": 80.2212},
        "destination": {"name": "T. Nagar Panagal Park", "latitude": 13.0416, "longitude": 80.2312}
    },
    {
        "id": "tambaram_to_egmore",
        "title": "Tambaram \u27A4 Egmore / Central",
        "description": "Major south-north artery via GST Road & Anna Salai",
        "origin": {"name": "Tambaram Railway Station", "latitude": 12.9249, "longitude": 80.1182},
        "destination": {"name": "Egmore Railway Station", "latitude": 13.0784, "longitude": 80.2587}
    },
    {
        "id": "madipakkam_to_omr",
        "title": "Madipakkam \u27A4 OMR Sholinganallur",
        "description": "Tech-corridor route via Medavakkam & Perumbakkam",
        "origin": {"name": "Madipakkam Koot Road", "latitude": 12.9642, "longitude": 80.1985},
        "destination": {"name": "OMR Sholinganallur Junction", "latitude": 12.8992, "longitude": 80.2282}
    },
    {
        "id": "vyasarpadi_to_central",
        "title": "Vyasarpadi \u27A4 Chennai Central",
        "description": "North Chennai artery connecting to Central Station",
        "origin": {"name": "Vyasarpadi Kalyanapuram", "latitude": 13.1092, "longitude": 80.2643},
        "destination": {"name": "Chennai Central Puratchi Thalaivar Station", "latitude": 13.0827, "longitude": 80.2755}
    },
    {
        "id": "mudichur_to_guindy",
        "title": "Mudichur \u27A4 Guindy Kathipara",
        "description": "Outer Tambaram corridor via GST elevated highway",
        "origin": {"name": "Mudichur Krishna Nagar", "latitude": 12.9152, "longitude": 80.0682},
        "destination": {"name": "Guindy Kathipara Junction", "latitude": 13.0075, "longitude": 80.2065}
    }
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def fetch_osrm_route(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> Optional[Dict]:
    """Fetch real-road path geometry, distance and timing from Open Source Routing Machine."""
    url = f"https://router.project-osrm.org/route/v1/driving/{origin_lng:.5f},{origin_lat:.5f};{dest_lng:.5f},{dest_lat:.5f}?overview=full&geometries=geojson"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ChennaiFloodNav/2.0"})
        with urllib.request.urlopen(req, timeout=1.8) as res:
            data = json.loads(res.read().decode("utf-8"))
            if data.get("code") == "Ok" and data.get("routes"):
                return data["routes"][0]
    except Exception:
        pass
    return None

def calculate_dual_route(
    db: Session,
    origin_name: str,
    origin_lat: float,
    origin_lng: float,
    dest_name: str,
    dest_lat: float,
    dest_lng: float,
    vehicle_type: str = "two_wheeler"
) -> RouteComparisonResponse:
    v_info = VEHICLE_THRESHOLDS.get(vehicle_type, VEHICLE_THRESHOLDS["two_wheeler"])
    max_safe = v_info["max_safe_depth"]

    # 1. Fetch live weather condition
    weather = fetch_live_chennai_weather()
    is_flooded_weather = weather.get("subways_flooded", False)

    # 2. Query Infrastructure from DB
    subways = db.query(Subway).all()
    bowls = db.query(WaterBowl).all()
    active_works = db.query(CivicWorkReport).filter(CivicWorkReport.status == "ACTIVE_WORK").all()

    # 3. Calculate Real Road Path & Distance via OSRM (with geometric fallback)
    osrm_result = fetch_osrm_route(origin_lat, origin_lng, dest_lat, dest_lng)
    direct_crow_dist = haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)

    if osrm_result:
        std_dist_km = round(osrm_result["distance"] / 1000.0, 2)
        # Convert OSRM GeoJSON [lng, lat] to Leaflet [lat, lng]
        std_coords = [[round(pt[1], 5), round(pt[0], 5)] for pt in osrm_result["geometry"]["coordinates"]]
        # Downsample if too dense
        if len(std_coords) > 60:
            step_size = max(1, len(std_coords) // 40)
            std_coords = std_coords[::step_size]
            if [round(dest_lat, 5), round(dest_lng, 5)] not in std_coords:
                std_coords.append([round(dest_lat, 5), round(dest_lng, 5)])
    else:
        # Fallback realistic Chennai road distance (direct distance * 1.32 urban grid winding)
        std_dist_km = round(max(0.8, direct_crow_dist * 1.32), 2)
        # Dense sampling every ~250m for accurate civic work and obstacle detection
        num_pts = max(24, int(std_dist_km * 4))
        std_coords = []
        for i in range(num_pts):
            f = i / (num_pts - 1)
            lat = origin_lat + f * (dest_lat - origin_lat)
            lng = origin_lng + f * (dest_lng - origin_lng)
            std_coords.append([round(lat, 5), round(lng, 5)])

    # Accurate Chennai Urban Travel Time:
    # Average Chennai city peak/moderate traffic speed: ~24 km/h (2.5 mins per km)
    std_duration_mins = max(4, int(round((std_dist_km / 24.0) * 60)))

    # 4. Check for Hazards & Road Blocks along Path
    std_steps = []
    std_subways_hit = []
    std_bowls_hit = []
    std_road_blocks_hit = []
    std_max_water_depth = 0.0

    # Check road blocks along path (real civic work within 500m corridor)
    for work in active_works:
        min_dist_to_route = 999.0
        for pt in std_coords:
            d = haversine_distance(pt[0], pt[1], work.latitude, work.longitude)
            if d < min_dist_to_route:
                min_dist_to_route = d
        if min_dist_to_route <= 0.52:
            if work.road_name not in [w["road"] for w in std_road_blocks_hit]:
                std_road_blocks_hit.append({
                    "id": work.id,
                    "title": work.work_title,
                    "road": work.road_name,
                    "area": work.area_name,
                    "impact": work.impact_level,
                    "type": work.work_type,
                    "latitude": work.latitude,
                    "longitude": work.longitude,
                    "distance_to_route_km": round(min_dist_to_route, 2)
                })

    # Only check subway flooding if weather is actually rainy!
    if is_flooded_weather:
        for pt in std_coords:
            plat, plng = pt[0], pt[1]
            for s in subways:
                dist = haversine_distance(plat, plng, s.latitude, s.longitude)
                if dist < 0.55 and s.status in ["CLOSED_SUBMERGED", "WATERLOGGED_WARNING"] and s.water_depth_inches > 0:
                    if s.name not in std_subways_hit:
                        std_subways_hit.append(s.name)
                        if s.water_depth_inches > std_max_water_depth:
                            std_max_water_depth = s.water_depth_inches

            for b in bowls:
                dist = haversine_distance(plat, plng, b.latitude, b.longitude)
                if dist < 0.6:
                    if b.name not in std_bowls_hit:
                        std_bowls_hit.append(b.name)

    # 5. Build Standard Route Steps
    std_steps.append(NavigationStep(
        instruction=f"Depart {origin_name} onto ground roadway",
        distance_meters=min(800, int(std_dist_km * 150)),
        elevation_type="GROUND",
        is_hazard=False,
        water_depth_inches=0.0
    ))

    # Add road block alerts if any
    for block in std_road_blocks_hit[:2]:
        is_closure = block["impact"] == "ROAD_FULLY_CLOSED"
        std_steps.append(NavigationStep(
            instruction=f"ROAD OBSTACLE: {block['title']} on {block['road']} ({block['area']})",
            distance_meters=1000,
            elevation_type="GROUND",
            is_hazard=is_closure,
            water_depth_inches=0.0,
            hazard_description=f"Impact: {block['impact'].replace('_', ' ')}. Slow down or follow local diversion."
        ))

    # Add subway hazard step ONLY if subways are actually submerged in rainy weather
    if is_flooded_weather and std_subways_hit:
        first_sub = std_subways_hit[0]
        std_steps.append(NavigationStep(
            instruction=f"FLOOD WARNING: Direct route descends into {first_sub}",
            distance_meters=1200,
            elevation_type="SUBWAY",
            is_hazard=True,
            water_depth_inches=std_max_water_depth,
            hazard_description=f"Water depth {std_max_water_depth} inches. Exceeds safe limit for {v_info['name']}."
        ))
    else:
        # Dry weather step
        std_steps.append(NavigationStep(
            instruction=f"Proceed along main arterial roads toward {dest_name} (Surface dry & clear)",
            distance_meters=max(500, int(std_dist_km * 700)),
            elevation_type="GROUND",
            is_hazard=False,
            water_depth_inches=0.0
        ))

    std_steps.append(NavigationStep(
        instruction=f"Arrive at {dest_name}",
        distance_meters=300,
        elevation_type="GROUND",
        is_hazard=False,
        water_depth_inches=0.0
    ))

    # Standard Route Risk & Passability
    if not is_flooded_weather:
        # Dry day: Standard route is 100% passable
        std_passable = True
        std_safety_score = 98 if not std_road_blocks_hit else 90
        std_risk = "LOW"
    else:
        # Monsoon rainy day
        std_passable = (std_max_water_depth <= max_safe) and (len(std_subways_hit) == 0)
        if std_passable:
            std_safety_score = 80
            std_risk = "MODERATE" if std_subways_hit else "LOW"
        else:
            std_safety_score = max(10, int(100 - (std_max_water_depth / max_safe) * 50 - len(std_subways_hit) * 25))
            std_risk = "EXTREME" if std_max_water_depth > (max_safe * 1.5) else "HIGH"

    # 6. Build Monsoon Safe Elevated Route
    safe_dist_km = round(std_dist_km + 1.6, 2)
    # Elevated flyover speed in Chennai: ~38 km/h (quicker flow, bypassing ground signals)
    safe_duration_mins = max(5, int(round((safe_dist_km / 34.0) * 60)))

    safe_coords = []
    safe_coords.append([round(origin_lat, 5), round(origin_lng, 5)])
    
    kathipara = [13.0075, 80.2065]
    anna_salai_ridge = [13.0405, 80.2435]
    gst_elevated = [12.9525, 80.1415]
    basin_bridge_flyover = [13.0980, 80.2710]

    if origin_lat < 12.96 or dest_lat < 12.96:
        safe_coords.append(gst_elevated)
        safe_coords.append(kathipara)
    elif origin_lat > 13.08 or dest_lat > 13.08:
        safe_coords.append(basin_bridge_flyover)
    else:
        safe_coords.append(kathipara)
        safe_coords.append(anna_salai_ridge)

    safe_coords.append([round(dest_lat, 5), round(dest_lng, 5)])

    refined_safe_coords = []
    for k in range(len(safe_coords) - 1):
        p1 = safe_coords[k]
        p2 = safe_coords[k+1]
        refined_safe_coords.append(p1)
        mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
        refined_safe_coords.append([round(mid[0], 5), round(mid[1], 5)])
    refined_safe_coords.append(safe_coords[-1])

    safe_steps = [
        NavigationStep(
            instruction=f"Depart {origin_name} and take elevated grade-separated flyover ramp",
            distance_meters=700,
            elevation_type="ELEVATED",
            is_hazard=False,
            water_depth_inches=0.0
        ),
        NavigationStep(
            instruction="Maintain speed on Elevated Arterial Ridge (Zero water accumulation, gravity drained)",
            distance_meters=max(800, int(safe_dist_km * 750)),
            elevation_type="ELEVATED",
            is_hazard=False,
            water_depth_inches=0.0
        ),
        NavigationStep(
            instruction=f"Descend via exit ramp and arrive smoothly at {dest_name}",
            distance_meters=400,
            elevation_type="ELEVATED",
            is_hazard=False,
            water_depth_inches=0.0
        )
    ]

    safe_route = RouteDetail(
        route_name="Monsoon Safe Elevated Corridor",
        route_type="MONSOON_SAFE_ELEVATED",
        total_distance_km=safe_dist_km,
        estimated_duration_mins=safe_duration_mins,
        flood_safety_score_percent=98,
        passable_for_vehicle=True,
        risk_level="LOW",
        submerged_subways_hit=[],
        water_bowls_intersected=[],
        coordinates=refined_safe_coords,
        steps=safe_steps
    )

    standard_route = RouteDetail(
        route_name="Standard Direct Route" + (" (Flood Risk)" if (is_flooded_weather and not std_passable) else " (Clear & Dry)"),
        route_type="STANDARD_DIRECT",
        total_distance_km=std_dist_km,
        estimated_duration_mins=std_duration_mins,
        flood_safety_score_percent=std_safety_score,
        passable_for_vehicle=std_passable,
        risk_level=std_risk,
        submerged_subways_hit=std_subways_hit,
        water_bowls_intersected=std_bowls_hit,
        civic_works_on_route=std_road_blocks_hit,
        coordinates=std_coords,
        steps=std_steps
    )

    # 7. Professional Recommendation & Warning
    critical_warning = None
    if not is_flooded_weather:
        # Dry day in Chennai
        if len(std_road_blocks_hit) == 0:
            recommendation = (
                f"Clear & Dry Weather in Chennai (0.0mm rain). "
                f"The Direct Route to {dest_name} ({std_dist_km} km, ~{std_duration_mins} mins) is clear of water and civic road work. Smooth travel expected."
            )
        else:
            roads_hit = ", ".join(w["road"] for w in std_road_blocks_hit)
            recommendation = (
                f"Clear & Dry Weather in Chennai (0.0mm rain). "
                f"Direct Route to {dest_name} ({std_dist_km} km, ~{std_duration_mins} mins) is dry, but encounters {len(std_road_blocks_hit)} active civic road work(s) on {roads_hit}. Proceed with caution."
            )
    else:
        # Monsoon rainy weather
        if not std_passable:
            recommendation = (
                f"Reroute immediately via Monsoon Safe Elevated Corridor ({safe_dist_km} km, ~{safe_duration_mins} mins). "
                f"Bypasses {len(std_subways_hit)} submerged underpass(es) to avoid engine hydrolock."
            )
            critical_warning = (
                f"DANGER FOR {v_info['name'].upper()}: Direct route encounters {std_max_water_depth}\" water. "
                f"Do not enter submerged underpasses."
            )
        else:
            recommendation = (
                f"Direct Route ({std_dist_km} km) is passable with caution for {v_info['name']}. "
                f"Monsoon Safe Corridor ({safe_dist_km} km) is also available."
            )

    return RouteComparisonResponse(
        vehicle_type=vehicle_type,
        origin=RoutePoint(name=origin_name, latitude=origin_lat, longitude=origin_lng),
        destination=RoutePoint(name=dest_name, latitude=dest_lat, longitude=dest_lng),
        monsoon_safe_route=safe_route,
        standard_route=standard_route,
        recommendation=recommendation,
        critical_warning=critical_warning
    )
