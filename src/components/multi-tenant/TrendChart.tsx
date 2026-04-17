"use client";

interface Series { label: string; color: string; values: number[]; }
export interface TrendChartProps {
  labels: string[];
  series: Series[];
  height?: number;
  format?: (n: number) => string;
}

export function TrendChart({ labels, series, height = 180, format }: TrendChartProps) {
  const w = 640;
  const h = height;
  const pad = { l: 40, r: 12, t: 12, b: 28 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const all = series.flatMap((s) => s.values);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const xStep = iw / Math.max(1, labels.length - 1);
  const fmt = format ?? ((n: number) => n.toString());

  const path = (values: number[]) => {
    return values
      .map((v, i) => {
        const x = pad.l + i * xStep;
        const y = pad.t + ih - ((v - min) / span) * ih;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        {/* y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + ih - t * ih;
          const v = min + t * span;
          return (
            <g key={t}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="currentColor" className="text-border" strokeWidth={0.5} strokeDasharray="3 4" />
              <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize={10} className="fill-muted-foreground">{fmt(v)}</text>
            </g>
          );
        })}
        {/* x labels */}
        {labels.map((l, i) => (
          <text key={l} x={pad.l + i * xStep} y={h - 8} textAnchor="middle" fontSize={10} className="fill-muted-foreground">
            {l.split("-")[1] ?? l}
          </text>
        ))}
        {series.map((s, idx) => (
          <g key={idx}>
            <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2} />
            {s.values.map((v, i) => {
              const x = pad.l + i * xStep;
              const y = pad.t + ih - ((v - min) / span) * ih;
              return <circle key={i} cx={x} cy={y} r={2.5} fill={s.color} />;
            })}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
