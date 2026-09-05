import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText, Download, CheckCircle2, AlertTriangle, Flag } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatCard } from "@/components/app/stat-card";
import { REPORTS, DASHBOARD_STATS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Generate and export audit reports for district administration and national watershed databases.",
      },
      { property: "og:title", content: "Reports — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Generated watershed monitoring reports for the Department of Rural Development.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <div>
      <PageHeading
        title="Reports"
        subtitle="Consolidated verification reports across districts and structure types."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reports Generated" value={REPORTS.length} icon={FileText} tone="navy" />
        <StatCard
          label="Verified Projects"
          value={DASHBOARD_STATS.verified}
          icon={CheckCircle2}
          tone="verified"
        />
        <StatCard
          label="Needs Review"
          value={DASHBOARD_STATS.review}
          icon={AlertTriangle}
          tone="review"
        />
        <StatCard label="Flagged" value={DASHBOARD_STATS.flagged} icon={Flag} tone="flagged" />
      </div>

      <SectionCard className="mt-5" title="Available Reports" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs tracking-wide text-navy uppercase">
                {["Report ID", "Title", "Coverage", "Period", "Generated On", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 font-bold whitespace-nowrap">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REPORTS.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/60">
                  <td className="px-5 py-3 font-semibold whitespace-nowrap text-navy">{r.id}</td>
                  <td className="px-5 py-3">{r.title}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{(r as any).coverage || r.type}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{r.period}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{r.generated}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toast.info(`Opening ${r.id} — ${r.title}`)}
                        className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-navy transition-colors hover:bg-accent"
                      >
                        View Report
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.success("Report download started", { description: `${r.id}.pdf` })
                        }
                        className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
