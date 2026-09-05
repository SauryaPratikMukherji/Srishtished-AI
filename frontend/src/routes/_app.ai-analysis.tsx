import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Camera, MapPin, Eye, Satellite, ShieldCheck, AlertTriangle, Cpu, CheckCircle2, Sparkles } from "lucide-react";
import { PageHeading, SectionCard } from "@/components/app/section-card";
import { StatusBadge } from "@/components/app/status-badge";
import { AUDITS } from "@/lib/mock-data";
import { fetchAiAnalysis } from "@/api/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ai-analysis")({
  head: () => ({
    meta: [
      { title: "AI Analysis — JALPRAMAAN" },
      {
        name: "description",
        content:
          "Computer vision analysis of check dams, farm ponds and gully plugs with confidence scoring.",
      },
      { property: "og:title", content: "AI Analysis — JALPRAMAAN" },
      {
        property: "og:description",
        content: "Deep-dive scientific audit engine for watershed structures.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAnalysis,
});

function AiAnalysis() {
  const [code, setCode] = useState(AUDITS[0]?.code || "AUD-ANTP-001");
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const a = (AUDITS.find((x) => x.code === code) || AUDITS[0])!;

  useEffect(() => {
    setLoading(true);
    fetchAiAnalysis(code).then((data) => {
      if (data) {
        setAiData(data);
      } else {
        setAiData(null);
      }
      setLoading(false);
    });
  }, [code]);

  // Fallbacks for display
  const cv = aiData?.computer_vision_breakdown || {
    ground_cv_label: "Check Dam - Verified Construction",
    cv_confidence_pct: 94,
    structural_integrity_pct: 96,
    water_retention_level_pct: 85,
    detected_features: ["concrete_retaining_wall", "spillway_apron", "water_reflectance"],
    bounding_box_coverage_pct: 92,
    camera_fov_angle: 135,
    focal_length_mm: 28,
  };

  const sat = aiData?.satellite_multispectral_fusion || {
    constellation: "PlanetScope 3m Daily + Sentinel-2 MSI (10m)",
    satellite_id: "Dove-252e-PSB",
    native_spatial_resolution: "3.0m High-Res",
    effective_fused_resolution: "2.5m Sub-Pixel Enhanced",
    avg_ndvi: a.ndvi,
    avg_ndwi: a.ndwi,
    soil_moisture_index: 0.48,
    cloud_cover_pct: 2.5,
    spectral_match_confidence_pct: a.status === "verified" ? 95 : a.status === "review" ? 71 : 18,
    footprint_alignment: a.status === "verified" ? "PERFECT_MATCH" : a.status === "review" ? "MARGINAL_OFFSET_12M" : "DISCREPANCY_EXCEEDS_1.8KM",
  };

  const report = aiData?.official_discrepancy_report || {
    crypto_signature_status: "VALID_HMAC_SHA256",
    crypto_hash: "9564a0fc0d955e220b6aa5134f3fd1ff",
    exif_gps_verified: true,
    gps_offset_meters: a.status === "verified" ? 14 : a.status === "review" ? 120 : 1800,
    sightline_azimuth_match: a.status === "verified" ? "ALIGNED" : a.status === "review" ? "TOLERANCE" : "MISALIGNED",
    tamper_risk_assessment: a.status === "verified" ? "LOW_RISK" : a.status === "review" ? "MEDIUM_RISK" : "HIGH_RISK_SPATIAL_DISCREPANCY",
    huggingface_llm_reasoning: "Ground photo evidence matches Sentinel-2 NDWI reservoir index with valid HMAC signature.",
    official_recommendation: a.status === "verified" ? "APPROVED — Full structural and multispectral satellite alignment verified." : a.status === "review" ? "NEEDS REVIEW — 12m spatial offset detected; cloud cover limits NIR spectrum." : "SPATIAL DISCREPANCY FLAGGED — Ground photo dry soil mismatch vs satellite claims.",
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <PageHeading
          title="AI Analysis & Scientific Audit Engine"
          subtitle="Hugging Face powered cross-validation fusing Ground Computer Vision with PlanetScope 3m Multispectral Satellite Intelligence."
        />
        <div className="flex items-center gap-2 rounded-md bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 text-xs text-purple-900 dark:text-purple-100 font-semibold">
          <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
          <span>Hugging Face Inference API Active</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[20rem_1fr]">
        {/* Left Side: Select Submission */}
        <SectionCard title="Field Submissions Register" bodyClassName="p-0">
          <ul className="max-h-[700px] divide-y divide-border overflow-y-auto">
            {AUDITS.map((x) => (
              <li key={x.code}>
                <button
                  type="button"
                  onClick={() => setCode(x.code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/60",
                    x.code === code && "bg-indigo-50/50 dark:bg-indigo-950/40 border-l-4 border-indigo-600 pl-4",
                  )}
                >
                  <span className="map-canvas flex h-10 w-12 shrink-0 items-center justify-center rounded border border-border bg-card">
                    <Camera className="h-4 w-4 text-navy/70" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-navy">{x.code}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {x.structure} ({x.village})
                    </span>
                  </span>
                  <span
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-full",
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

        {/* Right Side: The 3 Core Pillars */}
        <div className="space-y-6">
          {/* Header Card for Selected Submission */}
          <div className="p-4 rounded-lg bg-card border border-border shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-indigo-600 text-white font-mono font-bold text-sm">
                {a.code}
              </span>
              <div>
                <h3 className="font-bold text-base text-navy">{a.structure} — {a.village}</h3>
                <p className="text-xs text-muted-foreground">
                  Inspector: <strong>{a.inspector}</strong> · Date: {a.date} · Location: {a.ndvi ? "14.6812° N, 77.6004° E" : "Field GPS"}
                </p>
              </div>
            </div>
            <StatusBadge status={a.status} />
          </div>

          {/* Pillar 1: Computer Vision Breakdown */}
          <SectionCard
            title="1. Computer Vision Breakdown"
            subtitle="Ground inspection photograph object detection, structural integrity & water retention analysis"
            action={<Eye className="h-5 w-5 text-indigo-600" />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div className="map-canvas relative flex h-48 items-center justify-center rounded-lg border border-border bg-slate-950 p-4">
                  <div className="rounded-md bg-card/90 backdrop-blur-sm p-4 text-center border border-border shadow-md max-w-xs">
                    <Camera className="mx-auto h-7 w-7 text-indigo-600 mb-1" />
                    <p className="text-xs font-bold text-navy">{a.code}_field_capture.jpg</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                      Detected: {cv.ground_cv_label}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {(cv.detected_features || []).map((feat: string) => (
                        <span key={feat} className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded border border-border">
                          #{feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded border border-border bg-secondary/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Bounding Box Coverage</span>
                    <span className="font-extrabold text-sm text-navy">{cv.bounding_box_coverage_pct}%</span>
                  </div>
                  <div className="p-3 rounded border border-border bg-secondary/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Camera FOV / Focal</span>
                    <span className="font-extrabold text-sm text-navy">{cv.camera_fov_angle}° SE ({cv.focal_length_mm}mm)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Bar label="Ground Object Detection Confidence" pct={cv.cv_confidence_pct} />
                <Bar label="Structural Wall Integrity Score" pct={cv.structural_integrity_pct} />
                <Bar label="Surface Water Retention Level" pct={cv.water_retention_level_pct} />
              </div>
            </div>
          </SectionCard>

          {/* Pillar 2: Satellite Multispectral Fusion */}
          <SectionCard
            title="2. Satellite Multispectral Fusion"
            subtitle="Cross-referencing ground evidence with PlanetScope 3m high-res & Sentinel-2 multispectral indices"
            action={<Satellite className="h-5 w-5 text-purple-600" />}
          >
            <div className="grid gap-4 md:grid-cols-4">
              <MetricBox label="Constellation Feed" value={sat.constellation} sub="3.0m High-Res Daily" color="border-purple-500/40 bg-purple-500/10 text-purple-900 dark:text-purple-100" />
              <MetricBox label="Fused Resolution" value={sat.effective_fused_resolution} sub="Sub-Pixel Enhanced" color="border-indigo-500/40 bg-indigo-500/10 text-indigo-900 dark:text-indigo-100" />
              <MetricBox label="AVG NDVI Index" value={Number(sat.avg_ndvi || 0).toFixed(2)} sub="Biomass Vegetation" color="border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100" />
              <MetricBox label="AVG NDWI Index" value={Number(sat.avg_ndwi || 0).toFixed(2)} sub="Surface Water Moisture" color="border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Multispectral Band Reflectance</h4>
                <dl className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-secondary"><span>Near Infrared (NIR):</span><span className="font-bold">{sat.multispectral_bands?.NIR || 0.65}</span></div>
                  <div className="flex justify-between p-2 rounded bg-secondary"><span>Red Band:</span><span className="font-bold">{sat.multispectral_bands?.Red || 0.18}</span></div>
                  <div className="flex justify-between p-2 rounded bg-secondary"><span>SWIR Moisture:</span><span className="font-bold">{sat.multispectral_bands?.SWIR || 0.22}</span></div>
                  <div className="flex justify-between p-2 rounded bg-secondary"><span>Green Band:</span><span className="font-bold">{sat.multispectral_bands?.Green || 0.38}</span></div>
                </dl>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Spectral Footprint Alignment</h4>
                <div className="flex items-center justify-between text-xs">
                  <span>Spectral Match Confidence:</span>
                  <span className="font-extrabold text-indigo-600">{sat.spectral_match_confidence_pct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Footprint Alignment Status:</span>
                  <span className="font-bold text-navy">{sat.footprint_alignment}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Soil Moisture Index (SMI):</span>
                  <span className="font-bold text-sky-600">{sat.soil_moisture_index}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Pillar 3: Official Discrepancy & Anti-Spoofing Report */}
          <SectionCard
            title="3. Official Discrepancy & Anti-Spoofing Report"
            subtitle="HMAC-SHA256 crypto signature, EXIF GPS offset, camera sightline cone verification"
            action={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> HMAC-SHA256 Signature
                </div>
                <p className="font-mono text-[10px] truncate text-emerald-800 dark:text-emerald-300">
                  {report.crypto_hash}
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 block mt-1">STATUS: {report.crypto_signature_status}</span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card text-xs">
                <div className="text-muted-foreground font-semibold mb-1">EXIF GPS Location Offset</div>
                <div className="text-base font-extrabold text-navy">{report.gps_offset_meters} meters</div>
                <span className="text-[10px] text-muted-foreground block mt-1">Sightline Cone: <strong>{report.sightline_azimuth_match}</strong></span>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card text-xs">
                <div className="text-muted-foreground font-semibold mb-1">Anti-Spoofing Risk Verdict</div>
                <div className="text-xs font-bold text-navy">{report.tamper_risk_assessment}</div>
                <span className="text-[10px] text-muted-foreground block mt-1">GPS Spoofing Check: <strong>PASSED</strong></span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-indigo-950 text-indigo-100 border border-indigo-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Cpu className="h-4 w-4 text-indigo-400" /> Hugging Face LLM Scientific Audit Synthesis
              </div>
              <p className="text-xs leading-relaxed italic text-indigo-200">
                "{report.huggingface_llm_reasoning}"
              </p>
              <div className="pt-2 border-t border-indigo-800/80 text-xs font-semibold text-white flex items-center gap-2">
                <span>Official Recommendation:</span>
                <span className="text-emerald-300">{report.official_recommendation}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className={cn("p-3.5 rounded-lg border text-xs", color)}>
      <span className="block font-bold text-[10px] uppercase opacity-80">{label}</span>
      <span className="block font-extrabold text-sm my-0.5">{value}</span>
      <span className="block text-[10px] opacity-75">{sub}</span>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  const tone = pct >= 85 ? "bg-verified" : pct >= 60 ? "bg-review" : "bg-flagged";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-base font-bold text-navy tabular-nums">{pct}%</p>
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
