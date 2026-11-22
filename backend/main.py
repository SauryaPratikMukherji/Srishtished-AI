import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
    if (FRONTEND_DIST / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="frontend_assets")

    @app.get("/")
    async def serve_index():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith(("api/", "api", "docs", "redoc", "openapi.json", "static/", "uploads/")):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        target_file = FRONTEND_DIST / full_path
        if target_file.is_file():
            return FileResponse(str(target_file))
        return FileResponse(str(FRONTEND_DIST / "index.html"))
else:
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
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
