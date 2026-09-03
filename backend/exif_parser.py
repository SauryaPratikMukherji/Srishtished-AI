from PIL import Image, ExifTags
import io

def _convert_to_degrees(value):
    """Convert EXIF GPS rational coordinates to decimal degrees."""
    try:
        d = float(value[0])
        m = float(value[1])
        s = float(value[2])
        return d + (m / 60.0) + (s / 3600.0)
    except Exception:
        return None

def extract_real_photo_exif(photo_bytes: bytes) -> dict:
    """
    Extracts authentic EXIF metadata (GPS coordinates, camera heading, timestamp, focal length)
    from uploaded field JPEG/PNG files.
    """
    exif_data = {
        "has_real_exif": False,
        "lat": None,
        "lng": None,
        "timestamp": None,
        "camera_model": None,
        "focal_length": None
    }
    
    try:
        img = Image.open(io.BytesIO(photo_bytes))
        raw_exif = img._getexif()
        
        if not raw_exif:
            return exif_data
            
        exif = {}
        for tag_id, value in raw_exif.items():
            tag_name = ExifTags.TAGS.get(tag_id, tag_id)
            exif[tag_name] = value
            
        # Camera model
        if "Model" in exif:
            exif_data["camera_model"] = str(exif["Model"]).strip()
        elif "Make" in exif:
            exif_data["camera_model"] = str(exif["Make"]).strip()
            
        # Timestamp
        if "DateTimeOriginal" in exif:
            exif_data["timestamp"] = str(exif["DateTimeOriginal"])
        elif "DateTime" in exif:
            exif_data["timestamp"] = str(exif["DateTime"])
            
        # Focal length
        if "FocalLength" in exif:
            try:
                exif_data["focal_length"] = float(exif["FocalLength"])
            except Exception:
                pass

        # GPS Info extraction
        if "GPSInfo" in exif:
            gps_info = {}
            for key in exif["GPSInfo"].keys():
                sub_tag = ExifTags.GPSTAGS.get(key, key)
                gps_info[sub_tag] = exif["GPSInfo"][key]
                
            if "GPSLatitude" in gps_info and "GPSLatitudeRef" in gps_info:
                lat = _convert_to_degrees(gps_info["GPSLatitude"])
                if lat is not None:
                    if gps_info["GPSLatitudeRef"] != "N":
                        lat = -lat
                    exif_data["lat"] = round(lat, 6)
                    
            if "GPSLongitude" in gps_info and "GPSLongitudeRef" in gps_info:
                lng = _convert_to_degrees(gps_info["GPSLongitude"])
                if lng is not None:
                    if gps_info["GPSLongitudeRef"] != "E":
                        lng = -lng
                    exif_data["lng"] = round(lng, 6)

        if exif_data["lat"] is not None and exif_data["lng"] is not None:
            exif_data["has_real_exif"] = True

    except Exception as e:
        print("EXIF extraction notice:", e)

    return exif_data
