const API_BASE_URL = "http://localhost:8000/api";

export interface Watershed {
  id: string;
  project_code: string;
  name: string;
  village: string;
  district: string;
  state: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  avg_ndvi: number;
  avg_ndwi: number;
  structures_count: number;
  status: "VERIFIED" | "SPATIAL_DISCREPANCY_FLAG" | "NEEDS_REVIEW" | "APPROVED";
  claimed_structure?: string;
}

export interface AuditRecord {
  id: number | string;
  audit_code: string;
  watershed_id: string;
  inspector_id: string;
  structure_type: string;
  lat: number;
  lng: number;
  azimuth?: number;
  focal_length?: number;
  timestamp: string;
  photo_url?: string;
  crypto_verified: number | boolean;
  status: string;
  viewshed_geojson?: any;
  validation_details?: {
    status: string;
    reasons: string[];
  };
}

export async function fetchWatersheds(): Promise<Watershed[]> {
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
        project_code: "WS-ANTP-001",
        name: "Project #A1023 - Village Rampur Check Dam",
        village: "Rampur",
        district: "Anantapur",
        state: "Andhra Pradesh",
        center: [14.6812, 77.6004],
        bounds: [[14.65, 77.55], [14.72, 77.65]],
        avg_ndvi: 0.62,
        avg_ndwi: 0.31,
        structures_count: 42,
        status: "VERIFIED",
      },
      {
        id: "WS-MH-SOL-02",
        project_code: "WS-MP-002",
        name: "Project #B2045 - Village Baghpura Farm Pond",
        village: "Baghpura",
        district: "Chhatarpur",
        state: "Madhya Pradesh",
        center: [24.9172, 79.5881],
        bounds: [[24.88, 79.52], [24.95, 79.62]],
        avg_ndvi: 0.41,
        avg_ndwi: 0.22,
        structures_count: 65,
        status: "SPATIAL_DISCREPANCY_FLAG",
      },
      {
        id: "WS-MP-BUND-03",
        project_code: "WS-OD-003",
        name: "Project #C3089 - Village Kansabahal Earthen Dam",
        village: "Kansabahal",
        district: "Sundargarh",
        state: "Odisha",
        center: [22.2043, 84.7712],
        bounds: [[22.15, 84.70], [22.25, 84.82]],
        avg_ndvi: 0.18,
        avg_ndwi: 0.09,
        structures_count: 38,
        status: "SPATIAL_DISCREPANCY_FLAG",
      },
      {
        id: "WS-AP-ANTP-04",
        project_code: "WS-TS-004",
        name: "Project #D4012 - Village Kondapur Percolation Basin",
        village: "Kondapur",
        district: "Medak",
        state: "Telangana",
        center: [17.5134, 78.1342],
        bounds: [[17.48, 78.08], [17.55, 78.18]],
        avg_ndvi: 0.55,
        avg_ndwi: 0.28,
        structures_count: 51,
        status: "VERIFIED",
      },
      {
        id: "WS-KL-WAY-05",
        project_code: "WS-KL-005",
        name: "Project #E5077 - Village Wayanad Contour Trench",
        village: "Wayanad",
        district: "Wayanad Sector",
        state: "Kerala",
        center: [11.6854, 76.132],
        bounds: [[11.65, 76.1], [11.72, 76.16]],
        avg_ndvi: 0.62,
        avg_ndwi: 0.24,
        structures_count: 29,
        status: "NEEDS_REVIEW",
      },
    ];
  }
}

