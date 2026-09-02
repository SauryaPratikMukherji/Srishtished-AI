import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
DB_PATH = BASE_DIR / "srishtished.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Cryptographic signing secret
SECRET_SIGNING_KEY = "srishtished_crypto_secret_2026_sih"

# Demo Watershed Regions in India
DEMO_WATERSHEDS = [
    {
        "id": "WS-AP-ANTP-01",
        "name": "Ananthapur Drought Mitigation Zone",
        "district": "Anantapur",
        "state": "Andhra Pradesh",
        "center": [14.6819, 77.6006],
        "bounds": [[14.65, 77.55], [14.72, 77.65]],
        "avg_ndvi": 0.28,
        "avg_ndwi": -0.15,
        "structures_count": 42
    },
    {
        "id": "WS-MH-SOL-02",
        "name": "Solapur Watershed Restoration Sector B",
        "district": "Solapur",
        "state": "Maharashtra",
        "center": [17.6599, 75.9064],
        "bounds": [[17.62, 75.85], [17.70, 75.95]],
        "avg_ndvi": 0.45,
        "avg_ndwi": 0.12,
        "structures_count": 65
    },
    {
        "id": "WS-MP-BUND-03",
        "name": "Bundelkhand Recharge Basin 4",
        "district": "Jhansi",
        "state": "Madhya Pradesh / UP",
        "center": [25.4484, 78.5685],
        "bounds": [[25.40, 78.50], [25.50, 78.62]],
        "avg_ndvi": 0.34,
        "avg_ndwi": -0.05,
        "structures_count": 38
    }
]
