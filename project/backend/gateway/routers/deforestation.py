import logging
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from utils.auth import verify_token

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/predict-deforestation")
async def predict_deforestation(
    request: Request,
    file: UploadFile = File(...),
    token: str = Depends(verify_token),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")

    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File size exceeds 20MB limit")

    client = request.app.state.http_client
    deforestation_url = request.app.state.deforestation_url

    try:
        response = await client.post(
            f"{deforestation_url}/predict-deforestation",
            files={"file": (file.filename, contents, file.content_type)},
            timeout=120.0,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Deforestation service error: {e}")
        raise HTTPException(status_code=502, detail=f"Deforestation service error: {str(e)}")
