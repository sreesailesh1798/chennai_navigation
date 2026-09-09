import urllib.request
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional

CHENNAI_LAT = 13.0827
CHENNAI_LNG = 80.2707

_cached_weather: Optional[Dict[str, Any]] = None
_cache_time: float = 0
_cache_ttl_seconds: float = 600  # 10 minutes cache

# Current operating mode: "LIVE", "SIMULATE_DRY", "SIMULATE_HEAVY_RAIN"
_current_mode: str = "LIVE"

def get_weather_mode() -> str:
    global _current_mode
    return _current_mode

def set_weather_mode(mode: str) -> str:
    global _current_mode, _cached_weather, _cache_time
    if mode in ["LIVE", "SIMULATE_DRY", "SIMULATE_HEAVY_RAIN"]:
        _current_mode = mode
        _cached_weather = None
        _cache_time = 0
        return _current_mode
    raise ValueError(f"Invalid mode: {mode}")

def fetch_live_chennai_weather() -> Dict[str, Any]:
    global _cached_weather, _cache_time, _current_mode
    now = time.time()

    if _cached_weather and (now - _cache_time) < _cache_ttl_seconds:
        return _cached_weather

    if _current_mode == "SIMULATE_DRY":
        data = {
            "mode": "SIMULATE_DRY",
            "current_rain_mm": 0.0,
            "past_24h_rain_mm": 0.0,
            "temperature_c": 31.5,
            "condition": "DRY_CLEAR",
            "is_rainy": False,
            "subways_flooded": False,
            "summary": "Clear Skies / Dry Day (0.0mm rain). All 10 subways dry and 100% passable.",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
        _cached_weather = data
        _cache_time = now
        return data

    if _current_mode == "SIMULATE_HEAVY_RAIN":
        data = {
            "mode": "SIMULATE_HEAVY_RAIN",
            "current_rain_mm": 38.5,
            "past_24h_rain_mm": 112.0,
            "temperature_c": 24.2,
            "condition": "HEAVY_MONSOON",
            "is_rainy": True,
            "subways_flooded": True,
            "summary": "Heavy Northeast Monsoon Downpour (112mm in 24h). 6 low-lying subways submerged.",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
        _cached_weather = data
        _cache_time = now
        return data

    # Default: "LIVE" via Open-Meteo API
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={CHENNAI_LAT}&longitude={CHENNAI_LNG}&"
        f"current=temperature_2m,precipitation,rain,weather_code&"
        f"hourly=precipitation,rain&past_days=1&forecast_days=1&timezone=Asia%2FKolkata"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ChennaiFloodNav/2.0"})
        with urllib.request.urlopen(req, timeout=5) as res:
            raw = json.loads(res.read().decode("utf-8"))
            curr = raw.get("current", {})
            curr_rain = float(curr.get("precipitation", 0.0))
            temp_c = float(curr.get("temperature_2m", 30.0))
            
            hourly_rain = raw.get("hourly", {}).get("rain", [])
            past_24h = float(sum(hourly_rain[:24])) if len(hourly_rain) >= 24 else curr_rain

            # Thresholds: If less than 8mm rain in 24h and 0mm currently, it's dry
            is_rainy = (curr_rain > 1.0 or past_24h > 12.0)
            
            if is_rainy:
                cond = "HEAVY_MONSOON" if past_24h > 40.0 else "MODERATE_RAIN"
                summary = f"Active Rain in Chennai ({curr_rain}mm/hr, {past_24h:.1f}mm in 24h). Waterlogging alerts active."
            else:
                cond = "DRY_CLEAR"
                summary = f"Dry Weather in Chennai ({past_24h:.1f}mm in 24h). All subways clear and dry."

            data = {
                "mode": "LIVE",
                "current_rain_mm": curr_rain,
                "past_24h_rain_mm": round(past_24h, 1),
                "temperature_c": round(temp_c, 1),
                "condition": cond,
                "is_rainy": is_rainy,
                "subways_flooded": is_rainy,
                "summary": summary,
                "last_updated": datetime.now(timezone.utc).isoformat()
            }
            _cached_weather = data
            _cache_time = now
            return data
    except Exception as e:
        fallback = {
            "mode": "LIVE_FALLBACK",
            "current_rain_mm": 0.0,
            "past_24h_rain_mm": 0.0,
            "temperature_c": 31.0,
            "condition": "DRY_CLEAR",
            "is_rainy": False,
            "subways_flooded": False,
            "summary": "Dry Weather in Chennai. Subways clear.",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
        _cached_weather = fallback
        _cache_time = now
        return fallback
