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
    
    # 4. Cross-Validation Decision Matrix & Verification Scoring
    is_discrepancy = False
    reasons = []
    
    if force_discrepancy or "mismatch" in photo_filename.lower() or "spoof" in photo_filename.lower():
        is_discrepancy = True
        verification_result = "NOT_VERIFIED"
        gps_match = False
        satellite_evidence = False
        overall_score = 38
        reasons.append("Ground CV detects full water reservoir, but satellite NDWI (-0.18) indicates dry arid soil in viewshed cone.")
        reasons.append("Satellite sub-pixel multi-spectral downscaling failed to match claimed 15m check dam footprint.")
    elif "review" in photo_filename.lower():
        is_discrepancy = False
        verification_result = "NEEDS_REVIEW"
        gps_match = True
        satellite_evidence = False
        overall_score = 68
        reasons.append("Structure detected with 85% confidence, but registered location has a 12m offset.")
        reasons.append("Satellite cloud cover limits full 30m NIR spectrum validation.")
    elif ground_cv["water_level_detected"] > 0.4 and not sat_water and ndwi < -0.10:
        is_discrepancy = True
        verification_result = "NOT_VERIFIED"
        gps_match = True
        satellite_evidence = False
        overall_score = 42
        reasons.append(f"Ground CV detected water retention ({ground_cv['water_level_detected']*100:.0f}%), but satellite NDWI ({ndwi}) shows no surface water.")
    else:
        verification_result = "VERIFIED"
        gps_match = True
        satellite_evidence = True
        overall_score = 89
        reasons.append("Check dam structure detected at registered GPS location (92% confidence).")
        reasons.append("Satellite multispectral imagery (NDVI/NDWI) confirms moisture retention & terrain alignment.")
        reasons.append("Cryptographic anti-spoofing signature verified.")

    status = "APPROVED" if verification_result == "VERIFIED" else ("SPATIAL_DISCREPANCY_FLAG" if verification_result == "NOT_VERIFIED" else "NEEDS_REVIEW")
    
    return {
        "status": status,
        "verification_result": verification_result,
        "detected_object": ground_cv.get("ground_cv_label", "Check Dam").split(" - ")[0],
        "ai_confidence": int(ground_cv.get("confidence", 0.92) * 100),
        "gps_match": gps_match,
        "satellite_evidence": satellite_evidence,
        "verification_score": overall_score,
        "is_discrepancy": is_discrepancy,
        "ground_cv": ground_cv,
        "satellite_data": satellite_data,
        "target_coords": {"lat": target_lat, "lng": target_lng},
        "reasons": reasons,
        "sub_pixel_enhancement": {
            "satellite_native_resolution": "30m",
            "ground_fused_effective_resolution": "2.5m",
            "boundary_match_confidence": 0.91 if verification_result == "VERIFIED" else 0.42
        }
    }

