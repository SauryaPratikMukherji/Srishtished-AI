import sqlite3
import json
import os
from .config import DB_PATH, DEMO_WATERSHEDS
from .viewshed import calculate_viewshed_cone
from .crypto_auth import generate_device_signature, generate_photo_hash
from .dual_ai_validator import cross_validate_ground_and_satellite

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Audits Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        audit_code TEXT UNIQUE,
        watershed_id TEXT,
        inspector_id TEXT,
        structure_type TEXT,
        lat REAL,
        lng REAL,
        azimuth REAL,
        focal_length REAL,
        timestamp TEXT,
        photo_url TEXT,
        photo_hash TEXT,
        crypto_signature TEXT,
        crypto_verified INTEGER,
        status TEXT,
        viewshed_geojson TEXT,
        validation_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    conn.close()

def seed_sample_audits():
    conn = get_db_connection()
    cursor = conn.cursor()

    sample_audits = [
        {
            "audit_code": "AUD-ANTP-001",
            "watershed_id": "WS-AP-ANTP-01",
            "inspector_id": "DEV-INSPECTOR-884",
            "structure_type": "Check Dam (Concrete)",
            "lat": 22.5726,
            "lng": 88.3639,
            "azimuth": 135.0,
            "focal_length": 28.0,
            "timestamp": "2026-08-28T10:15:00Z",
            "photo_url": "/static/sample_checkdam_1.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-ANTP-002",
            "watershed_id": "WS-AP-ANTP-01",
            "inspector_id": "DEV-INSPECTOR-884",
            "structure_type": "Contour Trench System",
            "lat": 22.5745,
            "lng": 88.3650,
            "azimuth": 45.0,
            "focal_length": 24.0,
            "timestamp": "2026-08-29T11:40:00Z",
            "photo_url": "/static/sample_trench.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-SOL-003",
            "watershed_id": "WS-MH-SOL-02",
            "inspector_id": "DEV-INSPECTOR-102",
            "structure_type": "Check Dam (Earthen)",
            "lat": 17.6620,
            "lng": 75.9080,
            "azimuth": 270.0,
            "focal_length": 35.0,
            "timestamp": "2026-08-30T14:20:00Z",
            "photo_url": "/static/sample_mismatch.jpg",
            "force_discrepancy": True
        },
        {
            "audit_code": "AUD-BUND-004",
            "watershed_id": "WS-MP-BUND-03",
            "inspector_id": "DEV-INSPECTOR-509",
            "structure_type": "Farm Pond Recharge Well",
            "lat": 25.4490,
            "lng": 78.5695,
            "azimuth": 180.0,
            "focal_length": 28.0,
            "timestamp": "2026-09-01T09:05:00Z",
            "photo_url": "/static/sample_pond.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-ANTP-005",
            "watershed_id": "WS-AP-ANTP-04",
            "inspector_id": "DEV-INSPECTOR-304",
            "structure_type": "Percolation Tank",
            "lat": 14.6819,
            "lng": 77.6006,
            "azimuth": 135.0,
            "focal_length": 28.0,
            "timestamp": "2026-09-02T11:20:00Z",
            "photo_url": "/static/sample_pond.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-ANTP-006",
            "watershed_id": "WS-AP-ANTP-04",
            "inspector_id": "DEV-INSPECTOR-304",
            "structure_type": "Check Dam (Masonry)",
            "lat": 14.6845,
            "lng": 77.5985,
            "azimuth": 220.0,
            "focal_length": 35.0,
            "timestamp": "2026-09-03T09:45:00Z",
            "photo_url": "/static/sample_checkdam_1.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-WAY-007",
            "watershed_id": "WS-KL-WAY-05",
            "inspector_id": "DEV-INSPECTOR-712",
            "structure_type": "Plantation Contour Trench",
            "lat": 11.6854,
            "lng": 76.1320,
            "azimuth": 90.0,
            "focal_length": 24.0,
            "timestamp": "2026-09-03T15:10:00Z",
            "photo_url": "/static/sample_review.jpg",
            "force_discrepancy": False
        },
        {
            "audit_code": "AUD-WAY-008",
            "watershed_id": "WS-KL-WAY-05",
            "inspector_id": "DEV-INSPECTOR-712",
            "structure_type": "Subsurface Dyke",
            "lat": 11.6880,
            "lng": 76.1350,
            "azimuth": 310.0,
            "focal_length": 28.0,
            "timestamp": "2026-09-04T12:00:00Z",
            "photo_url": "/static/sample_review.jpg",
            "force_discrepancy": False
        }
    ]

    for item in sample_audits:
        val_res = cross_validate_ground_and_satellite(
            item['lat'], item['lng'], item['azimuth'], item['photo_url'], item['structure_type'], item['force_discrepancy']
        )
        cursor.execute("SELECT COUNT(*) FROM audits WHERE audit_code = ?", (item['audit_code'],))
        if cursor.fetchone()[0] > 0:
            cursor.execute("UPDATE audits SET status = ?, validation_details = ? WHERE audit_code = ?", (val_res['status'], json.dumps(val_res), item['audit_code']))
            continue

        photo_bytes = f"dummy_photo_data_{item['audit_code']}".encode('utf-8')
        photo_hash = generate_photo_hash(photo_bytes)
        signature = generate_device_signature(
            item['lat'], item['lng'], item['azimuth'], item['timestamp'], photo_hash, item['inspector_id']
        )

        viewshed = calculate_viewshed_cone(
            item['lat'], item['lng'], item['azimuth'], distance_m=130.0
        )

        cursor.execute("""
        INSERT INTO audits (
            audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth, focal_length,
            timestamp, photo_url, photo_hash, crypto_signature, crypto_verified, status,
            viewshed_geojson, validation_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item['audit_code'], item['watershed_id'], item['inspector_id'], item['structure_type'],
            item['lat'], item['lng'], item['azimuth'], item['focal_length'], item['timestamp'],
            item['photo_url'], photo_hash, signature, 1, val_res['status'],
            json.dumps(viewshed), json.dumps(val_res)
        ))

    conn.commit()
    conn.close()

    # Seed PostGIS if active
    from .postgis_db import check_postgis_available, insert_postgis_audit, fetch_postgis_audits
    if check_postgis_available():
        pg_audits = fetch_postgis_audits() or []
        existing_pg_codes = {a['audit_code'] for a in pg_audits}
        for item in sample_audits:
            if item['audit_code'] in existing_pg_codes:
                continue
            photo_bytes = f"dummy_photo_data_{item['audit_code']}".encode('utf-8')
            photo_hash = generate_photo_hash(photo_bytes)
            signature = generate_device_signature(
                item['lat'], item['lng'], item['azimuth'], item['timestamp'], photo_hash, item['inspector_id']
            )
            viewshed = calculate_viewshed_cone(
                item['lat'], item['lng'], item['azimuth'], distance_m=130.0
            )
            val_res = cross_validate_ground_and_satellite(
                item['lat'], item['lng'], item['azimuth'], item['photo_url'], item['structure_type'], item['force_discrepancy']
            )
            payload = {
                "audit_code": item['audit_code'],
                "watershed_id": item['watershed_id'],
                "inspector_id": item['inspector_id'],
                "structure_type": item['structure_type'],
                "lat": item['lat'],
                "lng": item['lng'],
                "azimuth": item['azimuth'],
                "focal_length": item['focal_length'],
                "timestamp": item['timestamp'],
                "photo_url": item['photo_url'],
                "photo_hash": photo_hash,
                "crypto_signature": signature,
                "crypto_verified": 1,
                "status": val_res['status'],
                "validation_details": val_res
            }
            insert_postgis_audit(payload, viewshed)
