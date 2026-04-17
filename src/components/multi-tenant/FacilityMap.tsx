"use client";

import type { FacilityRef } from "@/lib/multi-tenant/types";

/**
 * Leichtgewichtige SVG-Kartendarstellung (D/A) ohne externe Libs.
 * Bounding Box grob: Lon 9..17, Lat 47..55.
 */
export function FacilityMap({ facilities }: { facilities: FacilityRef[] }) {
  const w = 640;
  const h = 360;
  const lonMin = 9, lonMax = 17, latMin = 47, latMax = 55;
  const proj = (lat: number, lng: number) => {
    const x = ((lng - lonMin) / (lonMax - lonMin)) * w;
    const y = h - ((lat - latMin) / (latMax - latMin)) * h;
    return { x, y };
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
        <rect x={0} y={0} width={w} height={h} fill="transparent" />
        {/* grid */}
        {[1, 2, 3, 4, 5].map((i) => (
          <line key={`h${i}`} x1={0} y1={(i * h) / 6} x2={w} y2={(i * h) / 6} stroke="currentColor" className="text-border" strokeWidth={0.5} strokeDasharray="2 4" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`v${i}`} x1={(i * w) / 8} y1={0} x2={(i * w) / 8} y2={h} stroke="currentColor" className="text-border" strokeWidth={0.5} strokeDasharray="2 4" />
        ))}
        {facilities.map((f) => {
          const { x, y } = proj(f.lat, f.lng);
          const size = Math.max(6, Math.min(16, f.beds / 12));
          const color = f.status === "audit-review" ? "#f59e0b" : f.status === "paused" ? "#94a3b8" : "#0f766e";
          return (
            <g key={f.id}>
              <circle cx={x} cy={y} r={size} fill={color} fillOpacity={0.25} />
              <circle cx={x} cy={y} r={size / 2.5} fill={color} />
              <title>{`${f.name} — ${f.city}, ${f.region} (${f.beds} Betten)`}</title>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 border-t border-border bg-background/80 p-3 text-xs">
        <Legend color="#0f766e" label="Aktiv" />
        <Legend color="#f59e0b" label="Audit-Review" />
        <Legend color="#94a3b8" label="Pausiert" />
        <span className="ml-auto text-muted-foreground">Radius ∝ Bettenzahl</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </span>
  );
}
