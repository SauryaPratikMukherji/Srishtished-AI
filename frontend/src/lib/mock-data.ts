export type Status = "verified" | "review" | "flagged";

export const STATUS_LABEL: Record<Status, string> = {
  verified: "Verified",
  review: "Needs Review",
  flagged: "Spatial Discrepancy",
};

export type StructureType =
  | "Check Dam (Concrete)"
  | "Check Dam (Earthen)"
  | "Farm Pond"
  | "Recharge Well"
  | "Percolation Tank"
  | "Contour Trench";

export const STRUCTURE_TYPES: StructureType[] = [
  "Check Dam (Concrete)",
  "Check Dam (Earthen)",
  "Farm Pond",
  "Recharge Well",
  "Percolation Tank",
  "Contour Trench",
];

export interface Project {
  code: string;
  village: string;
  district: string;
  state: string;
  structure: StructureType;
  structureCount: number;
  status: Status;
  lastAudit: string;
  inspector: string;
  ndvi: number;
  ndwi: number;
  lat: number;
  lng: number;
  /** position on the mock map canvas, in % */
  x: number;
  y: number;
}

export const PROJECTS: Project[] = [
  {
    code: "WS-ANTP-001",
    village: "Rampur",
    district: "Anantapur",
    state: "Andhra Pradesh",
    structure: "Check Dam (Concrete)",
    structureCount: 4,
    status: "verified",
    lastAudit: "12 Aug 2026",
    inspector: "R. Meenakshi",
    ndvi: 0.62,
    ndwi: 0.31,
    lat: 14.6812,
    lng: 77.6004,
    x: 32,
    y: 72,
  },
  {
    code: "WS-MP-002",
    village: "Baghpura",
    district: "Chhatarpur",
    state: "Madhya Pradesh",
    structure: "Farm Pond",
    structureCount: 9,
    status: "review",
    lastAudit: "09 Aug 2026",
    inspector: "S. Kulkarni",
    ndvi: 0.41,
    ndwi: 0.22,
    lat: 24.9172,
    lng: 79.5881,
    x: 44,
    y: 38,
  },
  {
    code: "WS-OD-003",
    village: "Kansabahal",
    district: "Sundargarh",
    state: "Odisha",
    structure: "Percolation Tank",
    structureCount: 3,
    status: "flagged",
    lastAudit: "05 Aug 2026",
    inspector: "P. Behera",
    ndvi: 0.18,
    ndwi: 0.09,
    lat: 22.2043,
    lng: 84.7712,
    x: 66,
    y: 46,
  },
  {
    code: "WS-TS-004",
    village: "Kondapur",
    district: "Medak",
    state: "Telangana",
    structure: "Recharge Well",
    structureCount: 12,
    status: "verified",
    lastAudit: "14 Aug 2026",
    inspector: "A. Naidu",
    ndvi: 0.58,
    ndwi: 0.34,
    lat: 17.8901,
    lng: 78.2114,
    x: 38,
    y: 62,
  },
  {
    code: "WS-RJ-005",
    village: "Sirohi Khurd",
    district: "Jhunjhunu",
    state: "Rajasthan",
    structure: "Contour Trench",
    structureCount: 26,
    status: "review",
    lastAudit: "02 Aug 2026",
    inspector: "K. Rathore",
    ndvi: 0.29,
    ndwi: 0.12,
    lat: 28.1298,
    lng: 75.4001,
    x: 27,
    y: 26,
  },
  {
    code: "WS-MH-006",
    village: "Waghjai",
    district: "Ahmednagar",
    state: "Maharashtra",
    structure: "Check Dam (Earthen)",
    structureCount: 6,
    status: "verified",
    lastAudit: "11 Aug 2026",
    inspector: "D. Pawar",
    ndvi: 0.55,
    ndwi: 0.28,
    lat: 19.0948,
    lng: 74.7488,
    x: 26,
    y: 55,
  },
  {
    code: "WS-MH-007",
    village: "Girna Budruk",
    district: "Jalgaon",
    state: "Maharashtra",
    structure: "Farm Pond",
    structureCount: 8,
    status: "flagged",
    lastAudit: "29 Jul 2026",
    inspector: "D. Pawar",
    ndvi: 0.21,
    ndwi: 0.07,
    lat: 20.9942,
    lng: 75.5626,
    x: 31,
    y: 48,
  },
  {
    code: "WS-OD-008",
    village: "Tikarpada",
    district: "Angul",
    state: "Odisha",
    structure: "Check Dam (Concrete)",
    structureCount: 5,
    status: "verified",
    lastAudit: "13 Aug 2026",
    inspector: "P. Behera",
    ndvi: 0.66,
    ndwi: 0.37,
    lat: 20.5581,
    lng: 84.8412,
    x: 63,
    y: 52,
  },
  {
    code: "WS-TS-009",
    village: "Bhoodan Pochampally",
    district: "Yadadri",
    state: "Telangana",
    structure: "Percolation Tank",
    structureCount: 2,
    status: "verified",
    lastAudit: "08 Aug 2026",
    inspector: "A. Naidu",
    ndvi: 0.6,
    ndwi: 0.3,
    lat: 17.3462,
    lng: 78.8231,
    x: 41,
    y: 66,
  },
  {
    code: "WS-RJ-010",
    village: "Deogarh Kalan",
    district: "Rajsamand",
    state: "Rajasthan",
    structure: "Recharge Well",
    structureCount: 15,
    status: "review",
    lastAudit: "31 Jul 2026",
    inspector: "K. Rathore",
    ndvi: 0.33,
    ndwi: 0.15,
    lat: 25.5347,
    lng: 73.9012,
    x: 22,
    y: 34,
  },
];

