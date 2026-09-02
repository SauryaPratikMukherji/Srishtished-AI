import hashlib
import hmac
import time
from .config import SECRET_SIGNING_KEY

def generate_photo_hash(photo_bytes: bytes) -> str:
    """Computes SHA-256 hash of image file contents."""
    return hashlib.sha256(photo_bytes).hexdigest()

def generate_device_signature(lat: float, lng: float, azimuth: float, timestamp: str, photo_hash: str, device_id: str = "DEV-INSPECTOR-884") -> str:
    """Generates cryptographic HMAC-SHA256 signature for field metadata payload."""
    payload_str = f"{lat:.5f}:{lng:.5f}:{azimuth:.1f}:{timestamp}:{photo_hash}:{device_id}"
    signature = hmac.new(
        SECRET_SIGNING_KEY.encode('utf-8'),
        payload_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature

def verify_crypto_payload(lat: float, lng: float, azimuth: float, timestamp: str, photo_bytes: bytes, signature: str, device_id: str = "DEV-INSPECTOR-884") -> dict:
    """
    Verifies field submission against anti-spoofing rules:
    1. Computes photo SHA-256 hash
    2. Recalculates expected HMAC signature
    3. Checks for signature validity
    """
    photo_hash = generate_photo_hash(photo_bytes)
    expected_sig = generate_device_signature(lat, lng, azimuth, timestamp, photo_hash, device_id)
    
    is_valid = hmac.compare_digest(expected_sig, signature)
    
    return {
        "verified": is_valid,
        "photo_hash": photo_hash,
        "signature": signature,
        "device_id": device_id,
        "status_code": "CRYPTO_OK" if is_valid else "INVALID_SIGNATURE_TAMPERED"
    }
