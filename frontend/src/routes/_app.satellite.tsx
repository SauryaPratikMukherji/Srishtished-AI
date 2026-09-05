import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Droplets, Satellite, Waves, CalendarClock } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatCard } from "@/components/app/stat-card";
import { StatusBadge } from "@/components/app/status-badge";
import { NDVI_SERIES, PROJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/satellite")({
  head: () => ({
    meta: [
      { title: "Satellite Monitoring — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Multispectral satellite intelligence, NDVI vegetation recovery and NDWI water bodies monitoring.",
      },
      { property: "og:title", content: "Satellite Monitoring — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Simulated satellite indices and time-series for watershed project sites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SatellitePage,
});

function SatellitePage() {
  const [code, setCode] = useState(PROJECTS[0]?.code || "WS-ANTP-001");
  const p = (PROJECTS.find((x) => x.code === code) || PROJECTS[0])!;
  const series = NDVI_SERIES.map((d) => ({
    ...d,
    ndvi: Number((d.ndvi * (p.ndvi / 0.62)).toFixed(2)),
    ndwi: Number((d.ndwi * (p.ndwi / 0.31)).toFixed(2)),
  }));

  return (
    <div>
      <PageHeading
        title="Satellite Monitoring"
        subtitle="Vegetation and water indicators observed over the project site."
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

      <div className="gov-card mb-5 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-bold text-navy">
            {p.code} · {p.village}, {p.district}
          </p>
          <p className="text-xs text-muted-foreground">
            {p.state} · {p.structure} · {p.lat.toFixed(4)}° N, {p.lng.toFixed(4)}° E
          </p>
        </div>
        <StatusBadge status={p.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="NDVI" value={p.ndvi.toFixed(2)} icon={Leaf} tone="verified" />
        <StatCard label="NDWI" value={p.ndwi.toFixed(2)} icon={Droplets} tone="navy" />
        <StatCard
          label="Vegetation Health"
          value={p.ndvi > 0.5 ? "Good" : p.ndvi > 0.3 ? "Moderate" : "Poor"}
          icon={Leaf}
          tone={p.ndvi > 0.5 ? "verified" : p.ndvi > 0.3 ? "review" : "flagged"}
        />
        <StatCard
          label="Water Presence"
          value={p.ndwi > 0.25 ? "Detected" : p.ndwi > 0.12 ? "Partial" : "Low"}
          icon={Waves}
          tone={p.ndwi > 0.25 ? "verified" : p.ndwi > 0.12 ? "review" : "flagged"}
        />
        <StatCard
          label="Last Observation"
          value="14 Aug 2026"
          hint="Sentinel-2 · 8% cloud"
          icon={CalendarClock}
          tone="navy"
        />
      </div>

      <SectionCard
        className="mt-5"
        title="NDVI / NDWI Time Series"
        subtitle="Six-month observation window"
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Satellite className="h-3.5 w-3.5" /> Simulated observations
          </span>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis domain={[0, 0.8]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="ndvi"
                name="NDVI"
                stroke="var(--verified)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="ndwi"
                name="NDWI"
                stroke="var(--info)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
