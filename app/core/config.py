from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Chennai Flood & Subway Navigation (Waze for Chennai Rains)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./chennai_flood.db"
    
    # Chennai Center Coordinates
    CHENNAI_LAT: float = 13.0827
    CHENNAI_LNG: float = 80.2707
    DEFAULT_ZOOM: int = 12

    CORS_ORIGINS: List[str] = ["*"]

    model_config = ConfigDict(case_sensitive=True)

settings = Settings()
