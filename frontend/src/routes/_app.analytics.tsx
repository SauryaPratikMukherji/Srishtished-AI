import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldAlert } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { RISKS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Impact — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Impact of JALPRAMAAN on watershed audit cycle time, accuracy, cost and resource allocation.",
      },
      { property: "og:title", content: "Analytics & Impact — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Comparison of traditional watershed auditing with AI-assisted validation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

const UTILIZATION = [
  { name: "Passive Auditing", value: 92, fill: "var(--navy)" },
  { name: "Active Spatial Analytics", value: 8, fill: "var(--verified)" },
];

const ALLOCATION = [
  { name: "Targeted Restoration", value: 50, fill: "var(--verified)" },
  { name: "Preventive Repair", value: 30, fill: "var(--review)" },
  { name: "Automated Audits", value: 20, fill: "var(--navy)" },
];

const COMPARISON = [
  { metric: "Cycle Time", traditional: "45 Days", ours: "Under 15 Minutes" },
  { metric: "Accuracy", traditional: "Variable", ours: "88% Spatially Validated" },
  { metric: "Cost", traditional: "High", ours: "90% Lower" },
];

function Analytics() {
  return (
    <div>
      <PageHeading
        title="Analytics / Impact"
        subtitle="How geo-photo verification changes watershed monitoring outcomes."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Geo-Photo Utilization">
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={UTILIZATION}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {UTILIZATION.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3">
              {UTILIZATION.map((d) => (
                <li key={d.name}>
                  <div className="flex items-center justify-between text-sm font-semibold text-navy">
                    <span>{d.name}</span>
                    <span className="tabular-nums">{d.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.value}%`, background: d.fill }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Resource Allocation">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={82}
                  paddingAngle={2}
                >
                  {ALLOCATION.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        className="mt-5"
        title="Traditional Process vs JALPRAMAAN"
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs tracking-wide text-navy uppercase">
                <th className="px-5 py-3 font-bold">Metric</th>
                <th className="px-5 py-3 font-bold">Traditional Process</th>
                <th className="bg-navy px-5 py-3 font-bold text-white">JALPRAMAAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON.map((r) => (
                <tr key={r.metric}>
                  <td className="px-5 py-3.5 font-semibold text-navy">{r.metric}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.traditional}</td>
                  <td className="bg-verified-soft px-5 py-3.5 font-bold text-verified">{r.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard className="mt-5" title="Risk Mitigation">
        <div className="grid gap-4 md:grid-cols-2">
          {RISKS.map((r) => (
            <div key={r.title} className="rounded-md border border-border p-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-navy">
                <ShieldAlert className="h-4 w-4 text-review" />
                {r.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Risk: </span>
                {r.risk}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-verified">Mitigation: </span>
                {r.mitigation}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
