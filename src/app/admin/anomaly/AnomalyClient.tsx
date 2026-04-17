"use client";

import { useEffect, useState, useCallback } from "react";
import { Radar, Play, Download, Check, RotateCcw } from "lucide-react";
import { SeverityBadge } from "@/components/anomaly/SeverityBadge";
import type { AnomalyFinding, AnomalyRule } from "@/lib/anomaly/types";

export function AnomalyClient() {
  const [findings, setFindings] = useState<AnomalyFinding[]>([]);
  const [rules, setRules] = useState<AnomalyRule[]>([]);
  const [tab, setTab] = useState<"dashboard" | "rules">("dashboard");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<AnomalyFinding | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/anomaly/list", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { findings: AnomalyFinding[]; rules: AnomalyRule[] };
    setFindings(data.findings);
    setRules(data.rules);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runScan() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/anomaly/scan", { method: "POST" });
      const data = (await res.json()) as { found: number; scanned: number };
      setMsg(`Scan abgeschlossen: ${data.found} Anomalien in ${data.scanned} Events.`);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function acknowledge(id: string) {
    await fetch(`/api/anomaly/${id}/acknowledge`, { method: "POST" });
    await load();
    if (selected?.id === id) setSelected(null);
  }

  async function saveRules(next: AnomalyRule[]) {
    setRules(next);
    await fetch("/api/anomaly/rules/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rules: next }),
    });
  }

  const counts = {
    critical: findings.filter((f) => f.severity === "critical" && !f.acknowledged).length,
    high: findings.filter((f) => f.severity === "high" && !f.acknowledged).length,
    medium: findings.filter((f) => f.severity === "medium" && !f.acknowledged).length,
    low: findings.filter((f) => f.severity === "low" && !f.acknowledged).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTab("dashboard")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === "dashboard" ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-secondary"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab("rules")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === "rules" ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-secondary"
          }`}
        >
          Regeln
        </button>
        <button
          onClick={runScan}
          disabled={busy}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> Scan starten
        </button>
        <a
          href="/api/anomaly/export"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary"
        >
          <Download className="h-4 w-4" /> CSV
        </a>
      </div>

      {msg && <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">{msg}</div>}

      {tab === "dashboard" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <KPI label="Kritisch offen" value={counts.critical} tone="critical" />
            <KPI label="Hoch offen" value={counts.high} tone="high" />
            <KPI label="Mittel offen" value={counts.medium} />
            <KPI label="Niedrig offen" value={counts.low} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-border bg-background">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Radar className="h-4 w-4 text-primary" />
                <h2 className="font-serif font-semibold">Anomalien (letzte 30 Tage)</h2>
              </div>
              <ul className="divide-y divide-border">
                {findings.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Keine Anomalien. Starte einen Scan, um Demo-Daten zu generieren.
                  </li>
                ) : (
                  findings.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => setSelected(f)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 ${
                          selected?.id === f.id ? "bg-muted/60" : ""
                        }`}
                      >
                        <SeverityBadge severity={f.severity} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium">{f.title}</span>
                            {f.acknowledged && (
                              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                geklärt
                              </span>
                            )}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {f.userId ?? "Kein User"} · {new Date(f.detectedAt).toLocaleString("de-AT")}
                          </div>
                          <div className="mt-1 truncate text-sm text-foreground/80">{f.summary}</div>
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <aside className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-serif font-semibold">Details</h3>
              {selected ? (
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Kind</div>
                    <div className="font-mono text-xs">{selected.kind}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Severity</div>
                    <SeverityBadge severity={selected.severity} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">User</div>
                    <div>{selected.userId ?? "—"}</div>
                  </div>
                  {selected.zScore !== undefined && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Z-Score</div>
                      <div>{selected.zScore.toFixed(2)}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Event-Cluster</div>
                    <div>{selected.eventIds.length} Events</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Empfehlung</div>
                    <div>{selected.recommendedAction}</div>
                  </div>
                  {!selected.acknowledged && (
                    <button
                      onClick={() => acknowledge(selected.id)}
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="h-4 w-4" /> Als geklärt markieren
                    </button>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Wähle eine Anomalie, um Details zu sehen.</p>
              )}
            </aside>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Schwellenwerte und Aktivierung pro Regel. Baselines lernen automatisch aus den letzten 30 Tagen.
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Aktiv</th>
                  <th className="px-4 py-3">Regel</th>
                  <th className="px-4 py-3">Schwelle</th>
                  <th className="px-4 py-3">Fenster (Min)</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rules.map((r, idx) => (
                  <tr key={r.kind}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={r.enabled}
                        onChange={(e) => {
                          const next = [...rules];
                          next[idx] = { ...r, enabled: e.target.checked };
                          saveRules(next);
                        }}
                        className="h-4 w-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={r.threshold}
                        onChange={(e) => {
                          const next = [...rules];
                          next[idx] = { ...r, threshold: Number(e.target.value) };
                          saveRules(next);
                        }}
                        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={Math.round(r.windowMs / 60000)}
                        onChange={(e) => {
                          const next = [...rules];
                          next[idx] = { ...r, windowMs: Number(e.target.value) * 60000 };
                          saveRules(next);
                        }}
                        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={r.severity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={async () => {
              const res = await fetch("/api/anomaly/list");
              if (res.ok) {
                const data = (await res.json()) as { rules: AnomalyRule[] };
                setRules(data.rules);
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Vom Server neu laden
          </button>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: number; tone?: "critical" | "high" }) {
  const cls = tone === "critical" ? "text-destructive" : tone === "high" ? "text-orange-600 dark:text-orange-400" : "";
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-serif text-3xl font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
