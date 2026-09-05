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
        project_code: "Project #A1023",
        name: "Project #A1023 - Village ABC Check Dam",
        village: "Village ABC",
        district: "XYZ District",
        state: "Andhra Pradesh",
        center: [22.5726, 88.3639],
        bounds: [[22.54, 88.32], [22.60, 88.40]],
        avg_ndvi: 0.42,
        avg_ndwi: 0.18,
        structures_count: 42,
        status: "VERIFIED"
      },
      {
        id: "WS-MH-SOL-02",
        project_code: "Project #B2045",
        name: "Project #B2045 - Village Rampur Farm Pond",
        village: "Village Rampur",
        district: "Solapur District",
        state: "Maharashtra",
        center: [17.6599, 75.9064],
        bounds: [[17.62, 75.85], [17.70, 75.95]],
        avg_ndvi: 0.45,
        avg_ndwi: 0.12,
        structures_count: 65,
        status: "SPATIAL_DISCREPANCY_FLAG"
      },
      {
        id: "WS-MP-BUND-03",
        project_code: "Project #C3089",
        name: "Project #C3089 - Village Devgarh Earthen Dam",
        village: "Village Devgarh",
        district: "Jhansi / Bundelkhand",
        state: "Madhya Pradesh",
        center: [25.4484, 78.5685],
        bounds: [[25.40, 78.50], [25.50, 78.62]],
        avg_ndvi: 0.18,
        avg_ndwi: -0.18,
        structures_count: 38,
        status: "SPATIAL_DISCREPANCY_FLAG"
      },
      {
        id: "WS-AP-ANTP-04",
        project_code: "Project #D4012",
        name: "Project #D4012 - Village Anantapur Percolation Basin",
        village: "Village Anantapur",
        district: "Anantapur District",
        state: "Andhra Pradesh",
        center: [14.6819, 77.6006],
        bounds: [[14.65, 77.55], [14.72, 77.65]],
        avg_ndvi: 0.38,
        avg_ndwi: 0.08,
        structures_count: 51,
        status: "SPATIAL_DISCREPANCY_FLAG"
      },
      {
        id: "WS-KL-WAY-05",
        project_code: "Project #E5077",
        name: "Project #E5077 - Village Wayanad Contour Trench",
        village: "Village Wayanad",
        district: "Wayanad Sector",
        state: "Kerala",
        center: [11.6854, 76.1320],
        bounds: [[11.65, 76.10], [11.72, 76.16]],
        avg_ndvi: 0.62,
        avg_ndwi: 0.24,
        structures_count: 29,
        status: "NEEDS_REVIEW"
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
        lat: 22.5726,
        lng: 88.3639,
        azimuth: 135.0,
        focal_length: 28.0,
        timestamp: "2026-08-28T10:15:00Z",
        photo_url: "http://localhost:8000/static/sample_checkdam_1.jpg",
        crypto_verified: 1,
        status: "APPROVED",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [[[88.3639, 22.5726], [88.3650, 22.5715], [88.3658, 22.5722], [88.3639, 22.5726]]]
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

export function generateLocalFallbackGrid(bounds = [[22.54, 88.32], [22.60, 88.40]], gridSize = 6) {
  const safeBounds = bounds && bounds.length === 2 ? bounds : [[22.54, 88.32], [22.60, 88.40]];
  const minLat = safeBounds[0][0];
  const minLng = safeBounds[0][1];
  const maxLat = safeBounds[1][0];
  const maxLng = safeBounds[1][1];
  const latStep = (maxLat - minLat) / gridSize;
  const lngStep = (maxLng - minLng) / gridSize;
  const features = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellMinLat = minLat + i * latStep;
      const cellMaxLat = cellMinLat + latStep;
      const cellMinLng = minLng + j * lngStep;
      const cellMaxLng = cellMinLng + lngStep;
      const seed = (i * 13 + j * 7) % 17;
      const varFactor = (seed - 8) / 100.0;
      const ndvi = Number(Math.max(-0.2, Math.min(0.9, 0.42 + varFactor)).toFixed(3));
      const ndwi = Number(Math.max(-0.3, Math.min(0.8, 0.18 - varFactor)).toFixed(3));
      const smi = Number(Math.max(0.0, Math.min(1.0, 0.35 + varFactor * 0.5)).toFixed(3));

      features.push({
        type: "Feature",
        properties: {
          grid_id: `cell_${i}_${j}`,
          ndvi,
          ndwi,
          smi,
          water_detected: ndwi > 0.05 || smi > 0.35
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [Number(cellMinLng.toFixed(6)), Number(cellMinLat.toFixed(6))],
            [Number(cellMaxLng.toFixed(6)), Number(cellMinLat.toFixed(6))],
            [Number(cellMaxLng.toFixed(6)), Number(cellMaxLat.toFixed(6))],
            [Number(cellMinLng.toFixed(6)), Number(cellMaxLat.toFixed(6))],
            [Number(cellMinLng.toFixed(6)), Number(cellMinLat.toFixed(6))]
          ]]
        }
      });
    }
  }

  return {
    type: "FeatureCollection",
    features
  };
}

export async function fetchSatelliteLayer(watershedId, bounds = null) {
  try {
    const res = await fetch(`${API_BASE_URL}/watershed/${watershedId}/satellite-layer`);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return {
      grid: data.grid || generateLocalFallbackGrid(bounds),
      planet_telemetry: data.planet_telemetry || {
        constellation: "PlanetScope 3m High-Res Daily",
        satellite_id: "Dove-252e-PSB",
        gsd_m: 3.0,
        cloud_cover_pct: 2.5,
        acquired_timestamp: "2026-09-03T05:19:09Z"
      }
    };
  } catch (err) {
    console.warn("Using offline satellite grid layer:", err);
    return {
      grid: generateLocalFallbackGrid(bounds),
      planet_telemetry: {
        constellation: "PlanetScope 3m High-Res Daily",
        satellite_id: "Dove-252e-PSB",
        gsd_m: 3.0,
        cloud_cover_pct: 2.5,
        acquired_timestamp: "2026-09-03T05:19:09Z"
      }
    };
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
