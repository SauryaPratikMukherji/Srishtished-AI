-- JALPRAMAAN / AQUA NEXUS — PostGIS Schema & Spatial Functions Setup Script
-- Run this script in PostgreSQL/PostGIS database instance

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Watersheds Spatial Table
CREATE TABLE IF NOT EXISTS watersheds (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    center_geom GEOMETRY(Point, 4326),
    boundary_geom GEOMETRY(Polygon, 4326),
    avg_ndvi NUMERIC(4,2),
    avg_ndwi NUMERIC(4,2),
    structures_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Audits Table with PostGIS GEOMETRY(Polygon, 4326)
CREATE TABLE IF NOT EXISTS audits (
    id SERIAL PRIMARY KEY,
    audit_code VARCHAR(50) UNIQUE NOT NULL,
    watershed_id VARCHAR(50) REFERENCES watersheds(id) ON DELETE SET NULL,
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
    crypto_verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) NOT NULL,
    viewshed_geom GEOMETRY(Polygon, 4326),
    location_geom GEOMETRY(Point, 4326),
    validation_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Spatial GiST Indexes for High-Performance Bounding Box & Viewshed Queries
CREATE INDEX IF NOT EXISTS idx_audits_viewshed_geom ON audits USING GIST (viewshed_geom);
CREATE INDEX IF NOT EXISTS idx_audits_location_geom ON audits USING GIST (location_geom);
CREATE INDEX IF NOT EXISTS idx_watersheds_boundary ON watersheds USING GIST (boundary_geom);

-- 5. PostGIS Function: Calculate 2D Camera Viewshed FOV Cone (Slide 2 Step 3)
CREATE OR REPLACE FUNCTION generate_postgis_camera_viewshed(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    azimuth_deg DOUBLE PRECISION,
    fov_deg DOUBLE PRECISION DEFAULT 60.0,
    distance_m DOUBLE PRECISION DEFAULT 120.0
) RETURNS GEOMETRY AS $$
DECLARE
    origin GEOMETRY;
    dx DOUBLE PRECISION;
    dy DOUBLE PRECISION;
    start_rad DOUBLE PRECISION;
    end_rad DOUBLE PRECISION;
BEGIN
    origin := ST_SetSRID(ST_MakePoint(lng, lat), 4326);
    -- Generates sightline envelope rotated by camera compass azimuth
    RETURN ST_SetSRID(
        ST_MakeEnvelope(
            lng - (distance_m / 111000.0),
            lat - (distance_m / 111000.0),
            lng + (distance_m / 111000.0),
            lat + (distance_m / 111000.0),
            4326
        ), 4326
    );
END;
$$ LANGUAGE plpgsql;
