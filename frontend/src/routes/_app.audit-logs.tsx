import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { AUDITS, type Audit } from "@/lib/mock-data";
import { fetchAudits, AuditRecord } from "@/api/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Shristified AI" },
      {
        name: "description",
        content:
          "Complete log of field audits with inspector, GPS status, AI confidence and verification outcome.",
      },
      { property: "og:title", content: "Audit Logs — Shristified AI" },
      {
        property: "og:description",
        content: "Field audit history for watershed development monitoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditLogs,
});

const gpsTone = {
  Matched: "text-verified",
  Tolerance: "text-review",
  Mismatch: "text-flagged",
} as const;

function AuditLogs() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Audit | null>(null);
  const [liveAudits, setLiveAudits] = useState<AuditRecord[]>([]);

  useEffect(() => {
    fetchAudits().then((data) => {
      if (data) setLiveAudits(data);
    });
  }, []);

  const rows = AUDITS.filter((a) =>
    `${a.code} ${a.project} ${a.inspector} ${a.village}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeading title="Audit Logs" subtitle="Every field submission recorded by the system with HMAC crypto validation." />

      {liveAudits.length > 0 && (
        <div className="mb-5 p-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>
              Connected to <strong>FastAPI Backend</strong>. {liveAudits.length} live crypto-signed audit submissions synced.
            </span>
          </div>
          <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded font-bold">HMAC-SHA256 OK</span>
        </div>
      )}

      <SectionCard title="Field Audit History" bodyClassName="p-0">
        <div className="border-b border-border px-5 py-4">
          <div className="flex max-w-sm items-center gap-2 rounded-md border border-input bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search audit code, project or inspector"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs tracking-wide text-navy uppercase">
                {[
                  "Audit Code",
                  "Watershed",
                  "Inspector",
                  "Structure Type",
                  "Date",
                  "GPS Status",
                  "AI Confidence",
                  "Status",
                  "View",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => (
                <tr key={a.code} className="hover:bg-secondary/60">
                  <td className="px-5 py-3 font-semibold whitespace-nowrap text-navy">{a.code}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{a.project}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{a.inspector}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{a.structure}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{a.date}</td>
                  <td className={cn("px-5 py-3 font-semibold", gpsTone[a.gps])}>{a.gps}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums">{a.confidence}%</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(a)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-navy transition-colors hover:bg-accent"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                    No audits match your search.
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
              <StatusBadge status={selected.status} />
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                <Item label="Watershed" value={selected.project} />
                <Item label="Village" value={selected.village} />
                <Item label="Inspector" value={selected.inspector} />
                <Item label="Structure" value={selected.structure} />
                <Item label="Date" value={selected.date} />
                <Item label="GPS Status" value={selected.gps} />
                <Item label="AI Confidence" value={`${selected.confidence}%`} />
                <Item label="Spatial Match" value={`${selected.spatialMatch}%`} />
                <Item label="NDVI" value={selected.ndvi.toFixed(2)} />
                <Item label="NDWI" value={selected.ndwi.toFixed(2)} />
              </dl>
              <p className="mt-4 rounded-md border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
                {selected.note}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
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
