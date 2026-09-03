import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from .config import DB_PATH, DEMO_WATERSHEDS

# PostGIS Connection Credentials from environment or defaults
POSTGIS_HOST = os.getenv("POSTGIS_HOST", "localhost")
POSTGIS_PORT = int(os.getenv("POSTGIS_PORT", "5432"))
POSTGIS_DB = os.getenv("POSTGIS_DB", "srishtished_db")
POSTGIS_USER = os.getenv("POSTGIS_USER", "postgres")
POSTGIS_PASSWORD = os.getenv("POSTGIS_PASSWORD", "1234+-Abcd")
DATABASE_URL = os.getenv("DATABASE_URL", None)

def get_postgis_connection():
    """Establishes connection to PostGIS PostgreSQL database."""
    try:
        if DATABASE_URL:
            conn = psycopg2.connect(DATABASE_URL)
        else:
            conn = psycopg2.connect(
                host=POSTGIS_HOST,
                port=POSTGIS_PORT,
                dbname=POSTGIS_DB,
                user=POSTGIS_USER,
                password=POSTGIS_PASSWORD,
                connect_timeout=3
            )
        return conn
    except Exception as e:
        # Returns None if local PostGIS instance is not currently active
        return None

def check_postgis_available() -> bool:
    """Verifies whether PostGIS PostgreSQL extension is connected and active."""
    conn = get_postgis_connection()
    if conn is None:
        return False
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT PostGIS_Full_Version();")
        res = cursor.fetchone()
        conn.close()
        return res is not None
    except Exception:
        if conn: conn.close()
        return False

def init_postgis_tables():
    """Initializes PostGIS tables and spatial GiST indexes if database is connected."""
    conn = get_postgis_connection()
    if not conn:
        print("[PostGIS] Connection offline. Falling back to local spatial engine.")
        return False
        
    try:
        cursor = conn.cursor()
        # Enable PostGIS extension
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        
        # Audits table with GEOMETRY(Polygon, 4326)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS audits (
            id SERIAL PRIMARY KEY,
            audit_code VARCHAR(50) UNIQUE NOT NULL,
            watershed_id VARCHAR(50) NOT NULL,
            inspector_id VARCHAR(100) NOT NULL,
            structure_type VARCHAR(100) NOT NULL,
            lat DOUBLE PRECISION NOT NULL,
            lng DOUBLE PRECISION NOT NULL,
            azimuth DOUBLE PRECISION NOT NULL,
            focal_length DOUBLE PRECISION NOT NULL,
            timestamp VARCHAR(50) NOT NULL,
            photo_url TEXT NOT NULL,
            photo_hash VARCHAR(64) NOT NULL,
            crypto_signature TEXT NOT NULL,
            crypto_verified INTEGER DEFAULT 1,
            status VARCHAR(50) NOT NULL,
            viewshed_geom GEOMETRY(Polygon, 4326),
            validation_details JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_audits_viewshed_geom ON audits USING GIST (viewshed_geom);
        """)
        conn.commit()
        conn.close()
        print("[PostGIS] Spatial database initialized successfully with PostGIS extension.")
        return True
    except Exception as e:
        print(f"[PostGIS] Initialization warning: {e}")
        if conn: conn.close()
        return False

def insert_postgis_audit(audit_data: dict, geojson_polygon: dict):
    """Inserts field audit using PostGIS ST_GeomFromGeoJSON spatial function."""
    conn = get_postgis_connection()
    if not conn:
        return False
        
    try:
        cursor = conn.cursor()
        geojson_str = json.dumps(geojson_polygon)
        
        cursor.execute("""
        INSERT INTO audits (
            audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth, focal_length,
            timestamp, photo_url, photo_hash, crypto_signature, crypto_verified, status,
            viewshed_geom, validation_details
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
            ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326), %s
        ) RETURNING id;
        """, (
            audit_data['audit_code'], audit_data['watershed_id'], audit_data['inspector_id'],
            audit_data['structure_type'], audit_data['lat'], audit_data['lng'], audit_data['azimuth'],
            audit_data['focal_length'], audit_data['timestamp'], audit_data['photo_url'],
            audit_data['photo_hash'], audit_data['crypto_signature'], audit_data['crypto_verified'],
            audit_data['status'], geojson_str, json.dumps(audit_data['validation_details'])
        ))
        
        inserted_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return inserted_id
    except Exception as e:
        print(f"[PostGIS] Error inserting audit: {e}")
        if conn: conn.close()
        return False

def fetch_postgis_audits(watershed_id: str = None):
    """Fetches audits using PostGIS ST_AsGeoJSON spatial query function."""
    conn = get_postgis_connection()
    if not conn:
        return None
        
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        if watershed_id:
            cursor.execute("""
            SELECT id, audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth,
                   focal_length, timestamp, photo_url, photo_hash, crypto_signature, crypto_verified,
                   status, ST_AsGeoJSON(viewshed_geom) AS viewshed_geojson, validation_details
            FROM audits WHERE watershed_id = %s ORDER BY created_at DESC;
            """, (watershed_id,))
        else:
            cursor.execute("""
            SELECT id, audit_code, watershed_id, inspector_id, structure_type, lat, lng, azimuth,
                   focal_length, timestamp, photo_url, photo_hash, crypto_signature, crypto_verified,
                   status, ST_AsGeoJSON(viewshed_geom) AS viewshed_geojson, validation_details
            FROM audits ORDER BY created_at DESC;
            """)
            
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for r in rows:
            item = dict(r)
            item['viewshed_geojson'] = json.loads(item['viewshed_geojson']) if item['viewshed_geojson'] else None
            results.append(item)
        return results
    except Exception as e:
        print(f"[PostGIS] Error fetching audits: {e}")
        if conn: conn.close()
        return None
