import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
DB_PATH = BASE_DIR / "srishtished.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Cryptographic signing secret
SECRET_SIGNING_KEY = "srishtished_crypto_secret_2026_sih"

# Project Dashboard Counters (Matching prompt specification)
DEMO_PROJECT_STATS = {
    "total_projects": 125,
    "verified": 98,
    "needs_review": 17,
    "flagged": 10
}

# Demo Watershed & Project Locations
DEMO_WATERSHEDS = [
    {
        "id": "WS-AP-ANTP-01",
        "project_code": "Project #A1023",
        "name": "Project #A1023 - Village ABC Check Dam",
        "village": "Village ABC",
        "district": "XYZ District",
        "state": "Andhra Pradesh",
        "center": [22.5726, 88.3639],
        "bounds": [[22.54, 88.32], [22.60, 88.40]],
        "claimed_structure": "Check Dam (Concrete)",
        "avg_ndvi": 0.42,
        "avg_ndwi": 0.18,
        "structures_count": 42,
        "status": "VERIFIED"
    },
    {
        "id": "WS-MH-SOL-02",
        "project_code": "Project #B2045",
        "name": "Project #B2045 - Village Rampur Farm Pond",
        "village": "Village Rampur",
        "district": "Solapur",
        "state": "Maharashtra",
        "center": [17.6599, 75.9064],
        "bounds": [[17.62, 75.85], [17.70, 75.95]],
        "claimed_structure": "Farm Pond Recharge Well",
        "avg_ndvi": 0.45,
        "avg_ndwi": 0.12,
        "structures_count": 65,
        "status": "VERIFIED"
    },
    {
        "id": "WS-MP-BUND-03",
        "project_code": "Project #C3089",
        "name": "Project #C3089 - Village Devgarh Earthen Dam",
        "village": "Village Devgarh",
        "district": "Jhansi / Bundelkhand",
        "state": "Madhya Pradesh",
        "center": [25.4484, 78.5685],
        "bounds": [[25.40, 78.50], [25.50, 78.62]],
        "claimed_structure": "Check Dam (Earthen)",
        "avg_ndvi": 0.18,
        "avg_ndwi": -0.18,
        "structures_count": 38,
        "status": "SPATIAL_DISCREPANCY_FLAG"
    }
]

