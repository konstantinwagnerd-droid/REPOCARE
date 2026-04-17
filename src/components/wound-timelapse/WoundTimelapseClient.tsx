"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Camera, Download, FileText, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { buildMockCase, chronological } from "@/lib/wound-timelapse/aggregator";
import { compare } from "@/lib/wound-timelapse/comparator";
import { computeHealing } from "@/lib/wound-timelapse/healing-score";
import type { WoundCase, WoundSnapshot } from "@/lib/wound-timelapse/types";

interface Props {
  bewohnerId: string;
  woundId: string;
  bewohnerName?: string;
  lokalisation?: string;
}

export function WoundTimelapseClient({ bewohnerId, woundId, bewohnerName, lokalisation }: Props) {
  const woundCase: WoundCase = useMemo(
    () => buildMockCase({
      id: woundId,
      bewohnerId,
      bewohnerName: bewohnerName ?? "Bewohner:in",
      lokalisation: lokalisation ?? "Sakrum (Steissbein)",
    }),
    [woundId, bewohnerId, bewohnerName, lokalisation],
  );
  const snaps = chronological(woundCase.snapshots);
  const [activeIdx, setActiveIdx] = useState(snaps.length - 1);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx, setCompareIdx] = useState(0);

  const active = snaps[activeIdx];
  const comparison = compareMode ? compare(snaps[compareIdx], active) : null;
  const healing = computeHealing(woundCase);

  const chartData = snaps.map((s) => ({
    date: s.date.slice(5),
    flaeche: s.flaecheMm2,
    grad: s.grade,
    tiefe: s.tiefeMm,
  }));

  function exportPdfStub() {
    // Audit-PDF Stub: oeffnet druckbare Sicht im neuen Fenster.
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Wund-Audit ${woundId}</title>
      <style>body{font-family:sans-serif;padding:24px;max-width:680px}h1{font-size:18pt}table{border-collapse:collapse;width:100%;font-size:10pt}td,th{border:1px solid #ddd;padding:6px 8px;text-align:left}</style>
      </head><body>
      <h1>Wund-Verlaufs-Audit</h1>
      <p><b>Bewohner:in:</b> ${woundCase.bewohnerName} · <b>Lokalisation:</b> ${woundCase.lokalisation}</p>
      <p><b>Wund-ID:</b> ${woundId} · <b>Erstdokumentation:</b> ${woundCase.ersterkennung}</p>
      <p><b>Heilungs-Score:</b> ${healing.score}/100 · ${healing.prognose}</p>
      <h2>Snapshots</h2>
      <table><thead><tr><th>Datum</th><th>Grad</th><th>L×B×T mm</th><th>Fläche mm²</th><th>Exsudat</th><th>Notiz</th><th>Autor</th></tr></thead>
      <tbody>${snaps.map((s) => `<tr><td>${s.date}</td><td>${s.grade}</td><td>${s.laengeMm}×${s.breiteMm}×${s.tiefeMm}</td><td>${s.flaecheMm2}</td><td>${s.exudate}</td><td>${s.notes}</td><td>${s.author}</td></tr>`).join("")}</tbody></table>
      </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 250);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Wund-Verlauf · {woundCase.lokalisation}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {woundCase.bewohnerName} · {snaps.length} Snapshots seit {woundCase.ersterkennung}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={compareMode ? "default" : "outline"} onClick={() => setCompareMode(!compareMode)}>
            <ArrowLeftRight className="h-4 w-4" /> {compareMode ? "Vergleich beenden" : "Vergleich aktivieren"}
          </Button>
          <Button variant="outline" onClick={exportPdfStub}>
            <Download className="h-4 w-4" /> Audit-PDF
          </Button>
        </div>
      </header>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
          <CardDescription>Klicken oder per Slider auswählen. {compareMode ? "Im Vergleichs-Modus den zweiten Punkt unten wählen." : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-12">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-secondary" aria-hidden />
            <div className="relative flex h-full items-center justify-between">
              {snaps.map((s, i) => {
                const selected = i === activeIdx;
                const compareSel = compareMode && i === compareIdx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => (compareMode && i !== activeIdx ? setCompareIdx(i) : setActiveIdx(i))}
                    aria-label={`Snapshot ${s.date}, Grad ${s.grade}`}
                    aria-pressed={selected}
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                      selected ? "border-primary bg-primary text-primary-foreground scale-110" :
                      compareSel ? "border-accent bg-accent text-accent-foreground scale-110" :
                      "border-border bg-background hover:border-primary"
                    }`}
                  >
                    {s.grade}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{snaps[0].date}</span>
            <span>{snaps[snaps.length - 1].date}</span>
          </div>
          <input
            type="range" min={0} max={snaps.length - 1} value={activeIdx}
            onChange={(e) => setActiveIdx(Number(e.target.value))}
            className="mt-4 w-full accent-primary"
            aria-label="Snapshot Datum auswaehlen"
          />
        </CardContent>
      </Card>

      {/* Hauptansicht */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4 text-primary" /> Foto · {active.date}
            </CardTitle>
            <CardDescription>Snapshot {activeIdx + 1} von {snaps.length} · Autor: {active.author}</CardDescription>
          </CardHeader>
          <CardContent>
            {compareMode && comparison ? (
              <div className="grid grid-cols-2 gap-3">
                <SnapPicture snap={comparison.von} label="Vergleichs-Snapshot" />
                <SnapPicture snap={comparison.bis} label="Aktueller Snapshot" />
              </div>
            ) : (
              <SnapPicture snap={active} label="" big />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Messwerte & Notizen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SnapMeasurements snap={active} />
            {comparison ? (
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <TrendBadge trend={comparison.trend} />
                  <span className="text-xs text-muted-foreground">Differenz: {comparison.tageDifferenz} Tage</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>Δ Länge: <span className="tabular-nums font-mono">{comparison.delta.laengeMm > 0 ? "+" : ""}{comparison.delta.laengeMm} mm</span></li>
                  <li>Δ Breite: <span className="tabular-nums font-mono">{comparison.delta.breiteMm > 0 ? "+" : ""}{comparison.delta.breiteMm} mm</span></li>
                  <li>Δ Tiefe: <span className="tabular-nums font-mono">{comparison.delta.tiefeMm > 0 ? "+" : ""}{comparison.delta.tiefeMm} mm</span></li>
                  <li>Δ Fläche: <span className="tabular-nums font-mono">{comparison.delta.flaecheMm2 > 0 ? "+" : ""}{comparison.delta.flaecheMm2} mm²</span></li>
                  <li>Δ Grad: <span className="tabular-nums font-mono">{comparison.delta.grade > 0 ? "+" : ""}{comparison.delta.grade}</span></li>
                </ul>
              </div>
            ) : null}
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notiz</h4>
              <p className="text-sm leading-relaxed">{active.notes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heilungsverlauf</CardTitle>
          <CardDescription>Score: {healing.score}/100 · {healing.flaechenReduktionPct}% Flaechenreduktion in {healing.durationDays} Tagen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="flaeche" stroke="#0F766E" fill="#14B8A6" fillOpacity={0.25} name="Fläche mm²" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="stepAfter" dataKey="grad" stroke="#F97316" strokeWidth={2} dot name="Wundgrad" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <div className="mb-1 flex items-center gap-2 font-semibold"><FileText className="h-4 w-4" /> Prognose</div>
            <p className="text-sm">{healing.prognose}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SnapPicture({ snap, label, big }: { snap: WoundSnapshot; label: string; big?: boolean }) {
  return (
    <div>
      {label ? <div className="mb-1 text-xs font-medium text-muted-foreground">{label} · {snap.date}</div> : null}
      <div className={`relative overflow-hidden rounded-xl border border-border bg-secondary ${big ? "aspect-video" : "aspect-square"}`}>
        <img src={snap.photoUrl} alt={`Wundfoto vom ${snap.date}, Grad ${snap.grade}`} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2"><Badge variant="default">Grad {snap.grade}</Badge></div>
        <div className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-[10px] font-mono">
          {snap.laengeMm}×{snap.breiteMm}×{snap.tiefeMm} mm
        </div>
      </div>
    </div>
  );
}

function SnapMeasurements({ snap }: { snap: WoundSnapshot }) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <Field label="Grad">{snap.grade}</Field>
      <Field label="Exsudat" capitalize>{snap.exudate}</Field>
      <Field label="Länge">{snap.laengeMm} mm</Field>
      <Field label="Breite">{snap.breiteMm} mm</Field>
      <Field label="Tiefe">{snap.tiefeMm} mm</Field>
      <Field label="Fläche">{snap.flaecheMm2} mm²</Field>
    </dl>
  );
}

function Field({ label, children, capitalize }: { label: string; children: React.ReactNode; capitalize?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`font-mono text-sm font-semibold tabular-nums ${capitalize ? "capitalize" : ""}`}>{children}</dd>
    </div>
  );
}

function TrendBadge({ trend }: { trend: "heilend" | "stabil" | "verschlechtert" }) {
  const map = {
    heilend: { v: "success" as const, Icon: TrendingDown, t: "Heilend" },
    stabil: { v: "secondary" as const, Icon: Minus, t: "Stabil" },
    verschlechtert: { v: "danger" as const, Icon: TrendingUp, t: "Verschlechtert" },
  }[trend];
  const Icon = map.Icon;
  return <Badge variant={map.v}><Icon className="mr-1 h-3 w-3" /> {map.t}</Badge>;
}
