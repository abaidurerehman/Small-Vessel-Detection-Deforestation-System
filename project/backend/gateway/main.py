import logging
import os
import time
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from middleware.logging_middleware import LoggingMiddleware
from routers import deforestation, vessel, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

DEFORESTATION_SERVICE_URL = os.getenv("DEFORESTATION_SERVICE_URL", "http://localhost:8001")
VESSEL_SERVICE_URL = os.getenv("VESSEL_SERVICE_URL", "http://localhost:8002")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("API Gateway starting up...")
    app.state.http_client = httpx.AsyncClient(timeout=120.0)
    app.state.deforestation_url = DEFORESTATION_SERVICE_URL
    app.state.vessel_url = VESSEL_SERVICE_URL
    yield
    logger.info("API Gateway shutting down...")
    await app.state.http_client.aclose()


app = FastAPI(
    title="AI Detection Platform - API Gateway",
    description="Gateway for Deforestation and Vessel Detection services",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://yourfrontend.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.add_middleware(LoggingMiddleware)

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(deforestation.router, prefix="/api/v1", tags=["Deforestation"])
app.include_router(vessel.router, prefix="/api/v1", tags=["Vessel Detection"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )
