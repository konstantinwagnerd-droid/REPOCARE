"use client";

import { useMemo, useState } from "react";
import { Shield, Download, AlertTriangle, CheckCircle2, Eye, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { STRATEGY_DEFS } from "@/lib/anonymizer/strategies";
import { anonymize } from "@/lib/anonymizer/engine";
import { downloadBlob, exportAsCsv, exportAsJson } from "@/lib/anonymizer/export";
import type { AnonymizationResult, StrategyConfig, AnonymizedRecord } from "@/lib/anonymizer/types";

type SourceKey = "bewohner" | "berichte" | "audit-log";

// --- Mock Echtdaten (nur fuer Demo) -----------------------------------------
const MOCK_BEWOHNER: AnonymizedRecord[] = [
  { id: "b-1042", vorname: "Anna", nachname: "Huber", alter: 87, geschlecht: "weiblich", zimmer: "A-12", pflegegrad: 4, herkunftsland: "Oesterreich", einzugsdatum: "2022-03-14" },
  { id: "b-1043", vorname: "Hans", nachname: "Mayer", alter: 81, geschlecht: "maennlich", zimmer: "A-14", pflegegrad: 3, herkunftsland: "Oesterreich", einzugsdatum: "2023-09-02" },
  { id: "b-1044", vorname: "Hildegard", nachname: "Bauer", alter: 92, geschlecht: "weiblich", zimmer: "B-03", pflegegrad: 5, herkunftsland: "Deutschland", einzugsdatum: "2021-01-22" },
  { id: "b-1045", vorname: "Karl", nachname: "Steiner", alter: 79, geschlecht: "maennlich", zimmer: "B-04", pflegegrad: 2, herkunftsland: "Oesterreich", einzugsdatum: "2024-05-12" },
  { id: "b-1046", vorname: "Maria", nachname: "Pichler", alter: 84, geschlecht: "weiblich", zimmer: "C-08", pflegegrad: 4, herkunftsland: "Oesterreich", einzugsdatum: "2022-11-30" },
  { id: "b-1047", vorname: "Walter", nachname: "Hofer", alter: 88, geschlecht: "maennlich", zimmer: "C-09", pflegegrad: 3, herkunftsland: "Deutschland", einzugsdatum: "2023-02-18" },
];
const MOCK_BERICHTE: AnonymizedRecord[] = [
  { id: "r-9001", bewohnerId: "b-1042", autor: "S. Huber", datum: "2026-04-15", text: "Frau Huber heute deutlich orientierter, hat selbstaendig gefruehstueckt und mit Tochter Maria telefoniert. Stimmung gut, keine Schmerzen.", kategorie: "pflege" },
  { id: "r-9002", bewohnerId: "b-1043", autor: "M. Mayer", datum: "2026-04-15", text: "Herr Mayer klagt seit Mittag ueber leichte Brustschmerzen. RR 145/90, Puls 78. Hausarzt informiert, EKG geplant.", kategorie: "medizinisch" },
];
const MOCK_AUDIT: AnonymizedRecord[] = [
  { id: "a-7001", actor: "S. Huber", action: "BERICHT_CREATED", target: "b-1042", at: "2026-04-15T08:14:00Z", details: "Pflegebericht erstellt, 245 Zeichen." },
  { id: "a-7002", actor: "Admin", action: "EXPORT_DSGVO", target: "b-1043", at: "2026-04-15T10:02:00Z", details: "DSGVO Auskunft Art.15 angefragt durch Angehoerige." },
];

const SOURCES: Record<SourceKey, AnonymizedRecord[]> = {
  "bewohner": MOCK_BEWOHNER,
  "berichte": MOCK_BERICHTE,
  "audit-log": MOCK_AUDIT,
};

export function AnonymizerClient() {
  const [source, setSource] = useState<SourceKey>("bewohner");
  const [strategies, setStrategies] = useState<StrategyConfig[]>(
    STRATEGY_DEFS.map((d) => ({ id: d.id, enabled: d.id === "pseudonymize-names" || d.id === "hash-ids", params: d.defaultParams })),
  );

  const result: AnonymizationResult = useMemo(
    () => anonymize(SOURCES[source], source, strategies),
    [source, strategies],
  );

  function toggleStrategy(id: StrategyConfig["id"]) {
    setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }
  function updateParam(id: StrategyConfig["id"], key: string, value: string | number) {
    setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, params: { ...(s.params ?? {}), [key]: value } } : s)));
  }

  const allKeys = useMemo(() => {
    const k = new Set<string>();
    for (const r of result.rows) for (const x of Object.keys(r.original)) k.add(x);
    return Array.from(k);
  }, [result]);

  const riskTone = result.riskScore.level === "niedrig"
    ? "success"
    : result.riskScore.level === "mittel" ? "warning" : "danger";
  const RiskIcon = result.riskScore.level === "niedrig" ? CheckCircle2 : AlertTriangle;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        {/* LINKS: Konfig */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" /> Quelle</CardTitle>
              <CardDescription>Welche Daten sollen anonymisiert werden?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {(["bewohner", "berichte", "audit-log"] as SourceKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSource(key)}
                    aria-pressed={source === key}
                    className={`rounded-lg border px-3 py-2 text-sm capitalize ${source === key ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
                  >
                    {key.replace("-", " ")}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Strategien</CardTitle>
              <CardDescription>Toggle pro Technik. Reihenfolge wird sequenziell angewandt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {STRATEGY_DEFS.map((d) => {
                const cfg = strategies.find((s) => s.id === d.id)!;
                return (
                  <div key={d.id} className={`rounded-lg border p-3 ${cfg.enabled ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{d.label}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{d.description}</div>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <span className="sr-only">{d.label} aktivieren</span>
                        <input type="checkbox" checked={cfg.enabled} onChange={() => toggleStrategy(d.id)} className="h-4 w-4 accent-current text-primary" />
                      </label>
                    </div>
                    {cfg.enabled && d.defaultParams ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {Object.entries(d.defaultParams).map(([k]) => (
                          <div key={k}>
                            <Label htmlFor={`${d.id}-${k}`} className="text-xs">{k}</Label>
                            <Input
                              id={`${d.id}-${k}`}
                              type="number"
                              value={Number(cfg.params?.[k] ?? 0)}
                              onChange={(e) => updateParam(d.id, k, Number(e.target.value))}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Re-Identifikations-Risiko</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <RiskIcon className={`h-8 w-8 ${result.riskScore.level === "niedrig" ? "text-emerald-600" : result.riskScore.level === "mittel" ? "text-amber-600" : "text-red-600"}`} />
                <div>
                  <Badge variant={riskTone}>{result.riskScore.level.toUpperCase()}</Badge>
                  <div className="mt-1 text-xs text-muted-foreground">k = {result.riskScore.kAnonymity} · {result.riskScore.uniqueQuasiIdentifiers} eindeutige QI · {result.riskScore.totalRows} Zeilen</div>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs">
                {result.riskScore.hinweise.map((h, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{h}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => downloadBlob(exportAsJson(result), `anon-${source}.json`)}>
              <Download className="h-4 w-4" /> JSON
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => downloadBlob(exportAsCsv(result), `anon-${source}.csv`)}>
              <Download className="h-4 w-4" /> CSV
            </Button>
          </div>
        </div>

        {/* RECHTS: Vorschau */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Vorschau Original ↔ Anonymisiert</CardTitle>
            <CardDescription>Direkter Vergleich Zeile für Zeile. Geänderte Zellen sind hervorgehoben.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full border-collapse text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr>
                    <th className="border-b border-border px-2 py-1.5 text-left font-semibold">Feld</th>
                    {result.rows.slice(0, 4).map((_r, i) => (
                      <th key={i} colSpan={2} className="border-b border-border px-2 py-1.5 text-left font-semibold">Zeile #{i + 1}</th>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    {result.rows.slice(0, 4).flatMap((_r, i) => [
                      <th key={`o-${i}`} className="px-2 pb-1.5 text-left font-normal text-muted-foreground">Original</th>,
                      <th key={`a-${i}`} className="px-2 pb-1.5 text-left font-normal text-muted-foreground">Anonym.</th>,
                    ])}
                  </tr>
                </thead>
                <tbody>
                  {allKeys.map((k) => (
                    <tr key={k} className="border-b border-border/50">
                      <td className="px-2 py-1.5 font-mono text-[11px] text-muted-foreground">{k}</td>
                      {result.rows.slice(0, 4).flatMap((r, i) => {
                        const o = r.original[k];
                        const a = r.anonymized[k];
                        const changed = String(o ?? "") !== String(a ?? "");
                        return [
                          <td key={`o-${i}-${k}`} className="px-2 py-1.5">{String(o ?? "—")}</td>,
                          <td key={`a-${i}-${k}`} className={`px-2 py-1.5 ${changed ? "bg-primary/10 font-medium" : "text-muted-foreground"}`}>{String(a ?? "—")}</td>,
                        ];
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.rows.length > 4 ? (
              <p className="mt-3 text-xs text-muted-foreground">… {result.rows.length - 4} weitere Zeilen werden mit den gleichen Regeln verarbeitet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