export interface Audit {
  code: string;
  project: string;
  village: string;
  structure: StructureType;
  inspector: string;
  date: string;
  gps: "Matched" | "Tolerance" | "Mismatch";
  confidence: number;
  status: Status;
  spatialMatch: number;
  ndvi: number;
  ndwi: number;
  note: string;
}

export const AUDITS: Audit[] = [
  {
    code: "AUD-ANTP-001",
    project: "WS-ANTP-001",
    village: "Rampur",
    structure: "Check Dam (Concrete)",
    inspector: "R. Meenakshi",
    date: "12 Aug 2026",
    gps: "Matched",
    confidence: 92,
    status: "verified",
    spatialMatch: 96,
    ndvi: 0.62,
    ndwi: 0.31,
    note: "Ground photo location matches satellite NDVI vegetation signature.",
  },
  {
    code: "AUD-MP-002",
    project: "WS-MP-002",
    village: "Baghpura",
    structure: "Farm Pond",
    inspector: "S. Kulkarni",
    date: "09 Aug 2026",
    gps: "Tolerance",
    confidence: 71,
    status: "review",
    spatialMatch: 78,
    ndvi: 0.41,
    ndwi: 0.22,
    note: "Evidence is partially consistent. Manual verification is recommended.",
  },
  {
    code: "AUD-OD-003",
    project: "WS-OD-003",
    village: "Kansabahal",
    structure: "Percolation Tank",
    inspector: "P. Behera",
    date: "05 Aug 2026",
    gps: "Mismatch",
    confidence: 44,
    status: "flagged",
    spatialMatch: 31,
    ndvi: 0.18,
    ndwi: 0.09,
    note: "Location mismatch detected between the submitted ground photograph and the expected project location.",
  },
  {
    code: "AUD-TS-004",
    project: "WS-TS-004",
    village: "Kondapur",
    structure: "Recharge Well",
    inspector: "A. Naidu",
    date: "14 Aug 2026",
    gps: "Matched",
    confidence: 89,
    status: "verified",
    spatialMatch: 94,
    ndvi: 0.58,
    ndwi: 0.34,
    note: "Structure detected and cross-validated with satellite water index.",
  },
  {
    code: "AUD-RJ-005",
    project: "WS-RJ-005",
    village: "Sirohi Khurd",
    structure: "Contour Trench",
    inspector: "K. Rathore",
    date: "02 Aug 2026",
    gps: "Tolerance",
    confidence: 68,
    status: "review",
    spatialMatch: 74,
    ndvi: 0.29,
    ndwi: 0.12,
    note: "Trench alignment partially visible. Second capture requested.",
  },
  {
    code: "AUD-MH-006",
    project: "WS-MH-006",
    village: "Waghjai",
    structure: "Check Dam (Earthen)",
    inspector: "D. Pawar",
    date: "11 Aug 2026",
    gps: "Matched",
    confidence: 90,
    status: "verified",
    spatialMatch: 93,
    ndvi: 0.55,
    ndwi: 0.28,
    note: "Ground evidence consistent with expected project boundary.",
  },
  {
    code: "AUD-MH-007",
    project: "WS-MH-007",
    village: "Girna Budruk",
    structure: "Farm Pond",
    inspector: "D. Pawar",
    date: "29 Jul 2026",
    gps: "Mismatch",
    confidence: 38,
    status: "flagged",
    spatialMatch: 24,
    ndvi: 0.21,
    ndwi: 0.07,
    note: "Photo captured 1.8 km away from the reported farm pond location.",
  },
  {
    code: "AUD-OD-008",
    project: "WS-OD-008",
    village: "Tikarpada",
    structure: "Check Dam (Concrete)",
    inspector: "P. Behera",
    date: "13 Aug 2026",
    gps: "Matched",
    confidence: 94,
    status: "verified",
    spatialMatch: 97,
    ndvi: 0.66,
    ndwi: 0.37,
    note: "High-confidence detection with strong vegetation recovery signal.",
  },
];

