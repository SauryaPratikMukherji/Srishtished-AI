import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "verified" | "review" | "flagged";

const tones: Record<Tone, { bar: string; icon: string; value: string }> = {
  navy: { bar: "bg-navy", icon: "bg-navy/10 text-navy", value: "text-navy" },
  verified: {
    bar: "bg-verified",
    icon: "bg-verified-soft text-verified",
    value: "text-verified",
  },
  review: { bar: "bg-review", icon: "bg-review-soft text-review", value: "text-review" },
  flagged: { bar: "bg-flagged", icon: "bg-flagged-soft text-flagged", value: "text-flagged" },
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <div className="gov-card relative overflow-hidden p-5 transition-shadow hover:shadow-raised">
      <span className={cn("absolute inset-y-0 left-0 w-1", t.bar)} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className={cn("mt-2 text-3xl font-bold tabular-nums", t.value)}>{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("rounded-md p-2.5", t.icon)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
