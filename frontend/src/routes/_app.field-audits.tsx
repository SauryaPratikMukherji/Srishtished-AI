import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, MapPin, Compass, Loader2, Check, ImageIcon, Camera } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { FieldInspectorModal } from "@/components/app/FieldInspectorModal";
import { PROJECTS, STRUCTURE_TYPES } from "@/lib/mock-data";
import {
  VerificationResult,
  type VerificationData,
} from "@/components/app/verification-result";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/field-audits")({
  head: () => ({
    meta: [
      { title: "Field Audit & Photo Upload — Shristified AI" },
      {
        name: "description",
        content:
          "Submit a geo-tagged field inspection photograph and run AI and satellite cross-validation.",
      },
      { property: "og:title", content: "Field Audit & Photo Upload — Shristified AI" },
      {
        property: "og:description",
        content: "Field inspector workflow for watershed structure verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldAudit,
});

const STEPS = [
  "Extracting photo location & HMAC crypto metadata",
  "Comparing with Sentinel-2 satellite NDWI/NDVI grid",
  "Running ground-truth structure detection CV model",
  "Structure Detected — 92% Confidence",
  "Cross-validation complete",
];

const selectCls =
  "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40";

function FieldAudit() {
  const [project, setProject] = useState(PROJECTS[0]?.code || "WS-ANTP-001");
  const [structure, setStructure] = useState<string>(STRUCTURE_TYPES[0] || "Check Dam (Concrete)");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<VerificationData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== STEPS.length) return;
    const p = PROJECTS.find((x) => x.code === project)!;
    const t = setTimeout(() => {
      setResult({
        status: p.status,
        project: `${p.code} · ${p.village}`,
        structure,
        gps: "14.6812° N, 77.6004° E",
        expected: `${p.lat.toFixed(4)}° N, ${p.lng.toFixed(4)}° E`,
        distance:
          p.status === "verified" ? "18 m" : p.status === "review" ? "240 m" : "1.8 km",
        ndvi: p.ndvi,
        ndwi: p.ndwi,
        confidence: p.status === "verified" ? 92 : p.status === "review" ? 71 : 44,
        spatialMatch: p.status === "verified" ? 96 : p.status === "review" ? 78 : 27,
      });
      setStep(-1);
    }, 500);
    return () => clearTimeout(t);
  }, [step, project, structure]);

  const onFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <PageHeading
          title="Field Audit & Photo Upload"
          subtitle="Submit geo-tagged inspection photos for automated AI structure detection and satellite cross-validation."
        />
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
        >
          <Camera className="h-4 w-4" /> Open Full Field Camera Simulator
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <SectionCard title="Field Upload Form" subtitle="Select project and upload field photograph">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Project / Village</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className={selectCls}
              >
                {PROJECTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.village} ({p.district})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Claimed Structure Type</label>
              <select
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className={selectCls}
              >
                {STRUCTURE_TYPES.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-muted-foreground">Field Photograph</label>
            <div
              onClick={() => inputRef.current?.click()}
              className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-navy/50 hover:bg-secondary/40"
            >
              {preview ? (
                <div className="space-y-2">
                  <img
                    src={preview}
                    alt="Field audit"
                    className="max-h-48 rounded-md border border-border object-cover"
                  />
                  <p className="text-xs text-muted-foreground">{fileName} · click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-7 w-7 text-navy/70" />
                  <p className="text-sm font-semibold text-navy">
                    Drag & drop field photograph here
                  </p>
                  <p className="text-xs">JPG or PNG captured from the field device</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={step >= 0}
            onClick={() => {
              setResult(null);
              setStep(0);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
          >
            {step >= 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit Field Audit
          </button>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Geo-tag Information" subtitle="Captured from field device">
            <dl className="space-y-3 text-sm">
              <GeoRow icon={MapPin} label="Latitude" value="14.6812° N" />
              <GeoRow icon={MapPin} label="Longitude" value="77.6004° E" />
              <GeoRow icon={Compass} label="Azimuth / Direction" value="128° SE" />
              <GeoRow icon={ImageIcon} label="Capture Time" value="12 Aug 2026, 09:42 IST" />
            </dl>
            <p className="mt-4 rounded-md border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
              Coordinates and compass bearing are read from photograph metadata on the inspector's
              device.
            </p>
          </SectionCard>

          {step >= 0 && (
            <SectionCard title="Processing">
              <ul className="space-y-3">
                {STEPS.map((s, i) => (
                  <li
                    key={s}
                    className={cn(
                      "flex items-center gap-2.5 text-sm transition-opacity",
                      i < step ? "text-verified" : i === step ? "text-navy" : "text-muted-foreground/50",
                    )}
                  >
                    {i < step ? (
                      <Check className="h-4 w-4" />
                    ) : i === step ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-current" />
                    )}
                    <span className="font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      </div>

      <Dialog open={!!result} onOpenChange={(o) => !o && setResult(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">Verification Result</DialogTitle>
          </DialogHeader>
          {result ? <VerificationResult data={result} /> : null}
        </DialogContent>
      </Dialog>

      <FieldInspectorModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

function GeoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
      <dt className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-navy/70" />
        {label}
      </dt>
      <dd className="font-semibold text-navy tabular-nums">{value}</dd>
    </div>
  );
}
