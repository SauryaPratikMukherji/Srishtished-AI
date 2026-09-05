import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, BrainCircuit, Satellite, ShieldCheck, ArrowDown } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { AUDITS, PROJECTS, STATUS_LABEL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/validation")({
  head: () => ({
    meta: [
      { title: "Validation — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Geospatial and dual-AI validation matrix combining structure detection with satellite indices.",
      },
      { property: "og:title", content: "Validation — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Ground evidence, GPS, AI detection and satellite cross-check workflow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Validation,
});

function Validation() {
  const [code, setCode] = useState(PROJECTS[0]?.code || "WS-ANTP-001");
  const p = (PROJECTS.find((x) => x.code === code) || PROJECTS[0])!;
  const audit = AUDITS.find((a) => a.project === p.code);

  const stages = [
    {
      icon: Camera,
      title: "Ground Evidence",
      detail: audit ? `${audit.code} · ${audit.date}` : "No submission on record",
      ok: !!audit,
    },
    {
      icon: MapPin,
      title: "GPS Validation",
      detail: audit ? `GPS ${audit.gps}` : "Pending",
      ok: audit?.gps === "Matched",
      warn: audit?.gps === "Tolerance",
    },
    {
      icon: BrainCircuit,
      title: "AI Structure Detection",
      detail: audit ? `${audit.confidence}% confidence · ${p.structure}` : "Pending",
      ok: (audit?.confidence ?? 0) >= 85,
      warn: (audit?.confidence ?? 0) >= 60 && (audit?.confidence ?? 0) < 85,
    },
    {
      icon: Satellite,
      title: "Satellite Cross-Check",
      detail: `NDVI ${p.ndvi.toFixed(2)} · NDWI ${p.ndwi.toFixed(2)}`,
      ok: p.ndvi >= 0.5,
      warn: p.ndvi >= 0.3 && p.ndvi < 0.5,
    },
    {
      icon: ShieldCheck,
      title: "Final Verification",
      detail: STATUS_LABEL[p.status],
      ok: p.status === "verified",
      warn: p.status === "review",
    },
  ];

  return (
    <div>
      <PageHeading
        title="Validation"
        subtitle="Stage-by-stage cross-validation of submitted watershed evidence."
        action={
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          >
            {PROJECTS.map((x) => (
              <option key={x.code} value={x.code}>
                {x.code} — {x.village}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <SectionCard title="Validation Workflow">
          <ol className="space-y-1">
            {stages.map((s, i) => {
              const tone = s.ok
                ? "border-verified/30 bg-verified-soft text-verified"
                : s.warn
                  ? "border-review/35 bg-review-soft text-review"
                  : "border-flagged/30 bg-flagged-soft text-flagged";
              const Icon = s.icon;
              return (
                <li key={s.title}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-4 py-3.5 transition-colors",
                      tone,
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{s.title}</p>
                      <p className="text-xs opacity-85">{s.detail}</p>
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </SectionCard>

        <SectionCard title="Project Summary">
          <dl className="space-y-3 text-sm">
            <Row label="Project" value={p.code} />
            <Row label="Village" value={p.village} />
            <Row label="District" value={`${p.district}, ${p.state}`} />
            <Row label="Structure" value={p.structure} />
            <Row label="Inspector" value={p.inspector} />
            <Row label="Last Audit" value={p.lastAudit} />
          </dl>
          <div className="mt-4">
            <StatusBadge status={p.status} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
