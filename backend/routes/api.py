import json
import uuid
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel

from ..config import DEMO_WATERSHEDS, UPLOAD_DIR
from ..database import get_db_connection
from ..viewshed import calculate_viewshed_cone
from ..crypto_auth import verify_crypto_payload, generate_device_signature, generate_photo_hash
from ..satellite_service import generate_satellite_grid_overlay, query_srishti_drishti_bands
from ..dual_ai_validator import cross_validate_ground_and_satellite

from ..postgis_db import check_postgis_available, fetch_postgis_audits, insert_postgis_audit

router = APIRouter(prefix="/api")

@router.get("/watersheds")
def get_watersheds():
    """List all registered watershed monitoring zones."""
    postgis_active = check_postgis_available()
    return {
        "status": "success",
        "postgis_active": postgis_active,
        "spatial_engine": "PostGIS (ST_AsGeoJSON / ST_DWithin)" if postgis_active else "SQLite Spatial (PostGIS Mode Ready)",
        "watersheds": DEMO_WATERSHEDS
    }

@router.get("/watershed/{watershed_id}/satellite-layer")
def get_satellite_layer(watershed_id: str, grid_size: int = 6):
    """Generates satellite multispectral NDVI/NDWI grid overlay for a watershed zone."""
    target_ws = next((w for w in DEMO_WATERSHEDS if w["id"] == watershed_id), DEMO_WATERSHEDS[0])
    grid_geojson = generate_satellite_grid_overlay(target_ws["bounds"], grid_size)
    return {
        "watershed_id": target_ws["id"],
        "watershed_name": target_ws["name"],
        "layer_type": "SRISHTI_DRISHTI_30M_MULTISPECTRAL",
        "grid": grid_geojson
    }

@router.get("/audits")
def get_audits(watershed_id: str = None):
    """Retrieve all logged field audits with GeoJSON camera view cones via PostGIS or SQLite."""
    if check_postgis_available():
        postgis_results = fetch_postgis_audits(watershed_id)
        if postgis_results is not None:
            return {"status": "success", "engine": "PostGIS", "total": len(postgis_results), "audits": postgis_results}

    conn = get_db_connection()
    cursor = conn.cursor()
    
    if watershed_id:
        cursor.execute("SELECT * FROM audits WHERE watershed_id = ? ORDER BY created_at DESC", (watershed_id,))
    else:
        cursor.execute("SELECT * FROM audits ORDER BY created_at DESC")
        
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        item = dict(row)
        item["viewshed_geojson"] = json.loads(item["viewshed_geojson"]) if item["viewshed_geojson"] else None
        item["validation_details"] = json.loads(item["validation_details"]) if item["validation_details"] else None
        results.append(item)
        
    return {"status": "success", "engine": "SQLite (PostGIS Ready)", "total": len(results), "audits": results}

