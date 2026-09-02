import random
from .viewshed import get_cone_center_target
from .satellite_service import query_srishti_drishti_bands

def run_ground_computer_vision(photo_filename: str, structure_claimed: str = "check_dam") -> dict:
    """
    Simulates Computer Vision analysis on field photograph:
    - Object Detection & Segmentation (Check Dam, Trench, Farm Pond, Water Body)
    - Structural Integrity score & Water retention level
    """
    # Deterministic simulation based on filename/claimed structure
    fn_lower = photo_filename.lower()
    
    if "fake" in fn_lower or "mismatch" in fn_lower or "spoof" in fn_lower:
        cv_label = "Water Retention Present"
        confidence = 0.94
        water_level_cv = 0.85
    elif "dry" in fn_lower:
        cv_label = "Check Dam - Dry / Silted"
        confidence = 0.89
        water_level_cv = 0.05
    else:
        cv_label = "Check Dam - Verified Construction"
        confidence = 0.92
        water_level_cv = 0.60

    return {
        "ground_cv_label": cv_label,
        "confidence": confidence,
        "water_level_detected": water_level_cv,
        "features_detected": ["concrete_wall", "drainage_apron", "water_reflectance"] if water_level_cv > 0.2 else ["earthen_embankment"]
    }

def cross_validate_ground_and_satellite(lat: float, lng: float, azimuth: float, photo_filename: str, structure_claimed: str = "check_dam", force_discrepancy: bool = False) -> dict:
    """
    Dual-AI Cross Validation Engine (Slide 2 Step 6):
    Fuses Ground Computer Vision with Remote Sensing Satellite Indices (NDVI / NDWI).
    """
    # 1. Target coordinate along viewshed cone sightline
    target_lat, target_lng = get_cone_center_target(lat, lng, azimuth)
    
    # 2. Query Satellite Bands
    satellite_data = query_srishti_drishti_bands(target_lat, target_lng)
    ndvi = satellite_data["indices"]["NDVI"]
    ndwi = satellite_data["indices"]["NDWI"]
    sat_water = satellite_data["water_detected"]
    
    # 3. Ground Computer Vision
    ground_cv = run_ground_computer_vision(photo_filename, structure_claimed)
    
    # 4. Cross-Validation Decision Matrix
    is_discrepancy = False
    reasons = []
    
    if force_discrepancy or "mismatch" in photo_filename.lower() or "spoof" in photo_filename.lower():
        is_discrepancy = True
        reasons.append("Ground CV detects full water reservoir, but satellite NDWI (-0.18) indicates dry arid soil in viewshed cone.")
        reasons.append("Satellite sub-pixel multi-spectral downscaling failed to match claimed 15m check dam footprint.")
    elif ground_cv["water_level_detected"] > 0.4 and not sat_water and ndwi < -0.10:
        is_discrepancy = True
        reasons.append(f"Ground CV detected water retention ({ground_cv['water_level_detected']*100:.0f}%), but satellite NDWI ({ndwi}) shows no surface water.")
    else:
        reasons.append("Ground CV structural detection matches 30m satellite multi-spectral signatures (NDVI/NDWI alignment confirmed).")
        reasons.append("Sight-line camera cone projection aligns with designated watershed drainage vector.")

    status = "SPATIAL_DISCREPANCY_FLAG" if is_discrepancy else "APPROVED"
    
    return {
        "status": status,
        "is_discrepancy": is_discrepancy,
        "ground_cv": ground_cv,
        "satellite_data": satellite_data,
        "target_coords": {"lat": target_lat, "lng": target_lng},
        "reasons": reasons,
        "sub_pixel_enhancement": {
            "satellite_native_resolution": "30m",
            "ground_fused_effective_resolution": "2.5m",
            "boundary_match_confidence": 0.91 if not is_discrepancy else 0.42
        }
    }
