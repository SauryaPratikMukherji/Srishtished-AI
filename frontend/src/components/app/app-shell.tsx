import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  Droplets,
  ClipboardList,
  Camera,
  BrainCircuit,
  Satellite,
  ShieldCheck,
  FileText,
  ScrollText,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import logo from "@/assets/shristified-logo.png";
import { ROLE_LABEL, ROLE_NAME, useRole } from "@/lib/session";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Map & GIS", icon: Map },
  { to: "/watersheds", label: "Watersheds", icon: Droplets },
  { to: "/field-audits", label: "Field Audits", icon: ClipboardList },
  { to: "/photo-upload", label: "Photo Upload", icon: Camera },
  { to: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { to: "/satellite", label: "Satellite Monitoring", icon: Satellite },
  { to: "/validation", label: "Validation", icon: ShieldCheck },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/analytics", label: "Analytics / Impact", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const role = useRole();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <img src={logo} alt="JALPRAMAAN emblem" width={40} height={40} className="h-10 w-10" />
          <div>
            <p className="text-sm font-bold text-white">JALPRAMAAN</p>
            <p className="text-[10px] tracking-wide text-sidebar-foreground/70 uppercase">
              Watershed Monitoring
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to as any}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-white"
              activeProps={{
                className:
                  "bg-sidebar-accent text-white border-l-2 border-sidebar-primary pl-[10px]",
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-3 text-[10px] leading-relaxed text-sidebar-foreground/60">
          SIH 2026 · Team Aqua Nexus
          <br />
          Problem Statement 26015
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="gov-topstrip h-1" />
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-card px-5 py-3">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logo} alt="JALPRAMAAN" width={32} height={32} className="h-8 w-8" />
            <span className="text-sm font-bold text-navy">JALPRAMAAN</span>
          </div>
          <p className="hidden text-xs font-medium tracking-wide text-muted-foreground lg:block">
            Department of Rural Development · Watershed Development Monitoring System
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-md p-2 text-navy transition-colors hover:bg-accent"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-flagged" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-navy">{ROLE_NAME[role]}</p>
              <p className="text-[11px] text-muted-foreground">{ROLE_LABEL[role]}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
              {ROLE_NAME[role].slice(0, 2).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="rounded-md border border-border p-2 text-navy transition-colors hover:bg-accent"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to as any}
              className="rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground"
              activeProps={{ className: "bg-navy text-white" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>

        <footer className="border-t border-border bg-card px-5 py-3 text-center text-[11px] text-muted-foreground">
          SIH 2026 | Team Aqua Nexus | Problem Statement 26015 — Prototype with simulated data
        </footer>
      </div>
    </div>
  );
}
