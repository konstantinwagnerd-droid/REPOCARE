// Progress-Ring für LMS
import { cn } from "@/lib/utils";

export function ProgressRing({
  progress,
  size = 72,
  stroke = 6,
  className,
  label,
  showPct = true,
}: {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
  showPct?: boolean;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped);
  const pct = Math.round(clamped * 100);
  return (
    <div className={cn("inline-flex flex-col items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="fill-none stroke-primary transition-all"
        />
      </svg>
      {showPct && (
        <div className="-mt-[calc(50%+6px)] pointer-events-none text-center font-serif font-semibold" style={{ fontSize: size / 4 }}>
          {pct}%
        </div>
      )}
      {label && <div className="mt-1 text-xs text-muted-foreground">{label}</div>}
    </div>
  );
}
