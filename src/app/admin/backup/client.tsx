"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Download, HardDrive, ShieldCheck, PlayCircle, FileUp, CheckCircle2, XCircle, Upload, RefreshCcw, Clock } from "lucide-react";
import type { BackupRecord, BackupSchedule, DrTestRun, ConflictStrategy, RestoreReport } from "@/lib/backup/types";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  initialBackups: BackupRecord[];
  initialSchedules: BackupSchedule[];
  drRuns: DrTestRun[];
};

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function BackupClient({ initialBackups, initialSchedules, drRuns }: Props) {
  const [backups, setBackups] = useState(initialBackups);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [running, setRunning] = useState(false);
  const [strategy, setStrategy] = useState<ConflictStrategy>("skip");
  const [restoreReport, setRestoreReport] = useState<RestoreReport | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function createBackup(type: "full" | "incremental" | "schema-only") {
    setRunning(true);
    const res = await fetch("/api/backup/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const json = await res.json();
    if (json.backup) {
      setBackups((p) => [json.backup, ...p]);
      toast.success(`Backup (${type}) erstellt`);
    } else toast.error("Backup fehlgeschlagen");
    setRunning(false);
  }

  async function verify(id: string) {
    const res = await fetch(`/api/backup/verify/${id}`, { method: "POST" });
    const json = await res.json();
    setBackups((p) => p.map((b) => (b.id === id ? (json.backup ?? b) : b)));
    if (json.valid) toast.success("Hash verifiziert");
    else toast.error("Hash-Mismatch");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setFileContent(text);
    toast.info(`${f.name} geladen (${fmtBytes(f.size)})`);
  }

  async function runRestore() {
    if (!fileContent) {
      toast.error("Bitte Backup-Datei wählen");
      return;
    }
    setRunning(true);
    const res = await fetch("/api/backup/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: fileContent, strategy }),
    });
    const json = await res.json();
    setRestoreReport(json.report);
    if (json.report?.success) toast.success("Restore abgeschlossen");
    else toast.error(json.report?.message ?? "Fehler");
    setRunning(false);
  }

  async function saveSchedule(schedule: BackupSchedule) {
    const res = await fetch("/api/backup/schedule/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    const json = await res.json();
    if (json.schedule) {
      setSchedules((p) => p.map((s) => (s.id === schedule.id ? json.schedule : s)));
      toast.success("Schedule gespeichert");
    }
  }

  function tenantExport() {
    toast.info("Tenant-Export gestartet — ZIP wird im Hintergrund erstellt.");
    setTimeout(() => toast.success("Download verfügbar (Demo: bk_demo_full_2026-04-17.careai-backup.json)"), 1200);
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Backup &amp; Restore</h1>
          <p className="mt-1 text-muted-foreground">
            Datenschutz, Wiederherstellung, Tenant-Export (DSGVO Art.&nbsp;20). AES-256-GCM verschlüsselt.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => createBackup("incremental")} disabled={running}>
            <RefreshCcw className="h-4 w-4" /> Inkrementell
          </Button>
          <Button onClick={() => createBackup("full")} disabled={running}>
            <Database className="h-4 w-4" /> {running ? "Backup läuft …" : "Jetzt Backup"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Letztes Backup", value: backups[0] ? timeAgo(backups[0].createdAt) : "—", icon: Clock, tone: "text-primary bg-primary/10" },
          { label: "Backups gesamt", value: backups.length, icon: Database, tone: "text-accent bg-accent/10" },
          { label: "Speicherplatz", value: fmtBytes(backups.reduce((s, b) => s + b.sizeBytes, 0)), icon: HardDrive, tone: "text-emerald-700 bg-emerald-100" },
          { label: "DR-Tests bestanden", value: `${drRuns.filter((d) => d.passed).length}/${drRuns.length}`, icon: ShieldCheck, tone: "text-amber-700 bg-amber-100" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.tone}`}>
                <k.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-serif text-2xl font-semibold">{k.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="backups">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="automatic">Automatisch</TabsTrigger>
          <TabsTrigger value="export">Tenant-Export</TabsTrigger>
          <TabsTrigger value="dr">Disaster-Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="backups">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Zeitpunkt</th>
                    <th>Typ</th>
                    <th>Status</th>
                    <th>Größe</th>
                    <th>Dauer</th>
                    <th>Hash</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {backups.map((b) => (
                    <tr key={b.id}>
                      <td className="whitespace-nowrap p-3">
                        <div>{formatDateTime(b.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">{b.id}</div>
                      </td>
                      <td><Badge variant="outline">{b.type}</Badge></td>
                      <td>
                        <Badge variant={b.status === "verified" ? "success" : b.status === "failed" ? "danger" : "secondary"}>
                          {b.status}
                        </Badge>
                        {b.encrypted && <span className="ml-2 text-[10px] text-muted-foreground">AES-256-GCM</span>}
                      </td>
                      <td>{fmtBytes(b.sizeBytes)}</td>
                      <td>{(b.durationMs / 1000).toFixed(1)} s</td>
                      <td className="max-w-[180px] truncate font-mono text-[11px]">{b.hashSha256}</td>
                      <td className="flex gap-1 p-3">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/api/backup/${b.id}/download`}><Download className="h-3 w-3" /></a>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => verify(b.id)}>
                          <CheckCircle2 className="h-3 w-3" /> Verify
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => createBackup(b.type as "full" | "incremental")}>
                          <RefreshCcw className="h-3 w-3" /> Neu
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5" /> Backup hochladen</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,.careai-backup"
                  onChange={onFile}
                  className="block w-full rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm"
                />
                <div>
                  <Label>Konflikt-Strategie</Label>
                  <div className="mt-2 flex gap-2">
                    {(["skip", "overwrite", "merge"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStrategy(s)}
                        className={`rounded-lg border px-3 py-2 text-sm ${strategy === s ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                      >
                        {s === "skip" ? "Überspringen" : s === "overwrite" ? "Überschreiben" : "Zusammenführen"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {strategy === "skip" && "Bestehende Datensätze bleiben erhalten. Empfohlen."}
                    {strategy === "overwrite" && "Bestehende Datensätze werden ersetzt. Datenverlust möglich!"}
                    {strategy === "merge" && "Felder werden zusammengeführt, neuere Werte gewinnen."}
                  </p>
                </div>
                <Button onClick={runRestore} disabled={running || !fileContent} className="w-full">
                  <Upload className="h-4 w-4" /> Restore starten
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Restore-Preview</CardTitle></CardHeader>
              <CardContent>
                {!restoreReport ? (
                  <p className="text-sm text-muted-foreground">Noch kein Restore durchgeführt.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {restoreReport.success ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-destructive" />}
                      <span className="text-sm font-semibold">{restoreReport.message}</span>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="text-left uppercase text-muted-foreground">
                        <tr><th className="p-1">Tabelle</th><th>Neu</th><th>Übersp.</th><th>Überschr.</th><th>Fehler</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {Object.entries(restoreReport.tables).map(([t, r]) => (
                          <tr key={t}>
                            <td className="p-1 font-mono">{t}</td>
                            <td>{r.inserted}</td>
                            <td>{r.skipped}</td>
                            <td>{r.overwritten}</td>
                            <td>{r.errors}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automatic">
          <div className="space-y-4">
            {schedules.map((s) => (
              <ScheduleEditor key={s.id} schedule={s} onSave={saveSchedule} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader><CardTitle>Tenant-Export (DSGVO Art.&nbsp;20)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Vollständiger Datenexport aller Tenant-Daten inkl. Files als ZIP. Verschlüsselt mit AES-256-GCM,
                Entschlüsselungs-Key wird separat via sicherem Kanal übermittelt.
              </p>
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                <div>Format: <code>careai-tenant-export/v1</code></div>
                <div>Tabellen: Bewohner:innen, Users, Pflegeberichte, Vorfälle, Medikation, Wunddoku, Vitals, Audit-Log</div>
                <div>Dateien: PDF-Berichte, Signaturen, Bilder, Audio-Aufnahmen</div>
                <div>Typische Größe: 50–200&nbsp;MB pro 100 Bewohner:innen</div>
              </div>
              <Button onClick={tenantExport}>
                <Download className="h-4 w-4" /> Tenant-Export starten
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dr">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>RPO / RTO Ziele</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between rounded-lg border border-border p-3">
                  <span>Recovery Point Objective (RPO)</span>
                  <span className="font-semibold">&le; 24&nbsp;Stunden</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border p-3">
                  <span>Recovery Time Objective (RTO)</span>
                  <span className="font-semibold">&le; 4&nbsp;Stunden</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border p-3">
                  <span>Retention: täglich</span>
                  <span className="font-semibold">7 Tage</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border p-3">
                  <span>Retention: wöchentlich</span>
                  <span className="font-semibold">4 Wochen</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border p-3">
                  <span>Retention: monatlich</span>
                  <span className="font-semibold">12 Monate</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Test-Historie</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {drRuns.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatDateTime(r.runAt)}</span>
                      <Badge variant={r.passed ? "success" : "danger"}>
                        {r.passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {r.passed ? "OK" : "FAIL"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      RPO {r.rpoMinutes} min · RTO {r.rtoMinutes} min
                    </div>
                    <div className="mt-1 text-xs">{r.notes}</div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full">
                  <PlayCircle className="h-4 w-4" /> DR-Test jetzt ausführen
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScheduleEditor({ schedule, onSave }: { schedule: BackupSchedule; onSave: (s: BackupSchedule) => void }) {
  const [draft, setDraft] = useState(schedule);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {schedule.id === "sch_daily" ? "Täglich" : schedule.id === "sch_weekly" ? "Wöchentlich" : "Schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <Label htmlFor={`cron-${schedule.id}`}>Cron-Ausdruck</Label>
            <Input
              id={`cron-${schedule.id}`}
              value={draft.cron}
              onChange={(e) => setDraft({ ...draft, cron: e.target.value })}
              className="font-mono"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">z.B. <code>0 3 * * *</code> = täglich 03:00</p>
          </div>
          <div>
            <Label>Retention täglich</Label>
            <Input type="number" value={draft.retentionDaily} onChange={(e) => setDraft({ ...draft, retentionDaily: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Retention wöchentlich</Label>
            <Input type="number" value={draft.retentionWeekly} onChange={(e) => setDraft({ ...draft, retentionWeekly: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Retention monatlich</Label>
            <Input type="number" value={draft.retentionMonthly} onChange={(e) => setDraft({ ...draft, retentionMonthly: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} />
            Aktiv — nächster Run: {formatDateTime(draft.nextRunAt)}
          </label>
          <Button size="sm" onClick={() => onSave(draft)}>Speichern</Button>
        </div>
      </CardContent>
    </Card>
  );
}
