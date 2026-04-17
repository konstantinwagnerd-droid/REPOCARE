import type { AnomalySeverity } from "@/lib/anomaly/types";

const styles: Record<AnomalySeverity, string> = {
  low: "bg-muted text-foreground/70",
  medium: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-300",
  critical: "bg-destructive/10 text-destructive",
};

export function SeverityBadge({ severity }: { severity: AnomalySeverity }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${styles[severity]}`}>
      {severity}
    </span>
  );
}
