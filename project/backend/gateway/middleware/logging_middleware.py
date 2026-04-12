import logging
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        logger.info(f"→ {request.method} {request.url.path} | Client: {request.client.host if request.client else 'unknown'}")
        try:
            response = await call_next(request)
            duration = (time.time() - start_time) * 1000
            logger.info(f"← {request.method} {request.url.path} | Status: {response.status_code} | {duration:.2f}ms")
            return response
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"✗ {request.method} {request.url.path} | Error: {e} | {duration:.2f}ms")
            raise
