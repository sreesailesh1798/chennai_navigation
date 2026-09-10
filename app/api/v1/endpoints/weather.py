from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.weather_service import (
    fetch_live_chennai_weather,
    get_weather_mode,
    set_weather_mode
)

router = APIRouter()

class WeatherModeUpdate(BaseModel):
    mode: str  # "LIVE", "SIMULATE_DRY", "SIMULATE_HEAVY_RAIN"

@router.get("", response_model=Dict[str, Any])
def get_current_weather():
    """Fetch current real-time or simulated weather in Chennai."""
    return fetch_live_chennai_weather()

@router.get("/mode")
def get_mode():
    """Get active weather mode."""
    return {"mode": get_weather_mode()}

@router.post("/mode")
def update_mode(req: WeatherModeUpdate):
    """Switch weather mode (e.g. for testing monsoon floods vs dry day)."""
    try:
        new_mode = set_weather_mode(req.mode)
        weather = fetch_live_chennai_weather()
        return {
            "status": "success",
            "active_mode": new_mode,
            "weather": weather
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
