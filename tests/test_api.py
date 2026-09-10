import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.services.seed_data import seed_all_data

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_all_data(db)
    db.close()
    yield

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "Chennai Flood" in data["system"]

def test_get_subways():
    res = client.get("/api/v1/subways")
    assert res.status_code == 200
    subways = res.json()
    assert len(subways) >= 10
    # Verify Rangarajapuram and Gengu Reddy exist
    names = [s["name"] for s in subways]
    assert any("Rangarajapuram" in n for n in names)
    assert any("Gengu Reddy" in n for n in names)

def test_filter_subways_status():
    res = client.get("/api/v1/subways?status=CLOSED_SUBMERGED")
    assert res.status_code == 200
    subways = res.json()
    assert len(subways) > 0
    for s in subways:
        assert s["status"] == "CLOSED_SUBMERGED"

def test_update_subway_status():
    subway_id = 1
    payload = {
        "status": "WATERLOGGED_WARNING",
        "water_depth_inches": 12.0,
        "pump_status": "OPERATIONAL",
        "vehicle_clearance_notes": "Tractor pump deployed, water receding slowly"
    }
    res = client.post(f"/api/v1/subways/{subway_id}/report", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["water_depth_inches"] == 12.0
    assert data["pump_status"] == "OPERATIONAL"

def test_upvote_subway():
    subway_id = 2
    initial_res = client.get(f"/api/v1/subways/{subway_id}")
    initial_votes = initial_res.json()["upvotes"]

    res = client.post(f"/api/v1/subways/{subway_id}/upvote")
    assert res.status_code == 200
    assert res.json()["upvotes"] == initial_votes + 1

def test_get_canals():
    res = client.get("/api/v1/canals")
    assert res.status_code == 200
    canals = res.json()
    assert len(canals) >= 5
    names = [c["name"] for c in canals]
    assert any("Buckingham" in n for n in names)
    assert any("Adyar" in n for n in names)

def test_get_reports():
    res = client.get("/api/v1/reports")
    assert res.status_code == 200
    reports = res.json()
    assert len(reports) >= 5

def test_submit_flood_report():
    payload = {
        "area_name": "Perumbakkam",
        "road_name": "Global Hospital Road junction",
        "latitude": 12.9056,
        "longitude": 80.1925,
        "depth_level": "KNEE_DEEP",
        "depth_inches": 15.0,
        "passable_vehicles": ["suv", "bus_heavy"],
        "hazard_tags": ["open_manhole", "hidden_divider"],
        "description": "Marsh water overflowing across main carriage way",
        "reporter_role": "VOLUNTEER"
    }
    res = client.post("/api/v1/reports", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["area_name"] == "Perumbakkam"
    assert data["depth_inches"] == 15.0
    assert "suv" in data["passable_vehicles"]
    assert "open_manhole" in data["hazard_tags"]

def test_vote_report():
    res = client.post("/api/v1/reports/1/vote?action=upvote")
    assert res.status_code == 200
    assert "upvotes" in res.json()

def test_get_navigation_presets():
    res = client.get("/api/v1/navigation/presets")
    assert res.status_code == 200
    presets = res.json()
    assert len(presets) >= 4
    ids = [p["id"] for p in presets]
    assert "velachery_to_tnagar" in ids
    assert "tambaram_to_egmore" in ids

def test_weather_endpoints():
    res = client.get("/api/v1/weather")
    assert res.status_code == 200
    w = res.json()
    assert "current_rain_mm" in w
    assert "subways_flooded" in w

    # Test mode toggle
    res_toggle = client.post("/api/v1/weather/mode", json={"mode": "SIMULATE_DRY"})
    assert res_toggle.status_code == 200
    assert res_toggle.json()["active_mode"] == "SIMULATE_DRY"

def test_dry_weather_routing_no_false_alarm():
    # Force dry mode
    client.post("/api/v1/weather/mode", json={"mode": "SIMULATE_DRY"})

    # Subways should be dry (0" depth, OPEN_CLEAR)
    res_sub = client.get("/api/v1/subways?apply_weather=true")
    assert res_sub.status_code == 200
    subways = res_sub.json()
    assert all(s["water_depth_inches"] == 0.0 for s in subways)
    assert all(s["status"] == "OPEN_CLEAR" for s in subways)

    # Route should be PASSABLE with NO false warnings
    payload = {
        "origin_name": "Velachery Vijayanagar Junction",
        "origin_lat": 12.9815,
        "origin_lng": 80.2212,
        "dest_name": "T. Nagar Panagal Park",
        "dest_lat": 13.0416,
        "dest_lng": 80.2312,
        "vehicle_type": "two_wheeler"
    }
    res = client.post("/api/v1/navigation/route", json=payload)
    assert res.status_code == 200
    data = res.json()
    std = data["standard_route"]
    
    assert std["passable_for_vehicle"] is True
    assert std["risk_level"] == "LOW"
    assert len(std["submerged_subways_hit"]) == 0
    assert data["critical_warning"] is None
    assert std["total_distance_km"] > 0
    assert std["estimated_duration_mins"] > 0

def test_monsoon_rain_routing_hazard_warning():
    # Force heavy monsoon rain simulation
    client.post("/api/v1/weather/mode", json={"mode": "SIMULATE_HEAVY_RAIN"})

    payload = {
        "origin_name": "Velachery Vijayanagar Junction",
        "origin_lat": 12.9815,
        "origin_lng": 80.2212,
        "dest_name": "T. Nagar Panagal Park",
        "dest_lat": 13.0416,
        "dest_lng": 80.2312,
        "vehicle_type": "two_wheeler"
    }
    res = client.post("/api/v1/navigation/route", json=payload)
    assert res.status_code == 200
    data = res.json()
    
    # 2-wheeler should be BLOCKED on standard route due to flooded subways (>20")
    std = data["standard_route"]
    safe = data["monsoon_safe_route"]
    
    assert std["passable_for_vehicle"] is False
    assert std["risk_level"] in ["EXTREME", "HIGH"]
    assert len(std["submerged_subways_hit"]) > 0
    assert data["critical_warning"] is not None
    assert "2-WHEELER" in data["critical_warning"] or "2-Wheeler" in data["critical_warning"]

    # Monsoon safe route must be 100% passable and elevated
    assert safe["passable_for_vehicle"] is True
    assert safe["flood_safety_score_percent"] >= 90
    assert len(safe["submerged_subways_hit"]) == 0
    assert len(safe["steps"]) > 0

    # Reset back to LIVE mode
    client.post("/api/v1/weather/mode", json={"mode": "LIVE"})

def test_emergency_contacts_and_corridors():
    res_contacts = client.get("/api/v1/emergency/contacts")
    assert res_contacts.status_code == 200
    contacts = res_contacts.json()
    assert any("1913" in c["helpline"] for c in contacts)
    assert any("1070" in c["helpline"] for c in contacts)

    res_bowls = client.get("/api/v1/emergency/bowls")
    assert res_bowls.status_code == 200
    bowls = res_bowls.json()
    assert len(bowls) >= 4

    res_corridors = client.get("/api/v1/emergency/corridors")
    assert res_corridors.status_code == 200
    corridors = res_corridors.json()
    assert len(corridors) >= 3

def test_civic_works_crud():
    # 1. Get works list
    res = client.get("/api/v1/works")
    assert res.status_code == 200
    works = res.json()
    assert len(works) >= 5

    # 2. Create new work report
    payload = {
        "area_name": "Velachery",
        "road_name": "Taramani Link Road",
        "latitude": 12.9800,
        "longitude": 80.2250,
        "work_type": "SWD_DRAIN_TRENCH",
        "work_title": "Trench Excavation for Stormwater Pipe",
        "impact_level": "LANE_PARTIALLY_BLOCKED",
        "description": "Right lane closed near TCS gate",
        "reported_by": "CITIZEN"
    }
    res_create = client.post("/api/v1/works", json=payload)
    assert res_create.status_code == 200
    created = res_create.json()
    assert created["road_name"] == "Taramani Link Road"
    assert created["upvotes"] == 1
    work_id = created["id"]

    # 3. Upvote work
    res_upvote = client.post(f"/api/v1/works/{work_id}/upvote")
    assert res_upvote.status_code == 200
    assert res_upvote.json()["upvotes"] == 2