export async function fetchAudits(watershedId: string | null = null): Promise<AuditRecord[]> {
  try {
    const url = watershedId
      ? `${API_BASE_URL}/audits?watershed_id=${watershedId}`
      : `${API_BASE_URL}/audits`;
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
        lat: 14.6812,
        lng: 77.6004,
        azimuth: 135.0,
        focal_length: 28.0,
        timestamp: "2026-08-28T10:15:00Z",
        photo_url: "http://localhost:8000/static/sample_checkdam_1.jpg",
        crypto_verified: 1,
        status: "APPROVED",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [
            [
              [77.6004, 14.6812],
              [77.6015, 14.6801],
              [77.6023, 14.6808],
              [77.6004, 14.6812],
            ],
          ],
        },
        validation_details: {
          status: "APPROVED",
          reasons: [
            "Ground CV structural detection matches satellite spectral signatures.",
            "Sight-line camera cone projection aligns with drainage vector.",
          ],
        },
      },
      {
        id: 2,
        audit_code: "AUD-SOL-003",
        watershed_id: "WS-MH-SOL-02",
        inspector_id: "DEV-INSPECTOR-102",
        structure_type: "Check Dam (Earthen)",
        lat: 24.9172,
        lng: 79.5881,
        azimuth: 270.0,
        focal_length: 35.0,
        timestamp: "2026-08-30T14:20:00Z",
        photo_url: "http://localhost:8000/static/sample_mismatch.jpg",
        crypto_verified: 1,
        status: "SPATIAL_DISCREPANCY_FLAG",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [
            [
              [79.5881, 24.9172],
              [79.5868, 24.9172],
              [79.5868, 24.918],
              [79.5881, 24.9172],
            ],
          ],
        },
        validation_details: {
          status: "SPATIAL_DISCREPANCY_FLAG",
          reasons: [
            "Ground CV detects full water reservoir, but satellite NDWI (-0.18) indicates dry arid soil in viewshed cone.",
          ],
        },
      },
      {
        id: 3,
        audit_code: "AUD-WAY-007",
        watershed_id: "WS-KL-WAY-05",
        inspector_id: "DEV-INSPECTOR-712",
        structure_type: "Contour Trench",
        lat: 11.6854,
        lng: 76.132,
        azimuth: 90.0,
        focal_length: 24.0,
        timestamp: "2026-09-03T15:10:00Z",
        photo_url: "http://localhost:8000/static/sample_review.jpg",
        crypto_verified: 1,
        status: "NEEDS_REVIEW",
        viewshed_geojson: {
          type: "Polygon",
          coordinates: [
            [
              [76.132, 11.6854],
              [76.1332, 11.6854],
              [76.133, 11.6862],
              [76.132, 11.6854],
            ],
          ],
        },
        validation_details: {
          status: "NEEDS_REVIEW",
          reasons: [
            "Structure detected with 85% confidence, but registered location has a 12m offset.",
            "Satellite cloud cover limits full 30m NIR spectrum validation.",
          ],
        },
      },
    ];
  }
}

export function generateLocalFallbackGrid(
  bounds?: [[number, number], [number, number]] | null,
  gridSize = 6
) {
  const safeBounds: [[number, number], [number, number]] =
    bounds && Array.isArray(bounds) && bounds.length === 2 && Array.isArray(bounds[0]) && Array.isArray(bounds[1])
      ? bounds
      : [
          [14.65, 77.55],
          [14.72, 77.65],
        ];
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
          water_detected: ndwi > 0.05 || smi > 0.35,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [Number(cellMinLng.toFixed(6)), Number(cellMinLat.toFixed(6))],
              [Number(cellMaxLng.toFixed(6)), Number(cellMinLat.toFixed(6))],
              [Number(cellMaxLng.toFixed(6)), Number(cellMaxLat.toFixed(6))],
              [Number(cellMinLng.toFixed(6)), Number(cellMaxLat.toFixed(6))],
              [Number(cellMinLng.toFixed(6)), Number(cellMinLat.toFixed(6))],
            ],
          ],
        },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

export async function fetchSatelliteLayer(
  watershedId: string,
  bounds: [[number, number], [number, number]] | null = null
) {
  try {
    const res = await fetch(`${API_BASE_URL}/watershed/${watershedId}/satellite-layer`);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    return {
      grid: data.grid || generateLocalFallbackGrid(bounds || undefined),
      planet_telemetry: data.planet_telemetry || {
        constellation: "PlanetScope 3m High-Res Daily",
        satellite_id: "Dove-252e-PSB",
        gsd_m: 3.0,
        cloud_cover_pct: 2.5,
        acquired_timestamp: "2026-09-03T05:19:09Z",
      },
    };
  } catch (err) {
    console.warn("Using offline satellite grid layer:", err);
    return {
      grid: generateLocalFallbackGrid(bounds || undefined),
      planet_telemetry: {
        constellation: "PlanetScope 3m High-Res Daily",
        satellite_id: "Dove-252e-PSB",
        gsd_m: 3.0,
        cloud_cover_pct: 2.5,
        acquired_timestamp: "2026-09-03T05:19:09Z",
      },
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

export async function submitAuditForm(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/submit`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Submission failed");
    return await res.json();
  } catch (err) {
    console.error("Audit submission error:", err);
    throw err;
  }
}

export async function fetchAiAnalysis(auditCode: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai-analysis/${auditCode}`);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  } catch (err) {
    console.warn("Using offline AI analysis fallback:", err);
    return null;
  }
}