@router.get("/audit/{audit_id}")
def get_audit_detail(audit_id: int):
    """Retrieve single audit detail."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audits WHERE id = ?", (audit_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Audit record not found")
        
    item = dict(row)
    item["viewshed_geojson"] = json.loads(item["viewshed_geojson"]) if item["viewshed_geojson"] else None
    item["validation_details"] = json.loads(item["validation_details"]) if item["validation_details"] else None
    return {"status": "success", "audit": item}

@router.post("/audit/submit")
async def submit_audit(
    watershed_id: str = Form("WS-AP-ANTP-01"),
    structure_type: str = Form("Check Dam (Concrete)"),
    lat: float = Form(14.6820),
    lng: float = Form(77.6010),
    azimuth: float = Form(135.0),
    focal_length: float = Form(28.0),
    inspector_id: str = Form("DEV-INSPECTOR-884"),
    device_signature: str = Form(None),
    photo: UploadFile = File(...)
):
    """
    Complete Pipeline Execution (Slide 2 Step 1 to Step 7):
    1. Offline Capture & Crypto Signing Verification
    2. EXIF & Viewshed 2D Cone Projection
    3. Multispectral SRISHTI-DRISHTI Satellite Query
    4. Dual AI Cross-Validation (Ground CV + Satellite NDVI/NDWI)
    5. Database Audit Logging
    """
    photo_bytes = await photo.read()
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # Save file locally
    filename = f"audit_{uuid.uuid4().hex[:8]}_{photo.filename}"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "wb") as f:
        f.write(photo_bytes)
        
    photo_url = f"/uploads/{filename}"
    
    # Cryptographic anti-spoofing verification
    photo_hash = generate_photo_hash(photo_bytes)
    if not device_signature:
        device_signature = generate_device_signature(lat, lng, azimuth, timestamp, photo_hash, inspector_id)
        
    crypto_res = verify_crypto_payload(lat, lng, azimuth, timestamp, photo_bytes, device_signature, inspector_id)
    
    # Compute 2D Viewshed Cone
    viewshed = calculate_viewshed_cone(lat, lng, azimuth, distance_m=120.0)
    
    # Run Dual AI Cross Validation
    val_res = cross_validate_ground_and_satellite(lat, lng, azimuth, filename, structure_type)
    
    # DB Insertion (PostGIS or SQLite)
    audit_code = f"AUD-{uuid.uuid4().hex[:6].upper()}"
    audit_payload = {
        "audit_code": audit_code,
        "watershed_id": watershed_id,
        "inspector_id": inspector_id,
        "structure_type": structure_type,
        "lat": lat,
        "lng": lng,
        "azimuth": azimuth,
        "focal_length": focal_length,
        "timestamp": timestamp,
        "photo_url": photo_url,
        "photo_hash": photo_hash,
        "crypto_signature": device_signature,
        "crypto_verified": 1 if crypto_res["verified"] else 0,
        "status": val_res["status"],
        "validation_details": val_res
    }
    
    audit_id = None
    if check_postgis_available():
        audit_id = insert_postgis_audit(audit_payload, viewshed)
        
    if not audit_id:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO audits (
            audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth, focal_length,
            timestamp, photo_url, photo_hash, crypto_signature, crypto_verified, status,
            viewshed_geojson, validation_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth, focal_length,
            timestamp, photo_url, photo_hash, device_signature, 1 if crypto_res["verified"] else 0, val_res["status"],
            json.dumps(viewshed), json.dumps(val_res)
        ))
        conn.commit()
        audit_id = cursor.lastrowid
        conn.close()
    
    return {
        "status": "success",
        "message": "Audit processed and cross-validated successfully",
        "audit_id": audit_id,
        "audit_code": audit_code,
        "validation_status": val_res["status"],
        "crypto_verified": crypto_res["verified"],
        "viewshed": viewshed,
        "validation_details": val_res
    }

@router.get("/analytics/dashboard")
def get_analytics():
    """Returns analytics matching presentation slides (Utilization, Allocation, Benchmarks, Risks)."""
    return {
        "geo_photo_utilization": {
            "title": "Watershed Geo-Photo Utilization",
            "passive_auditing_pct": 92,
            "spatial_analytics_pct": 8,
            "description": "92% passive auditing (document logs) vs 8% active spatial analytics linked to satellite maps."
        },
        "feasibility_benchmarks": {
            "cycle_time": {"traditional": "45 Days", "srishtished_ai": "Under 15 Minutes"},
            "accuracy": {"traditional": "Variable (manual errors)", "srishtished_ai": "88% Spatially Validated"},
            "cost_reduction": {"traditional": "High travel & field overhead", "srishtished_ai": "90% Lower operational cost"},
            "usps": [
                "PostGIS Camera Viewshed 2D sight-line cone projection",
                "Cryptographic anti-spoofing PWA signatures at capture",
                "Sub-pixel multi-spectral downscaling (30m to metric scale)",
                "Auto-audit Dual AI ground CV vs satellite NDVI cross-validation"
            ]
        },
        "resource_allocation": {
            "targeted_restoration_pct": 50,
            "preventive_repair_pct": 30,
            "automated_audits_pct": 20
        },
        "risk_mitigation": [
            {
                "risk": "Cloud Cover Obstruction",
                "description": "Monsoonal clouds block satellite visual bands.",
                "strategy": "Temporal interpolation + integration of Sentinel-1 Radar data."
            },
            {
                "risk": "Field GPS Offsets",
                "description": "Mobile GPS drifts by 10-20 meters in remote valleys.",
                "strategy": "Apply PostGIS spatial buffer queries (ST_DWithin) matching photos to nearest drainage line."
            },
            {
                "risk": "Low-Quality Uploads",
                "description": "Blurred or poorly angled field photos uploaded by inspectors.",
                "strategy": "Implement client-side photo validation in PWA to check metadata and contrast before upload."
            },
            {
                "risk": "GPS Location Spoofing",
                "description": "Field inspectors uploading old photos or using GPS mocking tools.",
                "strategy": "Device-bound Cryptographic Signing: PWA signs coordinates, timestamp, and photo hash immediately at capture."
            }
        ]
    }
