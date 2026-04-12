import logging
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    results = {"gateway": "healthy", "services": {}}
    client = request.app.state.http_client

    for name, url in [
        ("deforestation", request.app.state.deforestation_url),
        ("vessel", request.app.state.vessel_url),
    ]:
        try:
            r = await client.get(f"{url}/health", timeout=5.0)
            results["services"][name] = "healthy" if r.status_code == 200 else "degraded"
        except Exception:
            results["services"][name] = "unreachable"

    return JSONResponse(content=results)
