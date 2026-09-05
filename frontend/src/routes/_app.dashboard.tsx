import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, CheckCircle2, AlertTriangle, XCircle, Camera } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatCard } from "@/components/app/stat-card";
import { MockMap, MapLegend } from "@/components/app/mock-map";
import { StatusBadge } from "@/components/app/status-badge";
import { AUDITS, DASHBOARD_STATS, PROJECTS } from "@/lib/mock-data";
import { greeting, ROLE_NAME, useRole } from "@/lib/session";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — JALPRAMAAN" },
      {
        name: "description",
        content:
          "High-level monitoring metrics, site verification progress, and flagged project overview.",
      },
      { property: "og:title", content: "Dashboard — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Watershed project statistics, monitoring map and recent field audits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const role = useRole();

  return (
    <div>
      <PageHeading
        title={`${greeting()}, ${ROLE_NAME[role]}`}
        subtitle="Monitor watershed projects, field audits and geospatial validation from one place."
        action={
          <Link
            to="/field-audits"
            className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
          >
            New Field Audit
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={DASHBOARD_STATS.total}
          hint="Across 6 states"
          icon={Layers}
          tone="navy"
        />
        <StatCard
          label="Verified"
          value={DASHBOARD_STATS.verified}
          hint="78% of all projects"
          icon={CheckCircle2}
          tone="verified"
        />
        <StatCard
          label="Needs Review"
          value={DASHBOARD_STATS.review}
          hint="Awaiting manual check"
          icon={AlertTriangle}
          tone="review"
        />
        <StatCard
          label="Flagged"
          value={DASHBOARD_STATS.flagged}
          hint="Spatial discrepancy"
          icon={XCircle}
          tone="flagged"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Watershed Monitoring Map"
          subtitle="Project locations by verification status"
          action={<MapLegend className="hidden md:flex" />}
        >
          <MockMap projects={PROJECTS} height="h-[420px]" />
          <MapLegend className="mt-3 md:hidden" />
          <p className="mt-3 text-xs text-muted-foreground">
            Select a marker to view project details. Simulated GIS layer for demonstration.
          </p>
        </SectionCard>

        <SectionCard
          title="Recent Audits"
          subtitle="Latest field submissions"
          bodyClassName="p-0"
          action={
            <Link to="/audit-logs" className="text-xs font-semibold text-navy hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {AUDITS.slice(0, 6).map((a) => (
              <li key={a.code} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/60">
                <span className="map-canvas flex h-11 w-14 shrink-0 items-center justify-center rounded border border-border">
                  <Camera className="h-4 w-4 text-navy/70" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{a.code}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.structure} · {a.date}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
