import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import UPLOAD_DIR, BASE_DIR
from .database import init_db, seed_sample_audits
from .routes.api import router as api_router

# Ensure static directories exist
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="JALPRAMAAN / AQUA NEXUS API",
    description="Scientific Watershed Assessment, Automated Monitoring, and Validation Framework API",
    version="1.0.0"
)

# Enable CORS for Vite frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file endpoints for images
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include API Router
app.include_router(api_router)

from .postgis_db import init_postgis_tables, check_postgis_available

@app.on_event("startup")
def on_startup():
    init_db()
    seed_sample_audits()
    init_postgis_tables()

@app.get("/")
def root():
    return {
        "app": "JALPRAMAAN / AQUA NEXUS",
        "description": "Scientific Watershed Assessment, Automated Monitoring, and Validation Framework",
        "status": "online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
