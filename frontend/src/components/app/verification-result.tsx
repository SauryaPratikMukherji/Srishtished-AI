import { CheckCircle2, AlertTriangle, XCircle, Map as MapIcon, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mock-data";

export interface VerificationData {
  status: Status;
  project: string;
  structure: string;
  gps: string;
  expected: string;
  distance: string;
  ndvi: number;
  ndwi: number;
  confidence: number;
  spatialMatch: number;
}

const config = {
  verified: {
    title: "VERIFIED",
    icon: CheckCircle2,
    text: "Ground photo location matches satellite NDVI vegetation signature.",
    cls: "border-verified/30 bg-verified-soft text-verified",
  },
  review: {
    title: "NEEDS REVIEW",
    icon: AlertTriangle,
    text: "Evidence is partially consistent. Manual verification is recommended.",
    cls: "border-review/35 bg-review-soft text-review",
  },
  flagged: {
    title: "FLAGGED — SPATIAL DISCREPANCY",
    icon: XCircle,
    text: "Location mismatch detected between the submitted ground photograph and the expected project location.",
    cls: "border-flagged/30 bg-flagged-soft text-flagged",
  },
} as const;

export function VerificationResult({ data }: { data: VerificationData }) {
  const c = config[data.status];
  const Icon = c.icon;

  return (
    <div>
      <div className={cn("flex items-start gap-4 rounded-md border p-5", c.cls)}>
        <Icon className="h-10 w-10 shrink-0" />
        <div>
          <p className="text-lg font-bold tracking-wide">{c.title}</p>
          <p className="mt-1 text-sm font-medium opacity-90">{c.text}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="AI Structure Detection" value={`${data.confidence}%`} pct={data.confidence} />
        <Metric label="Spatial Match" value={`${data.spatialMatch}%`} pct={data.spatialMatch} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 rounded-md border border-border bg-secondary/50 p-4 text-sm sm:grid-cols-3">
        <Item label="Project" value={data.project} />
        <Item label="Structure Detected" value={data.structure} />
        <Item label="GPS Coordinates" value={data.gps} />
        <Item label="Expected Coordinates" value={data.expected} />
        <Item label="Distance Difference" value={data.distance} />
        <Item label="NDVI" value={data.ndvi.toFixed(2)} />
        <Item label="NDWI" value={data.ndwi.toFixed(2)} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/map"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
        >
          <MapIcon className="h-4 w-4" /> View on Map
        </Link>
        <Link
          to="/watersheds"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-accent"
        >
          <FileText className="h-4 w-4" /> View Project Details
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value, pct }: { label: string; value: string; pct: number }) {
  const tone = pct >= 85 ? "bg-verified" : pct >= 60 ? "bg-review" : "bg-flagged";
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-lg font-bold text-navy tabular-nums">{value}</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-700", tone)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
