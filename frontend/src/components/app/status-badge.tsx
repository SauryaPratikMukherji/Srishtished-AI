import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type Status } from "@/lib/mock-data";

const styles: Record<Status, string> = {
  verified: "bg-verified-soft text-verified border-verified/25",
  review: "bg-review-soft text-review border-review/30",
  flagged: "bg-flagged-soft text-flagged border-flagged/25",
};

const icons: Record<Status, typeof CheckCircle2> = {
  verified: CheckCircle2,
  review: AlertTriangle,
  flagged: XCircle,
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const Icon = icons[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

export const STATUS_DOT: Record<Status, string> = {
  verified: "bg-verified",
  review: "bg-review",
  flagged: "bg-flagged",
};
