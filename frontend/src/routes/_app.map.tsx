import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Layers, Map as MapIcon, Globe } from "lucide-react";
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
      { title: "Map & GIS — Shristified AI" },
      {
        name: "description",
        content:
          "Geospatial view of watershed projects with status filters, layer controls and project popups.",
      },
      { property: "og:title", content: "Map & GIS — Shristified AI" },
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
  const [selected, setSelected] = useState<Project | null>(null);
  const [mapMode, setMapMode] = useState<"leaflet" | "overview">("leaflet");

  const [watersheds, setWatersheds] = useState<Watershed[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);

  useEffect(() => {
    fetchWatersheds().then((data) => {
      if (data) setWatersheds(data);
    });
    fetchAudits().then((data) => {
      if (data) setAudits(data);
    });
  }, []);

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
          subtitle="Spatial view of watershed structures under monitoring with live Sentinel-2 NDVI/NDWI layers."
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

      <div className="grid gap-5 xl:grid-cols-[1fr_18rem]">
        <SectionCard title="Watershed GIS View" action={<MapLegend className="hidden md:flex" />}>
          {mapMode === "leaflet" ? (
            <GisMap
              watersheds={watersheds}
              audits={audits}
              selectedWatershedId={watersheds[0]?.id}
              height="h-[580px]"
            />
          ) : (
            <MockMap
              projects={projects}
              height="h-[580px]"
              showVegetation={vegetation}
              onSelect={setSelected}
            />
          )}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Search Project">
            <div className="flex items-center gap-2 rounded-md border border-input bg-card px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Project code or village"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
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

          <SectionCard title="Selected Project">
            {selected ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-navy">{selected.code}</p>
                <p className="text-muted-foreground">
                  {selected.village}, {selected.district}, {selected.state}
                </p>
                <p>{selected.structure}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.lat.toFixed(4)}° N, {selected.lng.toFixed(4)}° E
                </p>
                <StatusBadge status={selected.status} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a marker on the map to view project information.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
