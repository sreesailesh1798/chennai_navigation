from fastapi import APIRouter
from app.api.v1.endpoints import subways, canals, reports, navigation, emergency, civic_works, weather

api_router = APIRouter()
api_router.include_router(subways.router, prefix="/subways", tags=["Subways"])
api_router.include_router(canals.router, prefix="/canals", tags=["Canals"])
api_router.include_router(reports.router, prefix="/reports", tags=["Flood Reports"])
api_router.include_router(navigation.router, prefix="/navigation", tags=["Navigation & Routing"])
api_router.include_router(emergency.router, prefix="/emergency", tags=["Emergency & Corridors"])
api_router.include_router(civic_works.router, prefix="/works", tags=["Civic Works & Hazards"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather & Monsoon Alerts"])

