import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, ShieldCheck, AlertTriangle, Info, Satellite, Compass } from "lucide-react";
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
  let pinBg = "#10b981"; // 🟢 Green
  if (status === "NEEDS_REVIEW" || status === "review") pinBg = "#f59e0b"; // 🟡 Yellow
  if (status === "SPATIAL_DISCREPANCY_FLAG" || status === "flagged") pinBg = "#f43f5e"; // 🔴 Red

  return new L.DivIcon({
    className: "custom-camera-pin",
    html: `<div style="background: ${pinBg}; border: 2.5px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
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
  height = "h-[560px]",
}: GisMapProps) {
  const [mapLayerMode, setMapLayerMode] = useState<"satellite" | "standard" | "ndvi" | "ndwi">("ndvi");
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const currentWs =
    watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0] || {
      id: "WS-AP-ANTP-01",
      name: "Project #A1023 - Village Rampur Check Dam",
      village: "Rampur",
      district: "Anantapur",
      state: "Andhra Pradesh",
      center: [14.6812, 77.6004] as [number, number],
      bounds: [
        [14.65, 77.55],
        [14.72, 77.65],
      ] as [[number, number], [number, number]],
    };

  const wsBounds = currentWs.bounds || [
    [14.65, 77.55],
    [14.72, 77.65],
  ];

  const [satelliteGrid, setSatelliteGrid] = useState<any>(() => generateLocalFallbackGrid(wsBounds));

  useEffect(() => {
    if (currentWs?.id) {
      setSelectedAudit(null);
      if (currentWs.bounds) {
        setSatelliteGrid(generateLocalFallbackGrid(currentWs.bounds));
      }
      fetchSatelliteLayer(currentWs.id, currentWs.bounds)
        .then((data) => {
          if (data?.grid) setSatelliteGrid(data.grid);
        })
        .catch((err) => console.warn("Using offline grid layer:", err));
    }
  }, [selectedWatershedId, currentWs?.id]);

  const filteredAudits = audits.filter(
    (a) =>
      a.watershed_id === currentWs?.id ||
      (currentWs?.center && Math.abs(a.lat - currentWs.center[0]) < 0.3 && Math.abs(a.lng - currentWs.center[1]) < 0.3)
  );

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-md border border-border bg-slate-950`}>
      {/* Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2 rounded-md bg-card/90 p-2 backdrop-blur-md border border-border shadow-md">
        <span className="flex items-center gap-1 text-xs font-semibold text-foreground px-2">
          <Layers className="h-3.5 w-3.5" /> Spectral Layer:
        </span>
        <button
          type="button"
          onClick={() => setMapLayerMode("ndvi")}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            mapLayerMode === "ndvi" ? "bg-emerald-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          🌿 NDVI Vegetation
        </button>
        <button
          type="button"
          onClick={() => setMapLayerMode("ndwi")}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            mapLayerMode === "ndwi" ? "bg-sky-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          💧 NDWI Water Index
        </button>
        <button
          type="button"
          onClick={() => setMapLayerMode("satellite")}
          className={`px-2.5 py-1 text-xs rounded font-medium transition ${
            mapLayerMode === "satellite" ? "bg-indigo-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          🛰️ Esri Satellite
        </button>
      </div>

      <MapContainer
        center={currentWs.center || [14.6812, 77.6004]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <RecenterMap center={currentWs.center || [14.6812, 77.6004]} />

        {mapLayerMode === "satellite" ? (
          <TileLayer
            attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Render Satellite Grid Cells (NDVI / NDWI) */}
        {satelliteGrid?.features?.map((feature: any, idx: number) => {
          const coords = feature.geometry.coordinates[0].map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          const ndvi = feature.properties.ndvi;
          const ndwi = feature.properties.ndwi;

          let color = "#3b82f6";
          let fillColor = "#3b82f6";
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
            else fillColor = "#cbd5e1";
            color = fillColor;
            fillOpacity = ndwi > 0.05 ? 0.6 : 0.2;
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
                <div className="text-xs">
                  <p className="font-bold">Grid Cell {feature.properties.grid_id}</p>
                  <p>NDVI (Vegetation): <span className="font-semibold">{ndvi}</span></p>
                  <p>NDWI (Water Index): <span className="font-semibold">{ndwi}</span></p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Watershed Perimeter Boundary */}
        {currentWs.bounds && (
          <Polygon
            positions={[
              [currentWs.bounds[0][0], currentWs.bounds[0][1]],
              [currentWs.bounds[0][0], currentWs.bounds[1][1]],
              [currentWs.bounds[1][0], currentWs.bounds[1][1]],
              [currentWs.bounds[1][0], currentWs.bounds[0][1]],
            ]}
            pathOptions={{ color: "#6366f1", weight: 2.5, dashArray: "6, 6", fill: false }}
          />
        )}

        {/* Audit Markers & Viewshed Cones */}
        {filteredAudits.map((audit) => {
          const isSelected = selectedAudit?.id === audit.id;

          return (
            <React.Fragment key={audit.id}>
              {/* Viewshed Cone Projection */}
              {audit.viewshed_geojson?.coordinates?.[0] && (
                <Polygon
                  positions={audit.viewshed_geojson.coordinates[0].map((c: [number, number]) => [c[1], c[0]])}
                  pathOptions={{
                    color: audit.status === "APPROVED" || audit.status === "VERIFIED" ? "#10b981" : "#f43f5e",
                    weight: 2,
                    fillColor: audit.status === "APPROVED" || audit.status === "VERIFIED" ? "#10b981" : "#f43f5e",
                    fillOpacity: 0.35,
                  }}
                />
              )}

              <Marker
                position={[audit.lat, audit.lng]}
                icon={getStatusIcon(audit.status)}
                eventHandlers={{
                  click: () => setSelectedAudit(audit),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2 border-b pb-1">
                      <span className="font-bold text-slate-900">{audit.audit_code}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                          audit.status === "APPROVED" || audit.status === "VERIFIED"
                            ? "bg-emerald-600"
                            : audit.status === "NEEDS_REVIEW"
                            ? "bg-amber-500"
                            : "bg-rose-600"
                        }`}
                      >
                        {audit.status}
                      </span>
                    </div>
                    <p>Structure: <strong>{audit.structure_type}</strong></p>
                    <p>Inspector: {audit.inspector_id}</p>
                    <p>Location: {audit.lat.toFixed(4)}° N, {audit.lng.toFixed(4)}° E</p>
                    {audit.validation_details?.reasons?.[0] && (
                      <p className="text-[11px] italic text-slate-600 mt-1 border-t pt-1">
                        "{audit.validation_details.reasons[0]}"
                      </p>
                    )}
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
