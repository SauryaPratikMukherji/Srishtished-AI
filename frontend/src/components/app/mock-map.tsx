import { useState } from "react";
import { MapPin, Satellite, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECTS, STATUS_LABEL, type Project, type Status } from "@/lib/mock-data";
import { STATUS_DOT } from "./status-badge";

const pinColor: Record<Status, string> = {
  verified: "bg-verified",
  review: "bg-review",
  flagged: "bg-flagged",
};

export function MockMap({
  projects = PROJECTS,
  height = "h-[420px]",
  showVegetation = true,
  onSelect,
}: {
  projects?: Project[];
  height?: string;
  showVegetation?: boolean;
  onSelect?: (p: Project) => void;
}) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div
      className={cn(
        "map-canvas relative w-full overflow-hidden rounded-md border border-border",
        height,
      )}
    >
      {!showVegetation && <div className="absolute inset-0 bg-background/70" />}

      {/* scale + attribution chrome */}
      <div className="absolute top-3 left-3 z-20 rounded border border-border bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-card">
        <span className="inline-flex items-center gap-1.5">
          <Satellite className="h-3.5 w-3.5" />
          Sentinel-2 composite · 10 m
        </span>
      </div>
      <div className="absolute right-3 bottom-3 z-20 rounded border border-border bg-card/90 px-2 py-1 text-[10px] text-muted-foreground">
        Simulated GIS view · EPSG:4326
      </div>
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 text-[10px] text-navy">
        <span className="h-2 w-14 border-2 border-t-0 border-navy/70" />
        50 km
      </div>

      {projects.map((p) => (
        <button
          key={p.code}
          type="button"
          onClick={() => {
            setActive(active?.code === p.code ? null : p);
            onSelect?.(p);
          }}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${p.code} ${STATUS_LABEL[p.status]}`}
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-raised",
              pinColor[p.status],
            )}
          >
            <MapPin className="h-4 w-4 text-white" />
          </span>
        </button>
      ))}

      {active ? (
        <div
          style={{
            left: `min(max(${active.x}%, 12rem), calc(100% - 2rem))`,
            top: `${active.y}%`,
          }}
          className="absolute z-30 w-64 -translate-x-full -translate-y-[calc(100%+2.25rem)] rounded-md border border-border bg-card p-3 shadow-raised"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-navy">{active.code}</p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <dl className="mt-2 space-y-1 text-xs">
            <Row label="Village" value={active.village} />
            <Row label="District" value={active.district} />
            <Row label="Structure" value={active.structure} />
            <Row label="Last Audit" value={active.lastAudit} />
          </dl>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
            <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[active.status])} />
            {STATUS_LABEL[active.status]}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function MapLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-xs", className)}>
      {(["verified", "review", "flagged"] as Status[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[s])} />
          {STATUS_LABEL[s]}
        </span>
      ))}
    </div>
  );
}
