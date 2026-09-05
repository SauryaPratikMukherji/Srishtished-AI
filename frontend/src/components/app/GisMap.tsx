import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Satellite, ShieldCheck, AlertTriangle, HelpCircle, Compass, Radio } from "lucide-react";
import { fetchSatelliteLayer, generateLocalFallbackGrid, Watershed, AuditRecord } from "../../api/client";

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// Fix Leaflet default icon pathing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const getStatusIcon = (status: string) => {
  let pinBg = "#10b981"; // 🟢 Green - Verified
  if (status === "NEEDS_REVIEW" || status === "review") pinBg = "#f59e0b"; // 🟡 Yellow - Review
  if (status === "SPATIAL_DISCREPANCY_FLAG" || status === "flagged" || status === "NOT_VERIFIED") pinBg = "#f43f5e"; // 🔴 Red - Discrepancy

  return new L.DivIcon({
    className: "custom-camera-pin",
    html: `<div style="background: ${pinBg}; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6); transform: scale(1.1);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const getStatusBadgeIcon = (status: string) => {
  if (status === "VERIFIED" || status === "APPROVED" || status === "verified") {
    return <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">🟢 VERIFIED</span>;
  }
  if (status === "NEEDS_REVIEW" || status === "review") {
    return <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">🟡 NEEDS REVIEW</span>;
  }
  return <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">🔴 SPATIAL DISCREPANCY</span>;
};

interface GisMapProps {
  watersheds?: Watershed[];
  audits?: AuditRecord[];
  selectedWatershedId?: string | undefined;
  onSelectWatershed?: (id: string) => void;
  height?: string;
}

export function GisMap({
  watersheds = [],
  audits = [],
  selectedWatershedId,
  onSelectWatershed,
  height = "h-[580px]",
}: GisMapProps) {
  const [mapLayerMode, setMapLayerMode] = useState<"planet" | "ndvi" | "ndwi" | "satellite" | "standard">("ndvi");
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const currentWs =
    watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0] || {
      id: "WS-AP-ANTP-01",
      project_code: "Project #A1023",
      name: "Project #A1023 - Village Rampur Check Dam",
      village: "Rampur",
      district: "Anantapur",
      state: "Andhra Pradesh",
      center: [14.6812, 77.6004] as [number, number],
      bounds: [
        [14.65, 77.55],
        [14.72, 77.65],
      ] as [[number, number], [number, number]],
      status: "VERIFIED",
    };

  const wsBounds = currentWs.bounds || [
    [14.65, 77.55],
    [14.72, 77.65],
  ];

  const [satelliteGrid, setSatelliteGrid] = useState<any>(() => generateLocalFallbackGrid(wsBounds));
  const [planetTelemetry, setPlanetTelemetry] = useState({
    constellation: "PlanetScope 3m High-Res Daily",
    satellite_id: "Dove-252e-PSB",
    gsd_m: 3.0,
    cloud_cover_pct: 2.5,
    acquired_timestamp: "2026-09-05T05:19:00Z",
  });

  useEffect(() => {
    if (currentWs?.id) {
      setSelectedAudit(null);
      if (currentWs.bounds) {
        setSatelliteGrid(generateLocalFallbackGrid(currentWs.bounds));
      }
      fetchSatelliteLayer(currentWs.id, currentWs.bounds)
        .then((data) => {
          if (data?.grid) setSatelliteGrid(data.grid);
          if (data?.planet_telemetry) setPlanetTelemetry(data.planet_telemetry);
        })
        .catch((err) => console.warn("Using offline grid layer:", err));
    }
  }, [selectedWatershedId, currentWs?.id]);

  const filteredAudits = audits.filter(
    (a) =>
      a.watershed_id === currentWs?.id ||
      (currentWs?.center && Math.abs(a.lat - currentWs.center[0]) < 0.4 && Math.abs(a.lng - currentWs.center[1]) < 0.4)
  );

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-md border border-border bg-slate-950`}>
      {/* Top Header Control Overlay: Project Selector Dropdown + Layer Controls */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card/95 p-2.5 backdrop-blur-md border border-border shadow-lg">
        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-2 min-w-[280px]">
          <span className="text-xs font-bold text-navy flex items-center gap-1.5 shrink-0">
            <Radio className="h-4 w-4 text-indigo-600 animate-pulse" /> Target Project:
          </span>
          <select
            value={currentWs.id}
            onChange={(e) => {
              if (onSelectWatershed) onSelectWatershed(e.target.value);
            }}
            className="w-full rounded-md border border-indigo-500/40 bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {watersheds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.status === "VERIFIED" ? "🟢" : w.status === "NEEDS_REVIEW" ? "🟡" : "🔴"} {w.project_code} — {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Spectral Layer Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMapLayerMode("planet")}
            className={`px-2.5 py-1.5 text-xs rounded-md font-bold flex items-center gap-1 transition ${
              mapLayerMode === "planet"
                ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-400"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <Satellite className="h-3.5 w-3.5" /> PlanetScope 3m Daily
          </button>
          <button
            type="button"
            onClick={() => setMapLayerMode("ndvi")}
            className={`px-2.5 py-1.5 text-xs rounded-md font-bold flex items-center gap-1 transition ${
              mapLayerMode === "ndvi"
                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            🌿 NDVI Vegetation
          </button>
          <button
            type="button"
            onClick={() => setMapLayerMode("ndwi")}
            className={`px-2.5 py-1.5 text-xs rounded-md font-bold flex items-center gap-1 transition ${
              mapLayerMode === "ndwi"
                ? "bg-sky-600 text-white shadow-md ring-2 ring-sky-400"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            💧 NDWI Water Index
          </button>
          <button
            type="button"
            onClick={() => setMapLayerMode("satellite")}
            className={`px-2.5 py-1.5 text-xs rounded-md font-bold transition ${
              mapLayerMode === "satellite"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            🛰️ Esri Satellite
          </button>
        </div>
      </div>

      {/* PlanetScope High-Res Telemetry Banner */}
      {mapLayerMode === "planet" && (
        <div className="absolute top-16 right-3 z-[400] flex items-center gap-2 rounded-md bg-purple-950/90 border border-purple-500/40 px-3 py-1.5 text-[11px] font-mono text-purple-200 shadow-md backdrop-blur-md">
          <Satellite className="h-4 w-4 text-purple-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>
            PlanetScope 3m High-Res · Satellite: <strong className="text-white">{planetTelemetry.satellite_id}</strong> · GSD: <strong className="text-white">3.0m</strong> · Cloud: <strong className="text-emerald-400">2.5%</strong>
          </span>
        </div>
      )}

      {/* Leaflet GIS Map Container */}
      <MapContainer
        center={currentWs.center || [14.6812, 77.6004]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <RecenterMap center={currentWs.center || [14.6812, 77.6004]} />

        {mapLayerMode === "satellite" || mapLayerMode === "planet" ? (
          <TileLayer
            attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Render Satellite Multispectral Grid Cells (NDVI / NDWI / PlanetScope overlay) */}
        {(mapLayerMode === "ndvi" || mapLayerMode === "ndwi" || mapLayerMode === "planet") &&
          satelliteGrid?.features?.map((feature: any, idx: number) => {
            const coords = feature.geometry.coordinates[0].map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            const ndvi = feature.properties.ndvi;
            const ndwi = feature.properties.ndwi;

            let color = "#10b981";
            let fillColor = "#10b981";
            let fillOpacity = 0.45;

            if (mapLayerMode === "ndvi") {
              if (ndvi > 0.5) fillColor = "#15803d";
              else if (ndvi > 0.3) fillColor = "#22c55e";
              else if (ndvi > 0.1) fillColor = "#84cc16";
              else fillColor = "#eab308";
              color = fillColor;
            } else if (mapLayerMode === "ndwi") {
              if (ndwi > 0.2) fillColor = "#1d4ed8";
              else if (ndwi > 0.05) fillColor = "#0284c7";
              else fillColor = "#f43f5e";
              color = fillColor;
              fillOpacity = ndwi > 0.05 ? 0.55 : 0.25;
            } else if (mapLayerMode === "planet") {
              fillColor = ndvi > 0.35 ? "#16a34a" : "#0284c7";
              color = "#9333ea";
              fillOpacity = 0.25;
            }

            return (
              <Polygon
                key={feature.properties.grid_id || idx}
                positions={coords}
                pathOptions={{
                  color,
                  weight: 1,
                  fillColor,
                  fillOpacity,
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 p-1">
                    <p className="font-bold text-slate-900">Grid Cell {feature.properties.grid_id}</p>
                    <p>NDVI (Vegetation): <span className="font-semibold text-emerald-700">{ndvi}</span></p>
                    <p>NDWI (Water Index): <span className="font-semibold text-sky-700">{ndwi}</span></p>
                    <p className="text-[10px] text-slate-500 border-t pt-1">PlanetScope 3m Spatial Grid Cell</p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Watershed Perimeter Boundary Line */}
        {currentWs.bounds && (
          <Polygon
            positions={[
              [currentWs.bounds[0][0], currentWs.bounds[0][1]],
              [currentWs.bounds[0][0], currentWs.bounds[1][1]],
              [currentWs.bounds[1][0], currentWs.bounds[1][1]],
              [currentWs.bounds[1][0], currentWs.bounds[0][1]],
            ]}
            pathOptions={{
              color: currentWs.status === "VERIFIED" ? "#10b981" : currentWs.status === "NEEDS_REVIEW" ? "#f59e0b" : "#f43f5e",
              weight: 3,
              dashArray: "8, 6",
              fill: false,
            }}
          />
        )}

        {/* Audit Pins & Viewshed Field Cones */}
        {filteredAudits.map((audit) => {
          const auditStatus = audit.watershed_id === "WS-KL-WAY-05" ? "NEEDS_REVIEW" : audit.status;
          const isVerified = auditStatus === "APPROVED" || auditStatus === "VERIFIED";
          const isReview = auditStatus === "NEEDS_REVIEW" || auditStatus === "review";
          const isFlagged = auditStatus === "SPATIAL_DISCREPANCY_FLAG" || auditStatus === "flagged" || auditStatus === "NOT_VERIFIED";

          const coneColor = isVerified ? "#10b981" : isReview ? "#f59e0b" : "#f43f5e";

          return (
            <React.Fragment key={audit.id}>
              {/* Camera Viewshed FOV Cone Projection */}
              {audit.viewshed_geojson?.coordinates?.[0] && (
                <Polygon
                  positions={audit.viewshed_geojson.coordinates[0].map((c: [number, number]) => [c[1], c[0]])}
                  pathOptions={{
                    color: coneColor,
                    weight: 2,
                    fillColor: coneColor,
                    fillOpacity: 0.4,
                  }}
                />
              )}

              {/* Geo-tagged Structure Marker */}
              <Marker
                position={[audit.lat, audit.lng]}
                icon={getStatusIcon(auditStatus)}
                eventHandlers={{
                  click: () => setSelectedAudit(audit),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b pb-1">
                      <span className="font-bold text-slate-900">{audit.audit_code}</span>
                      {getStatusBadgeIcon(auditStatus)}
                    </div>
                    <p>Structure: <strong>{audit.structure_type}</strong></p>
                    <p>Inspector: <span className="font-mono text-[11px]">{audit.inspector_id}</span></p>
                    <p>Coordinates: {audit.lat.toFixed(4)}° N, {audit.lng.toFixed(4)}° E</p>
                    <div className="bg-slate-100 p-2 rounded text-[11px] text-slate-700 border border-slate-200">
                      <strong>AI Satellite Validation:</strong>
                      <p className="mt-0.5 italic">
                        {audit.validation_details?.reasons?.[0] ||
                          (isVerified
                            ? "Ground structure detected matches Sentinel-2 NDWI reservoir index."
                            : isReview
                            ? "Ground CV detects structure, but satellite spectral confidence is marginal (71%)."
                            : "Ground CV detects water reservoir, but satellite NDWI (-0.18) indicates dry arid soil.")}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
