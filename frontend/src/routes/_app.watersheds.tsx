import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import {
  PROJECTS,
  STATES,
  STRUCTURE_TYPES,
  STATUS_LABEL,
  type Project,
  type Status,
} from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/watersheds")({
  head: () => ({
    meta: [
      { title: "Watersheds — Shristified AI" },
      {
        name: "description",
        content:
          "Browse watershed development projects with village, district, structure type and verification status.",
      },
      { property: "og:title", content: "Watersheds — Shristified AI" },
      {
        property: "og:description",
        content: "Searchable register of watershed development projects and their audit status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Watersheds,
});

const selectCls =
  "rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40";

function Watersheds() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("all");
  const [district, setDistrict] = useState("all");
  const [status, setStatus] = useState("all");
  const [structure, setStructure] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const districts = useMemo(
    () =>
      Array.from(
        new Set(
          PROJECTS.filter((p) => state === "all" || p.state === state).map((p) => p.district),
        ),
      ).sort(),
    [state],
  );

  const rows = PROJECTS.filter((p) => {
    const text = `${p.code} ${p.village} ${p.district}`.toLowerCase();
    return (
      text.includes(q.toLowerCase()) &&
      (state === "all" || p.state === state) &&
      (district === "all" || p.district === district) &&
      (status === "all" || p.status === status) &&
      (structure === "all" || p.structure === structure)
    );
  });

  return (
    <div>
      <PageHeading
        title="Watersheds / Projects"
        subtitle="Register of watershed development structures under monitoring."
      />

      <SectionCard title="Project Register" bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border border-input bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search project code or village"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
          <select
            className={selectCls}
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict("all");
            }}
          >
            <option value="all">All States</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className={selectCls}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {(["verified", "review", "flagged"] as Status[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
          >
            <option value="all">All Structures</option>
            {STRUCTURE_TYPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs tracking-wide text-navy uppercase">
                {[
                  "Project Code",
                  "Village",
                  "District",
                  "State",
                  "Structure Type",
                  "Status",
                  "Last Audit",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr
                  key={p.code}
                  className="cursor-pointer hover:bg-secondary/60"
                  onClick={() => setSelected(p)}
                >
                  <td className="px-5 py-3 font-semibold whitespace-nowrap text-navy">{p.code}</td>
                  <td className="px-5 py-3">{p.village}</td>
                  <td className="px-5 py-3">{p.district}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{p.state}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{p.structure}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">{p.lastAudit}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold text-navy underline-offset-2 hover:underline">
                      View
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    No projects match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-navy">{selected?.code}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div>
              <div
                className={`rounded-md border p-3 text-sm font-semibold ${
                  selected.status === "verified"
                    ? "border-verified/25 bg-verified-soft text-verified"
                    : selected.status === "review"
                      ? "border-review/30 bg-review-soft text-review"
                      : "border-flagged/25 bg-flagged-soft text-flagged"
                }`}
              >
                Current Status: {STATUS_LABEL[selected.status]}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                <Detail label="Village" value={selected.village} />
                <Detail label="District" value={selected.district} />
                <Detail label="State" value={selected.state} />
                <Detail label="Structure Type" value={selected.structure} />
                <Detail label="Structure Count" value={String(selected.structureCount)} />
                <Detail label="Last Audit" value={selected.lastAudit} />
                <Detail label="NDVI" value={selected.ndvi.toFixed(2)} />
                <Detail label="NDWI" value={selected.ndwi.toFixed(2)} />
                <Detail label="Inspector" value={selected.inspector} />
                <Detail
                  label="Coordinates"
                  value={`${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`}
                />
              </dl>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
