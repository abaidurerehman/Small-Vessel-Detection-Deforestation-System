import logging
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/predict-vessel")
async def predict_vessel(
    request: Request,
    file:       UploadFile = File(...),
    confidence: float      = Form(0.25),
    iou:        float      = Form(0.45),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")
    logger.info(f"predict-vessel | {file.filename} | conf={confidence} iou={iou}")
    try:
        result = request.app.state.model_service.predict(contents, conf=confidence, iou=iou)
        logger.info(f"Done — {result['vessel_count']} vessels")
        return JSONResponse(content=result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
