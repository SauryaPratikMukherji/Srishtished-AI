import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Camera, MapPin } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { AUDITS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ai-analysis")({
  head: () => ({
    meta: [
      { title: "AI Analysis — Shristified AI" },
      {
        name: "description",
        content:
          "Structure detection confidence, spatial match and satellite indices for submitted field photographs.",
      },
      { property: "og:title", content: "AI Analysis — Shristified AI" },
      {
        property: "og:description",
        content: "Simulated AI structure detection results for watershed field evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAnalysis,
});

function AiAnalysis() {
  const [code, setCode] = useState(AUDITS[0]?.code || "AUD-ANTP-001");
  const a = (AUDITS.find((x) => x.code === code) || AUDITS[0])!;

  return (
    <div>
      <PageHeading
        title="AI Analysis"
        subtitle="Structure detection results for submitted field photographs."
      />

      <div className="grid gap-5 xl:grid-cols-[20rem_1fr]">
        <SectionCard title="Submissions" bodyClassName="p-0">
          <ul className="max-h-[560px] divide-y divide-border overflow-y-auto">
            {AUDITS.map((x) => (
              <li key={x.code}>
                <button
                  type="button"
                  onClick={() => setCode(x.code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/60",
                    x.code === code && "bg-secondary",
                  )}
                >
                  <span className="map-canvas flex h-10 w-12 shrink-0 items-center justify-center rounded border border-border">
                    <Camera className="h-4 w-4 text-navy/70" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">{x.code}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {x.structure}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      x.status === "verified"
                        ? "bg-verified"
                        : x.status === "review"
                          ? "bg-review"
                          : "bg-flagged",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard title="Uploaded Image">
              <div className="map-canvas flex h-56 items-center justify-center rounded-md border border-border">
                <div className="rounded-md bg-card/85 px-4 py-3 text-center">
                  <Camera className="mx-auto h-6 w-6 text-navy/70" />
                  <p className="mt-1 text-xs font-semibold text-navy">
                    {a.code}_field_capture.jpg
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Detection box: {a.structure}
                  </p>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Captured by {a.inspector} · {a.date}
              </p>
            </SectionCard>

            <SectionCard title="Detection Summary">
              <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                <Item label="Structure" value={a.structure} />
                <Item label="Detection Status" value={a.confidence >= 60 ? "Detected" : "Uncertain"} />
                <Item label="GPS Coordinates" value={`${a.gps} · ${a.village}`} />
                <Item label="NDVI" value={a.ndvi.toFixed(2)} />
                <Item label="NDWI" value={a.ndwi.toFixed(2)} />
                <Item label="Spatial Match" value={`${a.spatialMatch}%`} />
              </dl>
              <div className="mt-4">
                <StatusBadge status={a.status} />
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Confidence Indicators">
            <div className="grid gap-4 sm:grid-cols-2">
              <Bar label="Detection Confidence" pct={a.confidence} />
              <Bar label="Spatial Match" pct={a.spatialMatch} />
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-md border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
              <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-navy/70" />
              {a.note}
            </p>
          </SectionCard>
        </div>
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

function Bar({ label, pct }: { label: string; pct: number }) {
  const tone = pct >= 85 ? "bg-verified" : pct >= 60 ? "bg-review" : "bg-flagged";
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-lg font-bold text-navy tabular-nums">{pct}%</p>
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
