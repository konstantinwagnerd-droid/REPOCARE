"use client";

import { useMemo, useState } from "react";
import { Database, Download, RefreshCw, Sparkles, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { computeStats, generateDataset } from "@/lib/sample-data/generator";
import { SZENARIEN } from "@/lib/sample-data/scenarios";
import type { SampleDataset } from "@/lib/sample-data/types";

type Mode = "ersetzen" | "zusaetzlich";

export function SampleDataClient() {
  const [szenarioId, setSzenarioId] = useState("demo-pitch");
  const [anzahl, setAnzahl] = useState(12);
  const [seed, setSeed] = useState(7777);
  const [mode, setMode] = useState<Mode>("ersetzen");
  const [dataset, setDataset] = useState<SampleDataset | null>(null);
  const [busy, setBusy] = useState(false);

  const szenario = useMemo(() => SZENARIEN.find((s) => s.id === szenarioId) ?? SZENARIEN[0], [szenarioId]);

  function applyScenario(id: string) {
    const s = SZENARIEN.find((x) => x.id === id);
    if (!s) return;
    setSzenarioId(id);
    setAnzahl(s.anzahl);
    setSeed(s.seed);
  }

  function generate() {
    setBusy(true);
    // Async damit UI reagieren kann.
    setTimeout(() => {
      const fresh = generateDataset({
        anzahl, seed, szenarioId,
        berichteTage: szenario.berichteTage,
        vitalTage: szenario.vitalTage,
      });
      if (mode === "zusaetzlich" && dataset) {
        setDataset({
          bewohner: [...dataset.bewohner, ...fresh.bewohner],
          sis: [...dataset.sis, ...fresh.sis],
          massnahmen: [...dataset.massnahmen, ...fresh.massnahmen],
          berichte: [...dataset.berichte, ...fresh.berichte],
          vitalwerte: [...dataset.vitalwerte, ...fresh.vitalwerte],
          medikation: [...dataset.medikation, ...fresh.medikation],
          wunden: [...dataset.wunden, ...fresh.wunden],
          meta: { ...fresh.meta, anzahlBewohner: dataset.bewohner.length + fresh.bewohner.length },
        });
      } else {
        setDataset(fresh);
        // In-Memory-Store fuer andere Komponenten
        if (typeof window !== "undefined") {
          (window as unknown as { __careaiSampleData?: SampleDataset }).__careaiSampleData = fresh;
        }
      }
      setBusy(false);
    }, 50);
  }

  function exportJson() {
    if (!dataset) return;
    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" });
    triggerDownload(blob, `careai-sample-${szenarioId}-${seed}.json`);
  }

  function exportCsv() {
    if (!dataset) return;
    const head = ["id", "vorname", "nachname", "alter", "geschlecht", "zimmer", "pflegegrad", "anzahl_diagnosen", "herkunft"];
    const rows = dataset.bewohner.map((b) =>
      [b.id, b.vorname, b.nachname, b.alter, b.geschlecht, b.zimmer, b.pflegegrad, b.diagnosen.length, b.herkunftsland].join(";"),
    );
    const csv = [head.join(";"), ...rows].join("\n");
    triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `careai-sample-bewohner-${seed}.csv`);
  }

  const stats = useMemo(() => (dataset ? computeStats(dataset) : null), [dataset]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        {/* LINKS: Konfiguration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Generator-Konfiguration</CardTitle>
            <CardDescription>Waehlen Sie ein Szenario, justieren Sie Anzahl und Seed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-wider">Szenario</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SZENARIEN.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => applyScenario(s.id)}
                    className={`rounded-lg border p-3 text-left text-xs transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      szenarioId === s.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                    }`}
                    aria-pressed={szenarioId === s.id}
                  >
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="mt-1 text-muted-foreground">{s.anzahl} Bewohner:innen · Seed {s.seed}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="anzahl">Anzahl</Label>
                <Input id="anzahl" type="number" min={1} max={1000} value={anzahl}
                  onChange={(e) => setAnzahl(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))} />
              </div>
              <div>
                <Label htmlFor="seed">Seed</Label>
                <Input id="seed" type="number" value={seed}
                  onChange={(e) => setSeed(Number(e.target.value) || 0)} />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider">Modus</Label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("ersetzen")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${mode === "ersetzen" ? "border-primary bg-primary/5" : "border-border"}`}
                  aria-pressed={mode === "ersetzen"}
                >
                  Bestehende ersetzen
                </button>
                <button
                  type="button"
                  onClick={() => setMode("zusaetzlich")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${mode === "zusaetzlich" ? "border-primary bg-primary/5" : "border-border"}`}
                  aria-pressed={mode === "zusaetzlich"}
                >
                  Zusätzlich anhängen
                </button>
              </div>
            </div>

            {anzahl > 250 ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Stress-Modus: {anzahl} Profile + Berichte können einige Sekunden Generieren benötigen.</span>
              </div>
            ) : null}

            <div className="flex gap-2 pt-2">
              <Button onClick={generate} disabled={busy} className="flex-1">
                {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                {busy ? "Generiere …" : "Generieren"}
              </Button>
              <Button variant="outline" onClick={exportJson} disabled={!dataset}>
                <Download className="h-4 w-4" /> JSON
              </Button>
              <Button variant="outline" onClick={exportCsv} disabled={!dataset}>
                <Download className="h-4 w-4" /> CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RECHTS: Vorschau */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Vorschau-Statistiken</CardTitle>
            <CardDescription>{dataset ? `Generiert: ${dataset.bewohner.length} Bewohner:innen.` : "Noch kein Dataset generiert."}</CardDescription>
          </CardHeader>
          <CardContent>
            {!stats ? (
              <div className="grid place-items-center py-12 text-sm text-muted-foreground">
                Klicken Sie „Generieren", um eine Voransicht zu sehen.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Bewohner:innen" value={stats.anzahlBewohner.toString()} />
                  <Stat label="Ø Diagnosen" value={stats.durchschnittDiagnosenProBewohner.toString()} />
                  <Stat label="Ø Berichte" value={stats.durchschnittBerichteProBewohner.toString()} />
                  <Stat label="mit Wunden" value={`${Math.round(stats.anteilMitWunden * 100)} %`} />
                </div>

                <DistroBar title="Altersverteilung" rows={stats.altersverteilung.map((a) => ({ label: a.gruppe, value: a.anzahl }))} total={stats.anzahlBewohner} />
                <DistroBar title="Pflegegrade" rows={stats.pgVerteilung.map((p) => ({ label: `PG ${p.pg}`, value: p.anzahl }))} total={stats.anzahlBewohner} />
                <DistroBar title="Geschlechter" rows={stats.geschlechtVerteilung.map((g) => ({ label: g.geschlecht, value: g.anzahl }))} total={stats.anzahlBewohner} />

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Top-Diagnosen</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.topDiagnosen.map((d) => (
                      <Badge key={d.diagnose} variant="secondary">{d.diagnose} · {d.anzahl}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-2xl font-semibold">{value}</div>
    </div>
  );
}

function DistroBar({ title, rows, total }: { title: string; rows: { label: string; value: number }[]; total: number }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const pct = total ? Math.round((r.value / total) * 100) : 0;
          return (
            <div key={r.label} className="flex items-center gap-3 text-xs">
              <div className="w-16 capitalize text-muted-foreground">{r.label}</div>
              <div className="h-2 flex-1 overflow-hidden rounded bg-secondary">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} aria-hidden />
              </div>
              <div className="w-16 text-right tabular-nums">{r.value} ({pct}%)</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
