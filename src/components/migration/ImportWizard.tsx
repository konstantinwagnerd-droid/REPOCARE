"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, PlayCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { WizardStepper } from "./WizardStepper";
import { SourcePicker } from "./SourcePicker";
import { FileDropzone } from "./FileDropzone";
import { MappingEditor } from "./MappingEditor";
import { ValidationTable } from "./ValidationTable";
import type {
  ConflictStrategy,
  ImportReport,
  MappingRule,
  MigrationSource,
  ValidationResult,
} from "@/lib/migration/types";

const STEPS = [
  { id: 1, label: "Quelle", description: "System wählen" },
  { id: 2, label: "Datei", description: "Export hochladen" },
  { id: 3, label: "Mapping", description: "Felder zuordnen" },
  { id: 4, label: "Prüfung", description: "Vorschau & Warnungen" },
  { id: 5, label: "Import", description: "Übernehmen & Report" },
];

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<MigrationSource | null>(null);
  const [file, setFile] = useState<{ name: string; size: number; content: string } | null>(null);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [rules, setRules] = useState<MappingRule[]>([]);
  const [preview, setPreview] = useState<unknown[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>("skip");
  const [report, setReport] = useState<ImportReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function gotoMapping() {
    if (!source || !file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/migration/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, content: file.content }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Parse fehlgeschlagen");
      setDetectedFields(data.parse.detectedFields);
      const suggested = (data.suggestedMapping ?? []) as Array<{ source: string; target: string }>;
      const applied: MappingRule[] = [];
      for (const s of suggested) {
        const match = data.parse.detectedFields.find(
          (f: string) => f.toLowerCase().trim() === s.source.toLowerCase().trim(),
        );
        if (match) {
          applied.push({
            sourceField: match,
            targetField: s.target as MappingRule["targetField"],
            required: s.target === "lastName" || s.target === "firstName",
          });
        }
      }
      setRules(applied);
      setStep(3);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function gotoValidation() {
    if (!source || !file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/migration/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, content: file.content, rules }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Validierung fehlgeschlagen");
      setValidation(data.validation);
      setPreview(data.preview);
      setStep(4);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function runImport() {
    if (!source || !file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/migration/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, content: file.content, rules, conflictStrategy, dryRun: true }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Import fehlgeschlagen");
      setReport(data.report);
      setStep(5);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setSource(null);
    setFile(null);
    setDetectedFields([]);
    setRules([]);
    setPreview([]);
    setValidation(null);
    setReport(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <WizardStepper steps={STEPS} current={step} />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Welches System verlasst ihr?</CardTitle>
            <CardDescription>
              Wähle das Quell-System. Für jedes gibt es eine detaillierte Export-Anleitung.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SourcePicker value={source} onChange={setSource} />
            {source && (
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
                <span>
                  Brauchst du Hilfe beim Export aus diesem System?
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/migration/anleitung/${source}`}>
                    Export-Anleitung öffnen
                  </Link>
                </Button>
              </div>
            )}
            <div className="flex justify-end">
              <Button disabled={!source} onClick={() => setStep(2)}>
                Weiter <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && source && (
        <Card>
          <CardHeader>
            <CardTitle>Export-Datei hochladen</CardTitle>
            <CardDescription>
              Wir verarbeiten die Datei ausschließlich in unserer EU-Infrastruktur.
              Nichts wird an Dritte weitergegeben.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileDropzone onFileLoaded={setFile} />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Zurück
              </Button>
              <Button disabled={!file || loading} onClick={gotoMapping}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                Weiter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Felder zuordnen</CardTitle>
            <CardDescription>
              Wir haben {rules.length} Vorschlag{rules.length === 1 ? "" : "e"} automatisch erkannt.
              Du kannst sie anpassen oder ergänzen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MappingEditor
              sourceFields={detectedFields}
              rules={rules}
              onChange={setRules}
            />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="size-4" /> Zurück
              </Button>
              <Button disabled={rules.length === 0 || loading} onClick={gotoValidation}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                Prüfen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && validation && (
        <Card>
          <CardHeader>
            <CardTitle>Vorschau &amp; Validierung</CardTitle>
            <CardDescription>
              {validation.validRecords} von {validation.totalRecords} Datensätzen sind importierbar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="Insgesamt" value={validation.totalRecords} />
              <Stat label="Gültig" value={validation.validRecords} tone="success" />
              <Stat label="Fehler" value={validation.errors.length} tone={validation.errors.length > 0 ? "error" : "neutral"} />
              <Stat label="Warnungen" value={validation.warnings.length} tone={validation.warnings.length > 0 ? "warning" : "neutral"} />
            </div>

            <div>
              <h3 className="mb-2 font-serif text-lg font-semibold">Vorschau (erste {Math.min(preview.length, 10)} Einträge)</h3>
              <PreviewTable preview={preview as Array<{ mapped?: Record<string, unknown> }>} />
            </div>

            <div>
              <h3 className="mb-2 font-serif text-lg font-semibold">Warnungen &amp; Fehler</h3>
              <ValidationTable errors={validation.errors} warnings={validation.warnings} />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="mb-3 font-semibold">Konflikt-Strategie bei Duplikaten</h3>
              <div className="flex flex-wrap gap-2">
                {(["skip", "overwrite", "merge"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setConflictStrategy(s)}
                    className={
                      "rounded-full border px-4 py-1.5 text-sm " +
                      (conflictStrategy === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50")
                    }
                  >
                    {s === "skip" ? "Überspringen" : s === "overwrite" ? "Überschreiben" : "Zusammenführen"}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {conflictStrategy === "skip" && "Bestehende Bewohner:innen bleiben unverändert — Doppelte werden übersprungen."}
                {conflictStrategy === "overwrite" && "Alle Felder aus dem Import überschreiben bestehende Werte."}
                {conflictStrategy === "merge" && "Leere CareAI-Felder werden mit Import-Werten ergänzt — bestehende Werte bleiben."}
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}>
                <ArrowLeft className="size-4" /> Zurück
              </Button>
              <Button
                disabled={validation.errors.length > 0 || loading}
                onClick={runImport}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
                Import starten
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-6 text-primary" />
              Import abgeschlossen
            </CardTitle>
            <CardDescription>
              Batch-ID:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{report.batchId}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="Gesamt" value={report.totalRecords} />
              <Stat label="Importiert" value={report.imported} tone="success" />
              <Stat label="Übersprungen" value={report.skipped} tone="warning" />
              <Stat label="Fehler" value={report.failed} tone={report.failed > 0 ? "error" : "neutral"} />
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
              <div className="font-semibold">Rollback-Hinweis</div>
              <p className="mt-1 text-muted-foreground">{report.rollbackHint}</p>
            </div>
            <div>
              <Badge variant="outline">Dry-Run</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Dieser Import lief im Simulationsmodus. Aktivierung für Produktions-DB erfolgt nach DB-Review.
              </p>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={reset}>
                <RefreshCw className="size-4" /> Neuer Import
              </Button>
              <Button asChild>
                <Link href="/admin">Zum Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "success" | "warning" | "error";
}) {
  const toneClass =
    tone === "success"
      ? "border-primary/30 bg-primary/5 text-primary"
      : tone === "warning"
      ? "border-accent/30 bg-accent/5 text-accent-foreground"
      : tone === "error"
      ? "border-destructive/30 bg-destructive/5 text-destructive"
      : "border-border bg-muted/30";
  return (
    <div className={"rounded-xl border p-4 " + toneClass}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function PreviewTable({ preview }: { preview: Array<{ mapped?: Record<string, unknown> }> }) {
  const slice = preview.slice(0, 10);
  if (slice.length === 0) return <p className="text-sm text-muted-foreground">Keine Vorschau verfügbar.</p>;
  const cols = ["firstName", "lastName", "dateOfBirth", "careLevel", "room", "admissionDate"];
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs uppercase text-muted-foreground">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 align-top">
                  {String((r.mapped ?? {})[c] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
