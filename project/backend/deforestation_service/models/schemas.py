from typing import Dict, Optional
from pydantic import BaseModel


class DeforestationResponse(BaseModel):
    label: str
    confidence: float
    confidence_percent: str
    all_scores: Dict[str, float]
    processed_image: Optional[str] = None
    image_size: Dict[str, int]
    model_version: str


class ErrorResponse(BaseModel):
    detail: str
