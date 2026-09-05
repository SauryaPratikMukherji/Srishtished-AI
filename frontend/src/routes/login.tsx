import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, User } from "lucide-react";
import logo from "@/assets/shristified-logo.png";
import { setRole, type Role } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Shristified AI Watershed Monitoring" },
      {
        name: "description",
        content:
          "Sign in to the Shristified AI watershed development monitoring portal as a district admin or field inspector.",
      },
      { property: "og:title", content: "Login — Shristified AI" },
      {
        property: "og:description",
        content: "Access the watershed development monitoring portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setSelected] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const enter = (r: Role) => {
    setRole(r);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="gov-topstrip h-1.5" />
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <img
              src={logo}
              alt="Shristified AI emblem"
              width={72}
              height={72}
              className="mx-auto h-18 w-18"
            />
            <h1 className="mt-4 text-2xl font-bold text-navy">Shristified AI</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Watershed Development Monitoring System
            </p>
          </div>

          <div className="gov-card p-6">
            <div className="grid grid-cols-2 gap-1 rounded-md bg-secondary p-1">
              {(["admin", "inspector"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelected(r)}
                  className={cn(
                    "rounded px-3 py-2 text-sm font-semibold transition-colors",
                    role === r ? "bg-navy text-white" : "text-navy hover:bg-accent",
                  )}
                >
                  {r === "admin" ? "District Admin" : "Field Inspector"}
                </button>
              ))}
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                enter(role);
              }}
            >
              <label className="block">
                <span className="text-xs font-semibold tracking-wide text-navy uppercase">
                  Username / Email
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring/40">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="inspector@rd.gov.in"
                    className="w-full bg-transparent py-2.5 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold tracking-wide text-navy uppercase">
                  Password
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring/40">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent py-2.5 text-sm outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-md bg-navy py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
              >
                Login
              </button>
            </form>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Demo access
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => enter("admin")}
                  className="rounded-md border border-navy/25 bg-secondary px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-accent"
                >
                  Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => enter("inspector")}
                  className="rounded-md border border-verified/30 bg-verified-soft px-3 py-2 text-sm font-semibold text-verified transition-colors hover:brightness-98"
                >
                  Demo Inspector
                </button>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/" className="font-medium text-navy hover:underline">
              ← Back to home
            </Link>
          </p>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            SIH 2026 | Team Aqua Nexus | Problem Statement 26015
          </p>
        </div>
      </div>
    </div>
  );
}