export const DASHBOARD_STATS = {
  total: 125,
  verified: 98,
  review: 17,
  flagged: 10,
};

export const NDVI_SERIES = [
  { month: "Mar", ndvi: 0.31, ndwi: 0.12 },
  { month: "Apr", ndvi: 0.34, ndwi: 0.14 },
  { month: "May", ndvi: 0.3, ndwi: 0.11 },
  { month: "Jun", ndvi: 0.38, ndwi: 0.19 },
  { month: "Jul", ndvi: 0.51, ndwi: 0.27 },
  { month: "Aug", ndvi: 0.62, ndwi: 0.31 },
];

export const REPORTS = [
  {
    id: "RPT-2026-014",
    title: "District Verification Summary — Anantapur",
    period: "August 2026",
    generated: "14 Aug 2026",
    type: "Verification",
  },
  {
    id: "RPT-2026-013",
    title: "Flagged Projects Review — Odisha",
    period: "August 2026",
    generated: "12 Aug 2026",
    type: "Exception",
  },
  {
    id: "RPT-2026-012",
    title: "Quarterly Watershed Impact Report",
    period: "Q2 2026",
    generated: "05 Aug 2026",
    type: "Impact",
  },
  {
    id: "RPT-2026-011",
    title: "Satellite Cross-Check Log — Maharashtra",
    period: "July 2026",
    generated: "31 Jul 2026",
    type: "Satellite",
  },
  {
    id: "RPT-2026-010",
    title: "Field Inspector Activity Statement",
    period: "July 2026",
    generated: "30 Jul 2026",
    type: "Activity",
  },
];

export const RISKS = [
  {
    title: "Cloud Cover Obstruction",
    risk: "Satellite imagery may be affected by cloud cover.",
    mitigation:
      "Use alternate imagery/time windows and combine satellite evidence with ground observations.",
  },
  {
    title: "Field GPS Offsets",
    risk: "GPS readings can have positional errors.",
    mitigation: "Use spatial tolerance thresholds and cross-check against project coordinates.",
  },
  {
    title: "Low-Quality Uploads",
    risk: "Poor-quality photographs can reduce AI detection confidence.",
    mitigation: "Use image-quality checks and request another field capture when confidence is low.",
  },
  {
    title: "GPS Location Spoofing",
    risk: "Incorrect or spoofed location metadata may be submitted.",
    mitigation:
      "Cross-validate GPS metadata against satellite/environmental evidence and project boundaries.",
  },
];

export const STATES = Array.from(new Set(PROJECTS.map((p) => p.state))).sort();
export const DISTRICTS = Array.from(new Set(PROJECTS.map((p) => p.district))).sort();
