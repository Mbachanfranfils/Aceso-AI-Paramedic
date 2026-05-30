import os
import sys
import logging
from dotenv import load_dotenv

# Load env variables before other imports
load_dotenv()

# Validate env vars
REQUIRED_ENV_VARS = [
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY"
]

missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    print(f"ERROR: Missing required environment variables: {', '.join(missing_vars)}")
    sys.exit(1)

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routes import chat
from app.utils.rate_limiter import limiter

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Paramedic",
    description="FastAPI backend for AI Paramedic first aid assistant.",
    version="1.0.0"
)

# CORS Configuration
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins_list = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type", "x-session-id"],
)

# Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Generic Exception Handler (500)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Service temporarily unavailable due to internal error."}
    )

# Routers
app.include_router(chat.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
