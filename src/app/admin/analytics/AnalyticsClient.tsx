"use client";

import { useEffect, useState } from "react";
import { Activity, Eye, AlertCircle, Download, Zap } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/analytics/summary", { cache: "no-store" });
      if (res.ok) setData((await res.json()) as AnalyticsSummary);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="py-12 text-center text-sm text-muted-foreground">Lade …</div>;
  if (!data) return <div className="py-12 text-center text-sm text-muted-foreground">Keine Daten.</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={<Activity className="h-4 w-4" />} label="Aktive Nutzer heute" value={data.today.activeUsers} />
        <KPI icon={<Eye className="h-4 w-4" />} label="Seitenaufrufe heute" value={data.today.pageViews} />
        <KPI icon={<Zap className="h-4 w-4" />} label="Feature-Events heute" value={data.today.featureEvents} />
        <KPI icon={<AlertCircle className="h-4 w-4" />} label="Fehlerquote" value={`${data.today.errorRate}%`} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Seitenaufrufe (Trend)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pageViews" stroke="#14B8A6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="featureEvents" stroke="#F97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Top Features">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.topFeatures}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="feature" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#14B8A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TableCard title="Top Seiten" rows={data.topPages.map((p) => [p.page, p.count.toString()])} headers={["Seite", "Views"]} />
        <TableCard
          title="Langsamste Seiten (LCP)"
          rows={data.slowestPages.map((p) => [p.page, `${p.avgMs} ms`])}
          headers={["Seite", "Ø LCP"]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TableCard title="Fehler-Typen" rows={data.errors.map((e) => [e.type, e.count.toString()])} headers={["Typ", "Anzahl"]} />
        <Panel title="Export">
          <div className="flex flex-col gap-2">
            <a
              href="/api/analytics/export?format=csv"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> CSV herunterladen
            </a>
            <a
              href="/api/analytics/export?format=json"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> JSON herunterladen
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Aggregierte Daten. Keine Rohereignisse, keine User-IDs. Konform zu DSGVO Art. 4, 5 und 25.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string | number; tone?: "danger" }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className={`mt-2 font-serif text-3xl font-semibold ${tone === "danger" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h2 className="mb-3 font-serif text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function TableCard({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3 font-serif text-base font-semibold">{title}</div>
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-6 text-center text-sm text-muted-foreground">
                Noch keine Daten.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j === 0 ? "px-4 py-2 font-mono text-xs" : "px-4 py-2 text-right"}>
                    {c}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
