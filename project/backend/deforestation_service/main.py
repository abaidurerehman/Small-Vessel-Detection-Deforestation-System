import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import predict, health
from services.model_service import DeforestationModelService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Deforestation Service starting — loading model...")
    app.state.model_service = DeforestationModelService()
    app.state.model_service.load_model()
    logger.info("Deforestation model loaded successfully.")
    yield
    logger.info("Deforestation Service shutting down.")


app = FastAPI(
    title="Deforestation Detection Service",
    description="Microservice for AI-powered deforestation detection",
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
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Prediction"])


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": str(exc)})
