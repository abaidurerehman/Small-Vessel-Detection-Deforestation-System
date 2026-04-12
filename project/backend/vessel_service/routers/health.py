from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health")
async def health():
    return JSONResponse(content={"service": "vessel-service", "status": "healthy"})
