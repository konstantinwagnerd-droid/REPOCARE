"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type Point = { recordedAt: Date | string; valueNumeric: number | null; type: string };

export function VitalsChart({ data, label, unit, color = "#0F766E" }: { data: Point[]; label: string; unit: string; color?: string }) {
  const chartData = data
    .filter((d) => d.valueNumeric != null)
    .map((d) => ({
      ts: typeof d.recordedAt === "string" ? new Date(d.recordedAt).getTime() : d.recordedAt.getTime(),
      v: d.valueNumeric,
    }))
    .sort((a, b) => a.ts - b.ts);

  if (chartData.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Keine {label}-Daten vorhanden.</div>;
  }

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h4 className="font-serif text-sm font-semibold">{label}</h4>
        <span className="text-xs text-muted-foreground">Einheit: {unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="ts"
            tickFormatter={(t) => format(t, "dd.MM.", { locale: de })}
            fontSize={11}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            labelFormatter={(t) => format(t as number, "dd.MM.yyyy HH:mm", { locale: de })}
            formatter={(v) => [`${v} ${unit}`, label]}
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
          />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
