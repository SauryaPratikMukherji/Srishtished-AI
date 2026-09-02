import math

def calculate_viewshed_cone(lat: float, lng: float, azimuth_deg: float, fov_deg: float = 60.0, distance_m: float = 120.0, num_arc_points: int = 10) -> dict:
    """
    Calculates a 2D Field-of-View (FOV) camera view cone wedge polygon centered at (lat, lng).
    
    :param lat: Latitude in degrees
    :param lng: Longitude in degrees
    :param azimuth_deg: Compass bearing/heading in degrees (0 = North, 90 = East, 180 = South, 270 = West)
    :param fov_deg: Horizontal Field-of-View angle in degrees (default 60 deg)
    :param distance_m: View cone radius distance in meters (default 120m)
    :param num_arc_points: Number of points to sample along the outer arc
    :return: GeoJSON Polygon geometry dict
    """
    # Degree conversions for lat/lng distance approximation
    lat_rad = math.radians(lat)
    meters_per_deg_lat = 111000.0
    meters_per_deg_lng = 111000.0 * math.cos(lat_rad)
    
    start_angle = azimuth_deg - (fov_deg / 2.0)
    end_angle = azimuth_deg + (fov_deg / 2.0)
    
    coordinates = []
    # Origin point [lng, lat] (GeoJSON standard ordering is [longitude, latitude])
    origin = [round(lng, 6), round(lat, 6)]
    coordinates.append(origin)
    
    # Calculate points along arc
    angle_step = (end_angle - start_angle) / max(num_arc_points - 1, 1)
    for i in range(num_arc_points):
        curr_angle_deg = start_angle + i * angle_step
        curr_angle_rad = math.radians(curr_angle_deg)
        
        # In navigation bearing: 0 deg = North (y-positive), 90 deg = East (x-positive)
        dx = distance_m * math.sin(curr_angle_rad)
        dy = distance_m * math.cos(curr_angle_rad)
        
        pt_lat = lat + (dy / meters_per_deg_lat)
        pt_lng = lng + (dx / meters_per_deg_lng)
        
        coordinates.append([round(pt_lng, 6), round(pt_lat, 6)])
        
    # Close polygon back to origin
    coordinates.append(origin)
    
    return {
        "type": "Polygon",
        "coordinates": [coordinates]
    }

def get_cone_center_target(lat: float, lng: float, azimuth_deg: float, distance_m: float = 60.0) -> tuple[float, float]:
    """Calculates the target midpoint along the sight line for spectral sampling."""
    lat_rad = math.radians(lat)
    meters_per_deg_lat = 111000.0
    meters_per_deg_lng = 111000.0 * math.cos(lat_rad)
    
    rad = math.radians(azimuth_deg)
    dx = distance_m * math.sin(rad)
    dy = distance_m * math.cos(rad)
    
    target_lat = lat + (dy / meters_per_deg_lat)
    target_lng = lng + (dx / meters_per_deg_lng)
    return round(target_lat, 6), round(target_lng, 6)
