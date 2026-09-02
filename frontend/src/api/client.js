const API_BASE_URL = "http://localhost:8000/api";

export async function fetchWatersheds() {
  try {
    const res = await fetch(`${API_BASE_URL}/watersheds`);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return data.watersheds;
  } catch (err) {
    console.warn("Using offline watershed fallback data:", err);
    return [
      {
        id: "WS-AP-ANTP-01",
        name: "Ananthapur Drought Mitigation Zone",
        district: "Anantapur",
        state: "Andhra Pradesh",
        center: [14.6819, 77.6006],
        bounds: [[14.65, 77.55], [14.72, 77.65]],
        avg_ndvi: 0.28,
        avg_ndwi: -0.15,
        structures_count: 42
      },
      {
        id: "WS-MH-SOL-02",
        name: "Solapur Watershed Restoration Sector B",
        district: "Solapur",
        state: "Maharashtra",
        center: [17.6599, 75.9064],
        bounds: [[17.62, 75.85], [17.70, 75.95]],
        avg_ndvi: 0.45,
        avg_ndwi: 0.12,
        structures_count: 65
      },
      {
        id: "WS-MP-BUND-03",
        name: "Bundelkhand Recharge Basin 4",
        district: "Jhansi",
        state: "Madhya Pradesh / UP",
        center: [25.4484, 78.5685],
        bounds: [[25.40, 78.50], [25.50, 78.62]],
        avg_ndvi: 0.34,
        avg_ndwi: -0.05,
        structures_count: 38
      }
    ];
  }
}

export async function fetchAudits(watershedId = null) {
  try {
    const url = watershedId ? `${API_BASE_URL}/audits?watershed_id=${watershedId}` : `${API_BASE_URL}/audits`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return data.audits;
  } catch (err) {
    console.warn("Using offline audit fallback data:", err);
    return [
      {
        id: 1,
        audit_code: "AUD-ANTP-001",
        watershed_id: "WS-AP-ANTP-01",
        inspector_id: "DEV-INSPECTOR-884",
        structure_type: "Check Dam (Concrete)",
        lat: 14.6825,
        lng: 77.6012,
        azimuth: 135.0,
        focal_length: 28.0,
        timestamp: "2026-08-28T10:15:00Z",
        photo_url: "http://localhost:8000/static/sample_checkdam_1.jpg",
        crypto_verified: 1,
        status: "APPROVED",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [[[77.6012, 14.6825], [77.6022, 14.6815], [77.6028, 14.6820], [77.6012, 14.6825]]]
        },
        validation_details: {
          status: "APPROVED",
          reasons: ["Ground CV structural detection matches satellite spectral signatures.", "Sight-line camera cone projection aligns with drainage vector."]
        }
      },
      {
        id: 2,
        audit_code: "AUD-SOL-003",
        watershed_id: "WS-MH-SOL-02",
        inspector_id: "DEV-INSPECTOR-102",
        structure_type: "Check Dam (Earthen)",
        lat: 17.6620,
        lng: 75.9080,
        azimuth: 270.0,
        focal_length: 35.0,
        timestamp: "2026-08-30T14:20:00Z",
        photo_url: "http://localhost:8000/static/sample_mismatch.jpg",
        crypto_verified: 1,
        status: "SPATIAL_DISCREPANCY_FLAG",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [[[75.9080, 17.6620], [75.9068, 17.6620], [75.9068, 17.6628], [75.9080, 17.6620]]]
        },
        validation_details: {
          status: "SPATIAL_DISCREPANCY_FLAG",
          reasons: ["Ground CV detects full water reservoir, but satellite NDWI (-0.18) indicates dry arid soil in viewshed cone."]
        }
      }
    ];
  }
}

export async function fetchSatelliteLayer(watershedId) {
  try {
    const res = await fetch(`${API_BASE_URL}/watershed/${watershedId}/satellite-layer`);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return data.grid;
  } catch (err) {
    console.warn("Using offline satellite grid layer:", err);
    return null;
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/dashboard`);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function submitAuditForm(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/submit`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Submission failed");
    return await res.json();
  } catch (err) {
    console.error("Audit submission error:", err);
    throw err;
  }
}
