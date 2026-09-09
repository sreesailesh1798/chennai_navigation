# 🌧️ Chennai Flood & Subway Navigation ("Waze for Chennai Rains")

A community-powered, real-time flood navigation and warning system built for Chennai's Northeast monsoon crises. Standard navigation apps do not account for road water depth, causing commuters to plunge into 2-foot stagnant water, hydrolock engines, or hit gridlock. This application solves this with vehicle-specific clearance intelligence, live subway pump telemetry, micro-canal overflow monitoring, and monsoon-safe elevated rerouting.

---

## 🚀 Key Features

### 1. 🏍️ 🚗 🚙 🚌 Vehicle-Specific Clearance Alerts
- **2-Wheeler (Motorcycle / Scooter)**: Safe tolerance `< 4 inches` (10 cm). Flags silencer/exhaust submergence, engine hydrolock, and murky open manhole hazards.
- **Sedan / Hatchback (Low Stance)**: Safe tolerance `< 7 inches` (17 cm). Protects low-positioned air intake snorkels from hydraulic seizure.
- **SUV / 4x4 (High Stance)**: Safe tolerance `< 14 inches` (35 cm). Allows navigation through calf-deep water while barring submerged subways.
- **Heavy Bus / Commercial**: Safe tolerance `< 24 inches` (60 cm).
- **Dynamic Map Filtering**: Switching vehicle clearance instantly re-evaluates all 10 subways and citizen reports across Chennai.

### 2. 🚇 Subway & Canal Live Telemetry
- **10 Critical Railway Subways Tracked**:
  - Gengu Reddy Subway (Egmore)
  - Rangarajapuram Subway (Kodambakkam / West Mambalam)
  - Vyasarpadi Railway Subway (Basin Bridge)
  - Thillai Ganga Nagar Subway (Nanganallur / Pazhavanthangal)
  - Madley Subway & Duraisamy Subway (T. Nagar)
  - Jones Road Subway (Saidapet)
  - Villivakkam Railway Subway
  - Perambur Loco Works Subway
  - Manillam Subway (Old Washermanpet)
- **Real-Time Indicators**: Live water depth in inches/feet, Corporation motor pump operational status (`OPERATIONAL`, `OVERWHELMED`, `OFFLINE`), and community verification upvotes.
- **Micro-Canals & Waterways**: Water capacity percentage gauges for Buckingham Canal, Adyar River Basin (Saidapet), Cooum, Otteri Nullah, Velachery Lake Surplus Canal, and Pallikaranai Marshland overflow.

### 3. 🛡️ Monsoon Safe Route Rerouting Engine
- **Dual Route Calculation**:
  - **Standard Direct Route**: Conventional path; highlights exact points of failure, flooded subway traps, and computes a risk safety score (e.g. 10% dangerous).
  - **Monsoon Safe Elevated Route**: Strictly routes commuters through elevated arterial ridges and flyovers (Anna Salai Arterial Ridge, Kathipara Multi-Level Grade Separator, GST Road Elevated Flyovers, OMR Elevated Expressway), guaranteeing 100% dry elevation clearance and 0 subway hazard risk.
- **Turn-by-Turn Guidance**: Elevation-tagged navigation instructions with distance breakdowns.
- **5 Built-In Commuter Presets**:
  1. *Velachery ➡️ T. Nagar* (Bypasses 100ft road & Rangarajapuram subway via Kathipara)
  2. *Tambaram ➡️ Egmore / Central* (Bypasses Thillai Ganga Nagar subway via GST elevated)
  3. *Madipakkam ➡️ OMR Sholinganallur* (Bypasses Ram Nagar bowl & marsh overflow)
  4. *Vyasarpadi ➡️ Chennai Central* (Bypasses 28" submerged Vyasarpadi subway via Basin Bridge flyover)
  5. *Mudichur ➡️ Guindy Kathipara* (Bypasses Adyar river breach via Chennai Outer Ring Expressway)

### 4. 📢 Community Inundation Reporting ("Flag Road")
- 3-tap crowdsourced report modal:
  - Visual depth selector (Ankle-Deep 0-4", Calf-Deep 4-8", Knee-Deep 8-18", Waist-Deep >18").
  - Vehicle passability checklist.
  - Critical hazard tags (Open manhole, stalled cars, downed electric wire, strong current).
  - Interactive map click to place coordinates anywhere in Chennai.
  - Community upvote/downvote verification system.

### 5. 🚨 Emergency SOS & Greater Chennai Corporation (GCC) Integration
- Direct tap-to-call directory:
  - **1913**: Greater Chennai Corporation (GCC) Central Command
  - **1070**: Tamil Nadu State Disaster Management (TNDR / SDRF Boats)
  - **103**: Chennai City Traffic Police Control Room
  - **044-45674567**: Chennai MetroWater Emergency Drinking Water Supply
  - **9498794987**: TANGEDCO Electricity Emergency

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Python 3.14, FastAPI (high-performance async REST API), SQLAlchemy ORM, SQLite (WAL mode).
- **Frontend**: Responsive single-page application, Leaflet.js with OpenStreetMap dark radar tiles, custom SVG animated markers, JetBrains Mono & Plus Jakarta Sans typography.
- **Testing**: Pytest with automated integration test coverage (12 passing tests).

---

## 🏃 Running Locally

### 1. Launch the Server
```powershell
cd C:\Users\harik\.gemini\antigravity\scratch\chennai_flood_nav
python run.py
```
Or directly with Uvicorn:
```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Access the Application
- 🌐 **Interactive Dashboard & Radar**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- 📖 **Interactive Swagger OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- 📋 **ReDoc API Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- 💓 **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 3. Run Automated Tests
```powershell
python -m pytest tests -v
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Application health & telemetry status |
| `GET` | `/api/v1/subways` | List all 10 subways with status, water depth & pump status |
| `GET` | `/api/v1/subways/{id}` | Get specific subway details |
| `POST` | `/api/v1/subways/{id}/report` | Update subway water depth, status & pump state |
| `POST` | `/api/v1/subways/{id}/upvote` | Community upvote for subway verification |
| `POST` | `/api/v1/subways/{id}/downvote` | Community dispute downvote |
| `GET` | `/api/v1/canals` | List micro-canals, capacity percentage & overflow risk |
| `GET` | `/api/v1/reports` | List community inundation reports with vehicle clearance flags |
| `POST` | `/api/v1/reports` | Submit new flood report with water depth and hazards |
| `POST` | `/api/v1/reports/{id}/vote` | Upvote or downvote a community report |
| `GET` | `/api/v1/navigation/presets` | Get 5 commuter hotspot presets |
| `GET` | `/api/v1/navigation/vehicles` | Get vehicle clearance specifications |
| `POST` | `/api/v1/navigation/route` | Calculate dual routes (Standard vs Monsoon Safe Elevated) |
| `GET` | `/api/v1/emergency/contacts` | Get GCC 1913, SDRF 1070 and emergency helplines |
| `GET` | `/api/v1/emergency/bowls` | Get low-elevation water bowl zones |
| `GET` | `/api/v1/emergency/corridors`| Get elevated dry arterial corridors |
