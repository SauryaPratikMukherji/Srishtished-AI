import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
DB_PATH = BASE_DIR / "srishtished.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Cryptographic signing secret & Satellite API Keys
SECRET_SIGNING_KEY = "srishtished_crypto_secret_2026_sih"
PLANET_API_KEY = os.getenv("PLANET_API_KEY", "PLAK4c62f9c9b6884c3dbc4709dcae59da67")

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
        "district": "Solapur District",
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
    },
    {
        "id": "WS-AP-ANTP-04",
        "project_code": "Project #D4012",
        "name": "Project #D4012 - Village Anantapur Percolation Basin",
        "village": "Village Anantapur",
        "district": "Anantapur District",
        "state": "Andhra Pradesh",
        "center": [14.6819, 77.6006],
        "bounds": [[14.65, 77.55], [14.72, 77.65]],
        "claimed_structure": "Percolation Tank",
        "avg_ndvi": 0.38,
        "avg_ndwi": 0.08,
        "structures_count": 51,
        "status": "VERIFIED"
    },
    {
        "id": "WS-KL-WAY-05",
        "project_code": "Project #E5077",
        "name": "Project #E5077 - Village Wayanad Contour Trench",
        "village": "Village Wayanad",
        "district": "Wayanad Sector",
        "state": "Kerala",
        "center": [11.6854, 76.1320],
        "bounds": [[11.65, 76.10], [11.72, 76.16]],
        "claimed_structure": "Plantation Contour Trench",
        "avg_ndvi": 0.62,
        "avg_ndwi": 0.24,
        "structures_count": 29,
        "status": "NEEDS_REVIEW"
    }
]


