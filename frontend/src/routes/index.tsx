import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  Satellite,
  BrainCircuit,
  MapPin,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/shristified-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shristified AI — Watershed Development Monitoring" },
      {
        name: "description",
        content:
          "AI-powered watershed monitoring that combines geo-tagged field evidence with satellite intelligence to validate development projects.",
      },
      { property: "og:title", content: "Shristified AI — Watershed Development Monitoring" },
      {
        property: "og:description",
        content:
          "Fusing ground truth with satellite intelligence for transparent watershed development monitoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: Camera,
    title: "Ground Inspection",
    text: "Field inspectors capture geo-tagged photographs of watershed structures during site visits.",
  },
  {
    icon: MapPin,
    title: "GPS & Geospatial Data",
    text: "Coordinates, azimuth and project boundaries are compared against the reported location.",
  },
  {
    icon: Satellite,
    title: "Satellite Monitoring",
    text: "NDVI and NDWI indices describe vegetation recovery and water presence at the site.",
  },
  {
    icon: BrainCircuit,
    title: "AI Validation",
    text: "Structure detection scores the photograph and cross-checks it with satellite evidence.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="gov-topstrip h-1.5" />

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Shristified AI emblem"
              width={44}
              height={44}
              className="h-11 w-11"
            />
            <div>
              <p className="text-base font-bold text-navy">Shristified AI</p>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                Watershed Development Monitoring System
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
          >
            Login
          </Link>
        </div>
      </header>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Government Watershed Monitoring Portal
            </span>
            <h1 className="mt-5 text-4xl leading-tight font-bold text-navy lg:text-5xl">
              Shristified AI
            </h1>
            <p className="mt-3 text-lg font-medium text-verified">
              Fusing Ground Truth with Satellite Intelligence
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              AI-powered watershed monitoring that combines geo-tagged field evidence with satellite
              intelligence to validate development projects.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
              >
                Login
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#concept"
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-accent"
              >
                How it works
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["125", "Projects monitored"],
                ["98", "Verified sites"],
                ["6", "States covered"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-bold text-navy tabular-nums">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="gov-card p-6">
            <p className="text-xs font-bold tracking-wide text-navy uppercase">
              Verification Pipeline
            </p>
            <div className="mt-4 space-y-3">
              {PILLARS.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-md border border-border bg-secondary/60 p-3.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {i + 1}. {title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-verified/25 bg-verified-soft px-3.5 py-3 text-sm font-semibold text-verified">
              <CheckCircle2 className="h-4 w-4" />
              Result: Verified · Needs Review · Flagged
            </div>
          </div>
        </div>
      </section>

      <section id="concept" className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-center text-2xl font-bold text-navy">
          Ground Truth + Satellite Intelligence = Smarter Watershed Monitoring
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          Every field submission is checked against project coordinates, structure detection and
          satellite-derived vegetation and water indices — so departments can tell verified work
          apart from reports that need a second look.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Verified",
              tone: "text-verified border-verified/25 bg-verified-soft",
              text: "Ground photograph, GPS position and satellite signature agree with the reported structure.",
            },
            {
              title: "Needs Review",
              tone: "text-review border-review/30 bg-review-soft",
              text: "Evidence is partially consistent; a district officer confirms the site manually.",
            },
            {
              title: "Flagged",
              tone: "text-flagged border-flagged/25 bg-flagged-soft",
              text: "Location mismatch or missing structure evidence indicates a possible false report.",
            },
          ].map((c) => (
            <div key={c.title} className="gov-card p-5">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${c.tone}`}
              >
                {c.title}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-navy py-6 text-center text-xs text-white/80">
        SIH 2026 | Team Aqua Nexus | Problem Statement 26015
        <p className="mt-1 text-white/55">
          Application of geospatial techniques for watershed development — prototype with simulated
          data
        </p>
      </footer>
    </div>
  );
}
