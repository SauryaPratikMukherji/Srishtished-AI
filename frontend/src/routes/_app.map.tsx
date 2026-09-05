import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Layers, Map as MapIcon, Globe, MapPin, ShieldCheck, AlertTriangle, Info, Camera } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { MockMap, MapLegend } from "@/components/app/mock-map";
import { GisMap } from "@/components/app/GisMap";
import { StatusBadge } from "@/components/app/status-badge";
import { PROJECTS, STATUS_LABEL, type Project, type Status } from "@/lib/mock-data";
import { fetchWatersheds, fetchAudits, Watershed, AuditRecord } from "@/api/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/map")({
  head: () => ({
    meta: [
      { title: "Map & GIS — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Geospatial visualization of watershed structures with satellite layers and GPS field submissions.",
      },
      { property: "og:title", content: "Map & GIS — JALPRAMAAN" },
      {
        property: "og:description",
        content: "GIS monitoring interface for watershed development projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

const STATUSES: Status[] = ["verified", "review", "flagged"];

function MapPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Status[]>(STATUSES);
  const [vegetation, setVegetation] = useState(true);
  const [selectedMock, setSelectedMock] = useState<Project | null>(null);
  const [selectedWsId, setSelectedWsId] = useState<string>("WS-AP-ANTP-01");
  const [mapMode, setMapMode] = useState<"leaflet" | "overview">("leaflet");

  const [watersheds, setWatersheds] = useState<Watershed[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);

  useEffect(() => {
    fetchWatersheds().then((data) => {
      if (data && data.length > 0) {
        setWatersheds(data);
        if (data[0]?.id) setSelectedWsId(data[0].id);
      }
    });
    fetchAudits().then((data) => {
      if (data) setAudits(data);
    });
  }, []);

  const selectedWs = watersheds.find((w) => w.id === selectedWsId) || watersheds[0];

  const projects = PROJECTS.filter(
    (p) =>
      active.includes(p.status) &&
      `${p.code} ${p.village} ${p.district}`.toLowerCase().includes(q.toLowerCase()),
  );

  const toggle = (s: Status) =>
    setActive((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <PageHeading
          title="Map & GIS"
          subtitle="Spatial view of watershed structures with live PlanetScope 3m and Sentinel-2 multispectral layers."
        />
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setMapMode("leaflet")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
              mapMode === "leaflet"
                ? "bg-navy text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" /> Interactive Leaflet GIS
          </button>
          <button
            type="button"
            onClick={() => setMapMode("overview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition",
              mapMode === "overview"
                ? "bg-navy text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapIcon className="h-4 w-4" /> Overview Canvas
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_19rem]">
        <SectionCard title="Watershed GIS View" action={<MapLegend className="hidden md:flex" />}>
          {mapMode === "leaflet" ? (
            <GisMap
              watersheds={watersheds}
              audits={audits}
              selectedWatershedId={selectedWsId}
              onSelectWatershed={(id) => setSelectedWsId(id)}
              height="h-[520px]"
            />
          ) : (
            <MockMap
              projects={projects}
              height="h-[520px]"
              showVegetation={vegetation}
              onSelect={setSelectedMock}
            />
          )}

          {/* Satellite Layer & GIS Indicator Guide (NDVI, NDWI, PlanetScope 3m) */}
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy dark:text-slate-200">
                  GIS Layer & Spectral Index Indicator Guide
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                Sentinel-2 & PlanetScope 3m Spatial Legend
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 🌿 NDVI Vegetation Index */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-600 text-white text-xs font-bold">
                    🌿
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                      NDVI Vegetation Index
                    </h4>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      Normalized Difference Vegetation Index
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#15803d] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Dark Green</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Dense Canopy (&gt;0.50)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#22c55e] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Medium Green</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Crop / Healthy (0.30 - 0.50)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#84cc16] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Lime Green</span>
                    </div>
                    <span className="text-[10px] font-bold text-lime-700 dark:text-lime-400 bg-lime-500/10 px-1.5 py-0.5 rounded">
                      Sparse Grass (0.10 - 0.30)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#eab308] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Yellow / Gold</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Bare Soil / Arid (&lt;0.10)
                    </span>
                  </div>
                </div>
              </div>

              {/* 💧 NDWI Water Index */}
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 dark:bg-sky-950/20 space-y-2">
                <div className="flex items-center gap-2 border-b border-sky-500/20 pb-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-sky-600 text-white text-xs font-bold">
                    💧
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-sky-950 dark:text-sky-300">
                      NDWI Water Index
                    </h4>
                    <p className="text-[10px] text-sky-700 dark:text-sky-400 font-mono">
                      Normalized Difference Water Index
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#1d4ed8] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Deep Blue</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      Check Dam Reservoir (&gt;0.20)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#0284c7] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Sky Blue</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                      Streams / Moisture (0.05 - 0.20)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#f43f5e] inline-block border border-black/20 shrink-0" />
                      <span className="font-semibold text-[11px]">Rose / Red</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      Dry Ground / No Water (&lt;0.05)
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] text-sky-800 dark:text-sky-200">
                    💡 Positive NDWI confirms water impoundment behind check dams.
                  </div>
                </div>
              </div>

              {/* 🛰️ PlanetScope 3m Daily */}
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 dark:bg-purple-950/20 space-y-2">
                <div className="flex items-center gap-2 border-b border-purple-500/20 pb-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 text-white text-xs font-bold">
                    🛰️
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950 dark:text-purple-300">
                      PlanetScope 3m Daily
                    </h4>
                    <p className="text-[10px] text-purple-700 dark:text-purple-400 font-mono">
                      Daily High-Res Dove Satellite Grid
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded border-2 border-[#9333ea] bg-purple-500/30 inline-block shrink-0" />
                      <span className="font-semibold text-[11px]">Purple Boundary</span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      3m x 3m Grid Frame
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-[#16a34a] inline-block shrink-0" />
                      <span className="font-semibold text-[11px]">Green Grid Pixel</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Vegetation Cell (3m)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-background/80 p-1.5 rounded border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-[#0284c7] inline-block shrink-0" />
                      <span className="font-semibold text-[11px]">Blue Grid Pixel</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                      Water Body Cell (3m)
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-800 dark:text-purple-200">
                    🛰️ 3-Meter daily resolution tracks micro-structures & small check dams.
                  </div>
                </div>
              </div>
            </div>

            {/* 📸 Field Markers & Viewshed Cones Reference */}
            <div className="rounded-lg border border-border bg-card p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2 font-bold text-navy dark:text-slate-200">
                <Camera className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Field Pins & Viewshed Cones:</span>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 text-[11px]">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800 shrink-0" />
                  🟢 Verified Structure
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-800 shrink-0" />
                  🟡 Needs Review
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-800 shrink-0" />
                  🔴 Spatial Discrepancy
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  📐 Shaded Cone = Field Photo Viewshed / Camera FOV
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Select Project / Zone">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Watershed Register (FastAPI PostGIS)
            </label>
            <select
              value={selectedWsId}
              onChange={(e) => setSelectedWsId(e.target.value)}
              className="w-full rounded-md border border-indigo-500/40 bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              {watersheds.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.status === "VERIFIED" ? "🟢 VERIFIED" : w.status === "NEEDS_REVIEW" ? "🟡 NEEDS REVIEW" : "🔴 DISCREPANCY"} — {w.project_code} ({w.village})
                </option>
              ))}
            </select>
          </SectionCard>

          <SectionCard title="Layer Controls">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Project Locations
            </p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary/60"
                >
                  <input
                    type="checkbox"
                    checked={active.includes(s)}
                    onChange={() => toggle(s)}
                    className="accent-navy"
                  />
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      s === "verified" ? "bg-verified" : s === "review" ? "bg-review" : "bg-flagged",
                    )}
                  />
                  {STATUS_LABEL[s]}
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary/60">
                <input
                  type="checkbox"
                  checked={vegetation}
                  onChange={() => setVegetation((v) => !v)}
                  className="accent-navy"
                />
                Satellite / Vegetation layer
              </label>
            </div>
          </SectionCard>

          <SectionCard title="Selected Project Details">
            {selectedWs ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Project Code</span>
                  <p className="font-bold text-base text-navy">{selectedWs.project_code}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</span>
                  <p className="font-medium text-foreground">{selectedWs.village}, {selectedWs.district}</p>
                  <p className="text-xs text-muted-foreground">{selectedWs.state}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Coordinates</span>
                  <p className="font-mono text-xs text-foreground">
                    {selectedWs.center?.[0]?.toFixed(4)}° N, {selectedWs.center?.[1]?.toFixed(4)}° E
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Multispectral Indices</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded text-center">
                      <span className="text-[10px] block text-emerald-800 dark:text-emerald-300 font-semibold">AVG NDVI</span>
                      <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{selectedWs.avg_ndvi}</span>
                    </div>
                    <div className="bg-sky-500/10 border border-sky-500/30 p-2 rounded text-center">
                      <span className="text-[10px] block text-sky-800 dark:text-sky-300 font-semibold">AVG NDWI</span>
                      <span className="text-sm font-extrabold text-sky-700 dark:text-sky-400">{selectedWs.avg_ndwi}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 block">Verification Status</span>
                  {selectedWs.status === "VERIFIED" && (
                    <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 font-bold text-xs">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>🟢 VERIFIED — Satellite match</span>
                    </div>
                  )}
                  {selectedWs.status === "NEEDS_REVIEW" && (
                    <div className="flex items-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-100 font-bold text-xs">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>🟡 NEEDS REVIEW — Moderate match</span>
                    </div>
                  )}
                  {((selectedWs.status as string) === "SPATIAL_DISCREPANCY_FLAG" || (selectedWs.status as string) === "NOT_VERIFIED") && (
                    <div className="flex items-center gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-100 font-bold text-xs">
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>🔴 SPATIAL DISCREPANCY — Flagged</span>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedMock ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-navy">{selectedMock.code}</p>
                <p className="text-muted-foreground">
                  {selectedMock.village}, {selectedMock.district}, {selectedMock.state}
                </p>
                <p>{selectedMock.structure}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedMock.lat.toFixed(4)}° N, {selectedMock.lng.toFixed(4)}° E
                </p>
                <StatusBadge status={selectedMock.status} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a project from the dropdown or click a marker on the map.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
