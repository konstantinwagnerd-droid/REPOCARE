"use client";

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import type { DashboardWidget, WidgetData } from "@/lib/reports/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const COLORS: Record<string, string> = {
  primary: "#0d7377",
  accent: "#ff6a3d",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
};

export function WidgetRenderer({
  widget,
  data,
  providerLabel,
}: {
  widget: DashboardWidget;
  data: WidgetData | undefined;
  providerLabel: string;
}) {
  const color = COLORS[widget.config.color ?? "primary"] ?? COLORS.primary;
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Keine Daten
      </div>
    );
  }
  switch (widget.type) {
    case "stat-card":
    case "kpi-tile":
      return (
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{providerLabel}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-serif text-3xl font-semibold" style={{ color }}>
              {data.current}
              {data.unit && <span className="ml-1 text-lg">{data.unit}</span>}
            </div>
            <DeltaBadge delta={data.delta} good={data.goodDirection} />
          </div>
        </div>
      );
    case "trend-indicator":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1">
          <DeltaBadge delta={data.delta} good={data.goodDirection} large />
          <div className="text-xs text-muted-foreground">{widget.title}</div>
        </div>
      );
    case "sparkline":
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="font-serif text-2xl font-semibold">
            {data.current}{data.unit ?? ""}
          </div>
          <div className="mt-auto h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series ?? []}>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case "line-chart":
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="mt-2 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series ?? []}>
                <XAxis dataKey="label" fontSize={10} tickMargin={4} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case "bar-chart":
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="mt-2 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series ?? []}>
                <XAxis dataKey="label" fontSize={10} tickMargin={4} />
                <Tooltip />
                <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case "pie-chart": {
      const palette = Object.values(COLORS);
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="mt-2 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.series ?? []} dataKey="value" nameKey="label" outerRadius="80%" label>
                  {(data.series ?? []).map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    case "table":
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="mt-2 flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-[10px] uppercase text-muted-foreground">
                <tr>{(data.headers ?? []).map((h) => <th key={h} className="py-1">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data.rows ?? []).map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => <td key={j} className="py-1 pr-2">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "heatmap": {
      const series = data.series ?? [];
      const max = Math.max(...series.map((s) => s.value), 1);
      return (
        <div className="flex h-full flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{widget.title}</div>
          <div className="mt-2 grid flex-1 grid-cols-7 gap-1">
            {series.map((s, i) => {
              const intensity = s.value / max;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center rounded text-[10px]"
                  style={{ backgroundColor: color, opacity: 0.2 + intensity * 0.8 }}
                  title={`${s.label}: ${s.value}`}
                >
                  <span className="text-white/90">{Math.round(s.value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
}

function DeltaBadge({ delta, good, large }: { delta: number | undefined; good?: "up" | "down"; large?: boolean }) {
  if (delta === undefined || delta === 0) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 ${large ? "text-base" : "text-xs"}`}>
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  }
  const positive = delta > 0;
  const isGood = good === "up" ? positive : good === "down" ? !positive : positive;
  const cls = isGood ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${cls} ${large ? "text-base px-3 py-1" : "text-xs"}`}>
      <Icon className={large ? "h-4 w-4" : "h-3 w-3"} />
      {positive ? "+" : ""}{delta}
    </span>
  );
}
