from typing import List, Dict, Optional
from pydantic import BaseModel


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    x2: int
    y2: int


class VesselDetection(BaseModel):
    id: int
    vessel_class: str
    confidence: float
    confidence_percent: str
    bounding_box: BoundingBox
    color: str


class VesselResponse(BaseModel):
    vessel_count: int
    detections: List[Dict]
    average_confidence: float
    average_confidence_percent: str
    annotated_image: Optional[str] = None
    image_size: Dict[str, int]
    model_version: str
