import json
import datetime
from sqlalchemy.orm import Session
from app.models.flood_models import Subway, Canal, FloodReport, WaterBowl, SafeCorridor, CivicWorkReport

def seed_all_data(db: Session):
    # 1. Subways
    if db.query(Subway).count() == 0:
        subways_data = [
            {
                "name": "Gengu Reddy Subway (Egmore)",
                "area_name": "Egmore / Chetpet",
                "latitude": 13.0784,
                "longitude": 80.2587,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 22.0,
                "pump_status": "OVERWHELMED",
                "vehicle_clearance_notes": "Subway submerged under 22 inches of water. All vehicular traffic closed by traffic police.",
                "upvotes": 42,
                "downvotes": 1
            },
            {
                "name": "Rangarajapuram Subway (Kodambakkam)",
                "area_name": "Kodambakkam / West Mambalam",
                "latitude": 13.0441,
                "longitude": 80.2223,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 26.5,
                "pump_status": "OVERWHELMED",
                "vehicle_clearance_notes": "Severe water accumulation. Two autos and three 2-wheelers stalled and abandoned. Total barricade.",
                "upvotes": 68,
                "downvotes": 0
            },
            {
                "name": "Vyasarpadi Railway Subway",
                "area_name": "Vyasarpadi / Basin Bridge",
                "latitude": 13.1092,
                "longitude": 80.2643,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 28.0,
                "pump_status": "OFFLINE",
                "vehicle_clearance_notes": "Both carriage tunnels completely flooded. 2.3 ft stagnant water. Divert via Basin Bridge Flyover.",
                "upvotes": 55,
                "downvotes": 2
            },
            {
                "name": "Thillai Ganga Nagar Subway (Nanganallur)",
                "area_name": "Nanganallur / Pazhavanthangal",
                "latitude": 12.9868,
                "longitude": 80.1884,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 31.0,
                "pump_status": "OVERWHELMED",
                "vehicle_clearance_notes": "Connecting GST Road to Nanganallur is fully drowned. Water reached top of barricades.",
                "upvotes": 73,
                "downvotes": 1
            },
            {
                "name": "Madley Subway (T. Nagar)",
                "area_name": "T. Nagar / Burkit Road",
                "latitude": 13.0372,
                "longitude": 80.2289,
                "status": "WATERLOGGED_WARNING",
                "water_depth_inches": 7.5,
                "pump_status": "OPERATIONAL",
                "vehicle_clearance_notes": "Water approx 7.5 inches deep. High clearance SUVs and buses passable. Two-wheelers risking engine stalls.",
                "upvotes": 29,
                "downvotes": 3
            },
            {
                "name": "Duraisamy Subway (T. Nagar)",
                "area_name": "T. Nagar / Panagal Park",
                "latitude": 13.0416,
                "longitude": 80.2312,
                "status": "WATERLOGGED_WARNING",
                "water_depth_inches": 9.0,
                "pump_status": "OPERATIONAL",
                "vehicle_clearance_notes": "Calf-deep water at entrance slope. 2-wheelers prohibited by traffic marshals. Sedans moving at crawl.",
                "upvotes": 34,
                "downvotes": 2
            },
            {
                "name": "Jones Road Subway (Saidapet)",
                "area_name": "Saidapet / West Mambalam",
                "latitude": 13.0238,
                "longitude": 80.2215,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 19.5,
                "pump_status": "OVERWHELMED",
                "vehicle_clearance_notes": "Adyar river backwaters creeping into approach ramp. Barricaded. Divert via Maraimalai Adigal Bridge.",
                "upvotes": 39,
                "downvotes": 1
            },
            {
                "name": "Villivakkam Railway Subway",
                "area_name": "Villivakkam / Kolathur",
                "latitude": 13.1075,
                "longitude": 80.2078,
                "status": "WATERLOGGED_WARNING",
                "water_depth_inches": 8.5,
                "pump_status": "OPERATIONAL",
                "vehicle_clearance_notes": "Water accumulating rapidly. Passable only for heavy vehicles and high-stance SUVs.",
                "upvotes": 22,
                "downvotes": 2
            },
            {
                "name": "Perambur Loco Works Subway",
                "area_name": "Perambur / Kolathur Link",
                "latitude": 13.1118,
                "longitude": 80.2356,
                "status": "CLOSED_SUBMERGED",
                "water_depth_inches": 24.0,
                "pump_status": "OVERWHELMED",
                "vehicle_clearance_notes": "Closed for all vehicular movement. Divert via Perambur Flyover.",
                "upvotes": 31,
                "downvotes": 0
            },
            {
                "name": "Manillam Subway (Old Washermanpet)",
                "area_name": "Washermanpet / Royapuram",
                "latitude": 13.1165,
                "longitude": 80.2872,
                "status": "OPEN_CLEAR",
                "water_depth_inches": 2.0,
                "pump_status": "OPERATIONAL",
                "vehicle_clearance_notes": "Corporation pumps actively clearing water. Clear for all vehicles with caution on wet surface.",
                "upvotes": 18,
                "downvotes": 1
            }
        ]
        for s in subways_data:
            db.add(Subway(**s))
        db.commit()

    # 2. Canals
    if db.query(Canal).count() == 0:
        canals_data = [
            {
                "name": "Buckingham Canal (Adyar Stretch)",
                "catchment_area": "Mylapore - Adyar Basin",
                "latitude": 13.0062,
                "longitude": 80.2541,
                "water_level_percent": 88,
                "status": "HIGH_ALERT",
                "flow_rate_desc": "Heavy discharge with tidal backpressure at Adyar estuary",
                "flood_risk_level": "HIGH"
            },
            {
                "name": "Buckingham Canal (Sholinganallur / OMR Stretch)",
                "catchment_area": "South OMR IT Corridor",
                "latitude": 12.8992,
                "longitude": 80.2312,
                "water_level_percent": 95,
                "status": "OVERFLOWING",
                "flow_rate_desc": "Breached embankment spilling onto service road near Elcot SEZ",
                "flood_risk_level": "CRITICAL"
            },
            {
                "name": "Adyar River Basin (Saidapet Bridge)",
                "catchment_area": "Chembarambakkam to Bay of Bengal",
                "latitude": 13.0182,
                "longitude": 80.2245,
                "water_level_percent": 82,
                "status": "HIGH_ALERT",
                "flow_rate_desc": "Chembarambakkam release at 6,000 cusecs. Low banks under alert.",
                "flood_risk_level": "HIGH"
            },
            {
                "name": "Cooum River (Chintadripet Basin)",
                "catchment_area": "Central Chennai Drainage",
                "latitude": 13.0725,
                "longitude": 80.2741,
                "water_level_percent": 74,
                "status": "NORMAL",
                "flow_rate_desc": "Flowing steadily without overflowing main bunds",
                "flood_risk_level": "MODERATE"
            },
            {
                "name": "Otteri Nullah (Kilpauk - Basin Bridge)",
                "catchment_area": "North-Central Interceptor",
                "latitude": 13.0954,
                "longitude": 80.2536,
                "water_level_percent": 92,
                "status": "OVERFLOWING",
                "flow_rate_desc": "Canal overflowing near Demellows Road & Pulianthope",
                "flood_risk_level": "CRITICAL"
            },
            {
                "name": "Velachery Lake Surplus Canal & Veerangal Odai",
                "catchment_area": "Velachery - Pallikaranai Inundation Belt",
                "latitude": 12.9782,
                "longitude": 80.2185,
                "water_level_percent": 98,
                "status": "OVERFLOWING",
                "flow_rate_desc": "Surplus discharge inundating 100ft bypass road and residential streets",
                "flood_risk_level": "CRITICAL"
            },
            {
                "name": "Pallikaranai Marshland Drainage Channel",
                "catchment_area": "Perumbakkam - Semmancheri Outflow",
                "latitude": 12.9362,
                "longitude": 80.2148,
                "water_level_percent": 93,
                "status": "OVERFLOWING",
                "flow_rate_desc": "Severe overflow cutting across connecting roads to Medavakkam",
                "flood_risk_level": "CRITICAL"
            }
        ]
        for c in canals_data:
            db.add(Canal(**c))
        db.commit()

    # 3. Water Bowls
    if db.query(WaterBowl).count() == 0:
        water_bowls_data = [
            {
                "name": "Velachery 100ft Road & AGS Colony Bowl",
                "area_name": "Velachery",
                "latitude": 12.9815,
                "longitude": 80.2212,
                "radius_meters": 950,
                "severity_level": "EXTREME_BOWL",
                "elevation_deficit_m": 3.2,
                "description": "Topographical depression. Runoff from lake and urban catchment pools here up to 2 feet deep.",
                "elevated_alternative": "Take Velachery Main Road Flyover and bypass through Guru Nanak College elevated link."
            },
            {
                "name": "Madipakkam Ram Nagar & Kubera Nagar Bowl",
                "area_name": "Madipakkam",
                "latitude": 12.9642,
                "longitude": 80.1985,
                "radius_meters": 900,
                "severity_level": "EXTREME_BOWL",
                "elevation_deficit_m": 2.8,
                "description": "Historic lakebed flood basin. High water stagnation making all internal cross-streets impassable.",
                "elevated_alternative": "Divert strictly via Medavakkam Main Road and Inner Ring Road elevated corridor."
            },
            {
                "name": "Perumbakkam Global Hospital Belt",
                "area_name": "Perumbakkam",
                "latitude": 12.9056,
                "longitude": 80.1925,
                "radius_meters": 850,
                "severity_level": "EXTREME_BOWL",
                "elevation_deficit_m": 2.4,
                "description": "Water backing up from marshland culverts. Sedans and auto-rickshaws frequently stranded.",
                "elevated_alternative": "Use Sholinganallur-Medavakkam elevated arterial link."
            },
            {
                "name": "Mudichur Krishna Nagar & Varadarajapuram",
                "area_name": "Tambaram / Mudichur",
                "latitude": 12.9152,
                "longitude": 80.0682,
                "radius_meters": 1200,
                "severity_level": "EXTREME_BOWL",
                "elevation_deficit_m": 3.5,
                "description": "Direct Adyar river overflow bowl. Stagnation exceeds 2.5 ft during heavy cyclone spells.",
                "elevated_alternative": "Take Chennai Outer Ring Road (CORR) elevated bypass or GST Road elevated corridor."
            },
            {
                "name": "Kolathur Venus Nagar & Retteri Low-lying Zone",
                "area_name": "Kolathur",
                "latitude": 13.1252,
                "longitude": 80.2165,
                "radius_meters": 750,
                "severity_level": "MODERATE_BOWL",
                "elevation_deficit_m": 1.8,
                "description": "Water pooling around Retteri subway underpass and residential blocks.",
                "elevated_alternative": "Use 200ft Radial Inner Ring Road elevated flyovers."
            },
            {
                "name": "Korattur Industrial Estate North Avenue",
                "area_name": "Korattur / Ambattur",
                "latitude": 13.1112,
                "longitude": 80.1782,
                "radius_meters": 700,
                "severity_level": "MODERATE_BOWL",
                "elevation_deficit_m": 1.5,
                "description": "Industrial runoff overflow. 10 inches water on service roads.",
                "elevated_alternative": "Use CTH Road elevated bridge."
            }
        ]
        for wb in water_bowls_data:
            db.add(WaterBowl(**wb))
        db.commit()

    # 4. Safe Corridors
    if db.query(SafeCorridor).count() == 0:
        safe_corridors_data = [
            {
                "name": "Anna Salai Arterial Ridge (Guindy to Central)",
                "corridor_type": "ARTERIAL_RIDGE",
                "description": "Highest natural ridge elevation running through central Chennai. Features Gemini, DMS, and Nandanam grade separators.",
                "elevation_advantage_m": 8.5,
                "status": "CLEAR_ELEVATED",
                "waypoints_json": json.dumps([
                    [13.0067, 80.2206],
                    [13.0232, 80.2284],
                    [13.0405, 80.2435],
                    [13.0582, 80.2592],
                    [13.0827, 80.2755]
                ])
            },
            {
                "name": "Kathipara Multi-Level Grade Separator",
                "corridor_type": "ELEVATED_FLYOVER",
                "description": "Massive elevated cloverleaf junction connecting GST Road, Inner Ring Road, Mount-Poonamallee, and Anna Salai.",
                "elevation_advantage_m": 14.0,
                "status": "CLEAR_ELEVATED",
                "waypoints_json": json.dumps([
                    [13.0055, 80.2035],
                    [13.0078, 80.2052],
                    [13.0092, 80.2075]
                ])
            },
            {
                "name": "GST Road Elevated Corridor (Airport to Tambaram)",
                "corridor_type": "ELEVATED_FLYOVER",
                "description": "Elevated transit avoiding ground-level inundation at Pallavaram and Chromepet railway gates.",
                "elevation_advantage_m": 9.0,
                "status": "CLEAR_ELEVATED",
                "waypoints_json": json.dumps([
                    [12.9812, 80.1754],
                    [12.9525, 80.1415],
                    [12.9249, 80.1182]
                ])
            },
            {
                "name": "OMR Elevated IT Expressway",
                "corridor_type": "EXPRESSWAY",
                "description": "Elevated central highway avoiding waterlogging of canal-adjacent service roads.",
                "elevation_advantage_m": 7.0,
                "status": "CLEAR_ELEVATED",
                "waypoints_json": json.dumps([
                    [12.9862, 80.2452],
                    [12.9412, 80.2355],
                    [12.8985, 80.2282]
                ])
            }
        ]
        for sc in safe_corridors_data:
            db.add(SafeCorridor(**sc))
        db.commit()

    # 5. Flood Reports
    if db.query(FloodReport).count() == 0:
        reports_data = [
            {
                "area_name": "Velachery",
                "road_name": "100ft Bypass Road near MRTS Station",
                "latitude": 12.9792,
                "longitude": 80.2205,
                "depth_level": "WAIST_DEEP_SUBMERGED",
                "depth_inches": 21.0,
                "passable_vehicles": json.dumps(["bus"]),
                "hazard_tags": json.dumps(["open_manhole", "stalled_vehicles", "black_sludge"]),
                "description": "Water overflowing from lake canal across entire roadway. 2 cars drowned up to windshield. Impassable for bikes and sedans!",
                "reporter_role": "TRAFFIC_POLICE",
                "upvotes": 87,
                "downvotes": 1,
                "verification_status": "VERIFIED"
            },
            {
                "area_name": "Madipakkam",
                "road_name": "Ram Nagar North 3rd Main Road",
                "latitude": 12.9654,
                "longitude": 80.1978,
                "depth_level": "KNEE_DEEP",
                "depth_inches": 14.5,
                "passable_vehicles": json.dumps(["suv", "bus"]),
                "hazard_tags": json.dumps(["hidden_potholes", "submerged_median"]),
                "description": "Water level reaching middle of car doors. Only Thar/Scorpio or high-clearance tractors getting through.",
                "reporter_role": "CITIZEN",
                "upvotes": 54,
                "downvotes": 2,
                "verification_status": "VERIFIED"
            },
            {
                "area_name": "Kodambakkam",
                "road_name": "Approach ramp to Rangarajapuram Subway",
                "latitude": 13.0448,
                "longitude": 80.2215,
                "depth_level": "WAIST_DEEP_SUBMERGED",
                "depth_inches": 26.0,
                "passable_vehicles": json.dumps([]),
                "hazard_tags": json.dumps(["dead_end", "police_barricade"]),
                "description": "Completely submerged! Police placed barricades. Commuters heading to West Mambalam take Anna Salai / Nandanam route.",
                "reporter_role": "VOLUNTEER",
                "upvotes": 95,
                "downvotes": 0,
                "verification_status": "VERIFIED"
            },
            {
                "area_name": "Tambaram",
                "road_name": "Mudichur Main Road near Krishna Nagar",
                "latitude": 12.9165,
                "longitude": 80.0712,
                "depth_level": "WAIST_DEEP_SUBMERGED",
                "depth_inches": 23.0,
                "passable_vehicles": json.dumps(["bus"]),
                "hazard_tags": json.dumps(["strong_current", "river_overflow"]),
                "description": "Adyar river breach. Water current is strong. Small vehicles will get swept into ditches! Use 400ft bypass!",
                "reporter_role": "CITIZEN",
                "upvotes": 61,
                "downvotes": 1,
                "verification_status": "VERIFIED"
            }
        ]
        for r in reports_data:
            db.add(FloodReport(**r))
        db.commit()

    # 6. Civic Works
    if db.query(CivicWorkReport).count() == 0:
        works_data = [
            {
                "area_name": "Velachery",
                "road_name": "Velachery Main Road near Dhandeeswaram Temple",
                "latitude": 12.9765,
                "longitude": 80.2195,
                "work_type": "SWD_DRAIN_TRENCH",
                "work_title": "GCC Stormwater Drain Excavation / Deep Trench",
                "impact_level": "LANE_PARTIALLY_BLOCKED",
                "description": "Deep 6ft trench dug along left carriage lane for flood drain box culvert. Two-wheelers maintain right lane.",
                "reported_by": "CITIZEN",
                "upvotes": 38,
                "status": "ACTIVE_WORK"
            },
            {
                "area_name": "T. Nagar",
                "road_name": "Burkit Road approach to Madley Subway",
                "latitude": 13.0365,
                "longitude": 80.2295,
                "work_type": "MOTOR_PUMP_DEPLOYED",
                "work_title": "Corporation 100-HP Motor Pump Hoses Across Road",
                "impact_level": "LANE_PARTIALLY_BLOCKED",
                "description": "Heavy yellow suction hoses stretched across roadway to drain water into canal. Ramp speed-bumps placed.",
                "reported_by": "VOLUNTEER",
                "upvotes": 44,
                "status": "ACTIVE_WORK"
            },
            {
                "area_name": "Vadapalani",
                "road_name": "Arcot Road near Metro Station Junction",
                "latitude": 13.0512,
                "longitude": 80.2125,
                "work_type": "METROWATER_ROAD_CUT",
                "work_title": "MetroWater Pipeline Repair & Road Cut",
                "impact_level": "SLOW_MOVING",
                "description": "Middle lane cut open for water valve repair. Road surface gravelly; slippery for motorcycles.",
                "reported_by": "CITIZEN",
                "upvotes": 29,
                "status": "ACTIVE_WORK"
            },
            {
                "area_name": "Teynampet",
                "road_name": "Cenotaph Road near Turnbulls Road junction",
                "latitude": 13.0285,
                "longitude": 80.2452,
                "work_type": "DEBRIS_TREE_FALL",
                "work_title": "Fallen Tree Branch Removal by Disaster Wardens",
                "impact_level": "LANE_PARTIALLY_BLOCKED",
                "description": "Heavy branch snapped by cyclonic winds. Forest department crew clearing debris from right lane.",
                "reported_by": "TRAFFIC_POLICE",
                "upvotes": 52,
                "status": "ACTIVE_WORK"
            },
            {
                "area_name": "Egmore",
                "road_name": "Gandhi Irwin Road near Gengu Reddy Subway",
                "latitude": 13.0792,
                "longitude": 80.2598,
                "work_type": "POLICE_BARRICADE",
                "work_title": "Police Flood Diversion Barricades",
                "impact_level": "ROAD_FULLY_CLOSED",
                "description": "Total barricade due to 22-inch subway submersion. All traffic redirected towards EVR Periyar Salai.",
                "reported_by": "TRAFFIC_POLICE",
                "upvotes": 67,
                "status": "ACTIVE_WORK"
            }
        ]
        for w in works_data:
            db.add(CivicWorkReport(**w))
        db.commit()

    print("All tables successfully checked and seeded!")
