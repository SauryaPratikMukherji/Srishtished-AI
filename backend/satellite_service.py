import math
import random

def query_srishti_drishti_bands(lat: float, lng: float) -> dict:
    """
    Simulates querying ISRO Bhuvan SRISHTI-DRISHTI WCS API for 30m multispectral satellite band values.
    Uses deterministic spatial noise functions based on coordinates to return realistic satellite indices.
    """
    # Deterministic spatial seed based on coordinates
    seed = int((lat * 1000) + (lng * 1000))
    random.seed(seed)
    
    # Generate realistic reflectance values
    nir = round(random.uniform(0.25, 0.65), 3)
    red = round(random.uniform(0.08, 0.35), 3)
    green = round(random.uniform(0.10, 0.40), 3)
    swir = round(random.uniform(0.12, 0.45), 3)
    
    # Calculate Remote Sensing Indices
    ndvi = round((nir - red) / (nir + red + 1e-6), 3)
    ndwi = round((green - nir) / (green + nir + 1e-6), 3)
    
    # Soil Moisture Index (SMI approximation)
    smi = round(1.0 - (swir / (nir + 1e-6)), 3)
    smi = max(0.0, min(1.0, smi))
    
    return {
        "source": "ISRO_BHUVAN_SRISHTI_DRISHTI_WCS",
        "spatial_resolution": "30m",
        "bands": {
            "NIR": nir,
            "Red": red,
            "Green": green,
            "SWIR": swir
        },
        "indices": {
            "NDVI": ndvi,
            "NDWI": ndwi,
            "SMI": smi
        },
        "water_detected": ndwi > 0.05,
        "dense_vegetation": ndvi > 0.35
    }

def generate_satellite_grid_overlay(bounds: list, grid_size: int = 6) -> dict:
    """
    Generates GeoJSON grid squares across watershed bounds for interactive satellite map layers (NDVI/NDWI heatmaps).
    """
    min_lat, min_lng = bounds[0]
    max_lat, max_lng = bounds[1]
    
    lat_step = (max_lat - min_lat) / grid_size
    lng_step = (max_lng - min_lng) / grid_size
    
    features = []
    
    for i in range(grid_size):
        for j in range(grid_size):
            cell_min_lat = min_lat + i * lat_step
            cell_max_lat = cell_min_lat + lat_step
            cell_min_lng = min_lng + j * lng_step
            cell_max_lng = cell_min_lng + lng_step
            
            center_lat = (cell_min_lat + cell_max_lat) / 2.0
            center_lng = (cell_min_lng + cell_max_lng) / 2.0
            
            bands_data = query_srishti_drishti_bands(center_lat, center_lng)
            
            feature = {
                "type": "Feature",
                "properties": {
                    "grid_id": f"cell_{i}_{j}",
                    "ndvi": bands_data["indices"]["NDVI"],
                    "ndwi": bands_data["indices"]["NDWI"],
                    "smi": bands_data["indices"]["SMI"],
                    "water_detected": bands_data["water_detected"]
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [round(cell_min_lng, 6), round(cell_min_lat, 6)],
                        [round(cell_max_lng, 6), round(cell_min_lat, 6)],
                        [round(cell_max_lng, 6), round(cell_max_lat, 6)],
                        [round(cell_min_lng, 6), round(cell_max_lat, 6)],
                        [round(cell_min_lng, 6), round(cell_min_lat, 6)]
                    ]]
                }
            }
            features.append(feature)
            
    return {
        "type": "FeatureCollection",
        "features": features
    }
