import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db/client";
import { residents, sisAssessments, carePlans, careReports, vitalSigns, medications, medicationAdministrations, wounds, woundObservations, riskScores, incidents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { calcAge, formatDate, formatDateTime, initials, timeAgo } from "@/lib/utils";
import { VitalsChart } from "@/components/app/vitals-chart";
import { ExportButton } from "@/components/app/export-button";
import { AkteExportDialog } from "@/components/app/akte-export-dialog";
import { ArrowLeft, Phone, AlertTriangle, TrendingUp, TrendingDown, Minus, Mic, Plus, Camera, Droplets, Lock, Printer } from "lucide-react";
import { HelpTip } from "@/components/tooltip/HelpTip";
import { GlossarTip } from "@/components/tooltip/GlossarTip";

const riskLabels: Record<string, { name: string; color: string }> = {
  sturz: { name: "Sturzrisiko", color: "bg-amber-100 text-amber-900" },
  dekubitus: { name: "Dekubitusrisiko", color: "bg-rose-100 text-rose-900" },
  delir: { name: "Delirrisiko", color: "bg-purple-100 text-purple-900" },
};

const sisThemes = [
  { key: "themenfeld1", title: "Kognitive und kommunikative Fähigkeiten" },
  { key: "themenfeld2", title: "Mobilität und Beweglichkeit" },
  { key: "themenfeld3", title: "Krankheitsbezogene Anforderungen" },
  { key: "themenfeld4", title: "Selbstversorgung" },
  { key: "themenfeld5", title: "Leben in sozialen Beziehungen" },
  { key: "themenfeld6", title: "Haushaltsführung" },
] as const;

export default async function ResidentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [r] = await db.select().from(residents).where(eq(residents.id, id)).limit(1);
  if (!r) notFound();

  const [sisList, plans, reports, vitals, meds, marList, woundList, risks, incList] = await Promise.all([
    db.select().from(sisAssessments).where(eq(sisAssessments.residentId, id)).orderBy(desc(sisAssessments.createdAt)).limit(1),
    db.select().from(carePlans).where(eq(carePlans.residentId, id)),
    db.select().from(careReports).where(eq(careReports.residentId, id)).orderBy(desc(careReports.createdAt)).limit(20),
    db.select().from(vitalSigns).where(eq(vitalSigns.residentId, id)).orderBy(desc(vitalSigns.recordedAt)).limit(100),
    db.select().from(medications).where(eq(medications.residentId, id)),
    db.select().from(medicationAdministrations).orderBy(desc(medicationAdministrations.scheduledAt)).limit(30),
    db.select().from(wounds).where(eq(wounds.residentId, id)),
    db.select().from(riskScores).where(eq(riskScores.residentId, id)).orderBy(desc(riskScores.computedAt)),
    db.select().from(incidents).where(eq(incidents.residentId, id)).orderBy(desc(incidents.occurredAt)).limit(10),
  ]);

  const sis = sisList[0];
  const pulse = vitals.filter((v) => v.type === "puls");
  const rrSys = vitals.filter((v) => v.type === "blutdruck_systolisch");
  const temp = vitals.filter((v) => v.type === "temperatur");
  const weight = vitals.filter((v) => v.type === "gewicht");

  const latestRisks = Object.values(
    risks.reduce<Record<string, typeof risks[number]>>((acc, r) => {
      if (!acc[r.type]) acc[r.type] = r;
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <Button asChild variant="ghost" size="sm"><Link href="/app/residents"><ArrowLeft className="h-4 w-4" /> Zurück zur Liste</Link></Button>

      {/* Header */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl">{initials(r.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-3xl font-semibold">{r.fullName}</h1>
              <Badge variant={r.pflegegrad >= 4 ? "warning" : "secondary"}>Pflegegrad {r.pflegegrad}</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {calcAge(r.birthdate)} Jahre · geboren {formatDate(r.birthdate)} · Zimmer {r.room} · {r.station} · Aufnahme {formatDate(r.admissionDate)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(r.allergies ?? []).slice(0, 3).map((a) => (
                <Badge key={a} variant="danger" className="gap-1"><AlertTriangle className="h-3 w-3" /> {a}</Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="accent" size="lg"><Mic className="h-4 w-4" /> Bericht diktieren</Button>
            <Button variant="outline" size="lg"><Plus className="h-4 w-4" /> Vitalwert</Button>
            <AkteExportDialog residentId={r.id} />
            <ExportButton endpoint={`/api/exports/medikationsplan/${r.id}/bmp`} label="BMP drucken" />
            <Button asChild variant="outline" size="lg" title="SIS als PDF drucken">
              <Link href={`/app/print/sis/${r.id}?print=auto`} target="_blank" rel="noopener">
                <Printer className="h-4 w-4" /> SIS drucken
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" title="Maßnahmenplan als PDF drucken">
              <Link href={`/app/print/massnahmen/${r.id}?print=auto`} target="_blank" rel="noopener">
                <Printer className="h-4 w-4" /> Maßnahmen drucken
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" title="Vitalzeichenverlauf als PDF drucken">
              <Link href={`/app/print/vitalzeichen/${r.id}?print=auto`} target="_blank" rel="noopener">
                <Printer className="h-4 w-4" /> Vitalzeichen drucken
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="sis">SIS</TabsTrigger>
          <TabsTrigger value="plan">Maßnahmenplan</TabsTrigger>
          <TabsTrigger value="reports">Tagesberichte</TabsTrigger>
          <TabsTrigger value="vitals">Vitalwerte</TabsTrigger>
          <TabsTrigger value="meds">Medikation</TabsTrigger>
          <TabsTrigger value="wounds">Wunddoku</TabsTrigger>
          <TabsTrigger value="risks">Risiken</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Stammdaten</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div><div className="text-xs uppercase text-muted-foreground">Diagnosen</div><div className="mt-1 flex flex-wrap gap-1">{(r.diagnoses ?? []).map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}</div></div>
                <div><div className="text-xs uppercase text-muted-foreground">Allergien</div><div className="mt-1 flex flex-wrap gap-1">{(r.allergies ?? []).map((a) => <Badge key={a} variant="danger">{a}</Badge>)}</div></div>
                <div className="md:col-span-2">
                  <div className="text-xs uppercase text-muted-foreground">Notfallkontakt</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{r.emergencyContact?.name}</span>
                    <span className="text-muted-foreground">({r.emergencyContact?.relation})</span>
                    <a href={`tel:${r.emergencyContact?.phone}`} className="text-primary hover:underline">{r.emergencyContact?.phone}</a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Risiko-Scores</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {latestRisks.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Scores berechnet.</p>}
                {latestRisks.map((r) => {
                  const cfg = riskLabels[r.type] ?? { name: r.type, color: "bg-secondary" };
                  const Icon = r.score > 6 ? TrendingUp : r.score < 3 ? TrendingDown : Minus;
                  return (
                    <div key={r.id} className={`flex items-center justify-between rounded-xl ${cfg.color} p-3`}>
                      <div>
                        <div className="font-semibold">{cfg.name}</div>
                        <div className="text-xs opacity-80">aktualisiert {timeAgo(r.computedAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-2xl font-semibold">{r.score.toFixed(1)}</span>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader><CardTitle>Letzte Vorfälle</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {incList.length === 0 && <p className="py-3 text-sm text-muted-foreground">Keine Vorfälle dokumentiert.</p>}
                {incList.map((i) => (
                  <div key={i.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={i.severity === "kritisch" ? "danger" : i.severity === "hoch" ? "warning" : "secondary"}>{i.severity}</Badge>
                        <span className="font-semibold">{i.type}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{i.description}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">{formatDateTime(i.occurredAt)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sis">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Strukturierte Informationssammlung (<GlossarTip term="sis">SIS</GlossarTip>)
                    <HelpTip label="Was ist SIS?">
                      Die SIS erfasst Pflegebedarf in 6 Themenfeldern (kognitiv, Mobilitaet, Selbstversorgung,
                      Leben in Beziehungen, Leben in besonderen Situationen, Haushaltsfuehrung) — inklusive
                      Befund, Ressourcen und Bedarfe.
                    </HelpTip>
                  </CardTitle>
                  {sis && <p className="text-sm text-muted-foreground">Zuletzt aktualisiert {formatDateTime(sis.updatedAt)}</p>}
                </div>
                <Button variant="outline">Bearbeiten</Button>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                {sisThemes.map((t) => {
                  const field = sis ? (sis as unknown as Record<string, { finding: string; resources: string; needs: string } | null>)[t.key] : null;
                  return (
                    <div key={t.key} className="rounded-xl border border-border p-4">
                      <div className="font-serif text-sm font-semibold text-primary">{t.title}</div>
                      {field ? (
                        <dl className="mt-2 space-y-2 text-sm">
                          <div><dt className="text-xs uppercase text-muted-foreground">Befund</dt><dd>{field.finding}</dd></div>
                          <div><dt className="text-xs uppercase text-muted-foreground">Ressourcen</dt><dd>{field.resources}</dd></div>
                          <div><dt className="text-xs uppercase text-muted-foreground">Bedarfe</dt><dd>{field.needs}</dd></div>
                        </dl>
                      ) : <p className="mt-2 text-sm text-muted-foreground">Noch nicht erfasst.</p>}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Risikomatrix R1 – R7</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {sis?.risikoMatrix ? Object.entries(sis.risikoMatrix).map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{k}</span>
                      <Badge variant={v.level === "hoch" ? "danger" : v.level === "mittel" ? "warning" : v.level === "niedrig" ? "info" : "secondary"}>{v.level}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Noch keine Risikomatrix erfasst.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Maßnahmenplan</CardTitle>
              <Button variant="accent"><Plus className="h-4 w-4" /> Maßnahme</Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {plans.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.title}</span>
                      <Badge variant={p.status === "erledigt" ? "success" : p.status === "laufend" ? "info" : "outline"}>{p.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{p.frequency} · verantwortlich: {p.responsibleRole}</p>
                  </div>
                </div>
              ))}
              {plans.length === 0 && <p className="py-3 text-sm text-muted-foreground">Noch keine Maßnahmen geplant.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tagesberichte</CardTitle>
              <Button variant="accent"><Mic className="h-4 w-4" /> Neuer Bericht</Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {reports.map((rep) => (
                <div key={rep.id} className="space-y-2 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{rep.shift}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDateTime(rep.createdAt)}</span>
                    {rep.signatureHash ? (
                      <Badge variant="success" className="gap-1"><Lock className="h-3 w-3" /> Signiert v{rep.version ?? 1}</Badge>
                    ) : (
                      <Badge variant="warning">Entwurf</Badge>
                    )}
                    <div className="ml-auto flex gap-2">
                      <ExportButton endpoint={`/api/exports/pflegebericht/${rep.id}/pdf`} label="PDF" />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{rep.content}</p>
                  {rep.sisTags && rep.sisTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">{rep.sisTags.map((t) => <Badge key={t} variant="outline">#{t}</Badge>)}</div>
                  )}
                  {rep.signatureHash && (
                    <div className="text-[10px] font-mono text-muted-foreground">SHA-256: {rep.signatureHash}</div>
                  )}
                </div>
              ))}
              {reports.length === 0 && <p className="py-3 text-sm text-muted-foreground">Noch keine Berichte.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <div className="grid gap-6 md:grid-cols-2">
            <Card><CardHeader><CardTitle>Puls</CardTitle></CardHeader><CardContent><VitalsChart data={pulse} label="Puls" unit="bpm" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Blutdruck (systolisch)</CardTitle></CardHeader><CardContent><VitalsChart data={rrSys} label="RR syst." unit="mmHg" color="#F97316" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Temperatur</CardTitle></CardHeader><CardContent><VitalsChart data={temp} label="Temp" unit="°C" color="#DC2626" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Gewicht</CardTitle></CardHeader><CardContent><VitalsChart data={weight} label="Gewicht" unit="kg" color="#0EA5E9" /></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="meds">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Medikationsplan</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {meds.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-sm text-muted-foreground">{m.dosage} · {m.frequency?.times.join(", ")} · Tage: {m.frequency?.days.join(", ")}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Verordnet von {m.prescribedBy}, seit {formatDate(m.startDate)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>MAR — Verabreichungen</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="py-2">Geplant</th><th>Verabreicht</th><th>Status</th><th>Notiz</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {marList.slice(0, 15).map((a) => (
                        <tr key={a.id}>
                          <td className="py-2">{formatDateTime(a.scheduledAt)}</td>
                          <td>{a.administeredAt ? formatDateTime(a.administeredAt) : "—"}</td>
                          <td><Badge variant={a.status === "verabreicht" ? "success" : a.status === "verweigert" ? "danger" : a.status === "ausgefallen" ? "warning" : "outline"}>{a.status}</Badge></td>
                          <td>{a.notes ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wounds">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wunddokumentation</CardTitle>
              <Button variant="accent"><Plus className="h-4 w-4" /> Wunde erfassen</Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {woundList.length === 0 && <p className="py-3 text-sm text-muted-foreground">Keine Wunden dokumentiert.</p>}
              {await Promise.all(woundList.map(async (w) => {
                const obs = await db.select().from(woundObservations).where(eq(woundObservations.woundId, w.id)).orderBy(desc(woundObservations.recordedAt)).limit(3);
                return (
                  <div key={w.id} className="py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Droplets className="h-4 w-4 text-accent" />
                      <span className="font-semibold">{w.location}</span>
                      <Badge variant={w.closedAt ? "success" : "warning"}>{w.closedAt ? "verheilt" : w.stage.replace("_", " ")}</Badge>
                      <span className="text-xs text-muted-foreground">seit {formatDate(w.openedAt)}</span>
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-3">
                      {obs.map((o) => (
                        <div key={o.id} className="rounded-xl border border-dashed border-border p-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Camera className="h-3 w-3" />{formatDate(o.recordedAt)}</div>
                          <p className="mt-1 text-sm">{o.observation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader><CardTitle>Risiko-Entwicklung</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {["sturz", "dekubitus", "delir"].map((type) => {
                  const series = risks.filter((r) => r.type === type).slice(0, 10).reverse();
                  const cfg = riskLabels[type];
                  const latest = series[series.length - 1];
                  const prev = series[series.length - 2];
                  const trend = latest && prev ? latest.score - prev.score : 0;
                  return (
                    <div key={type} className={`rounded-xl ${cfg.color} p-4`}>
                      <div className="font-semibold">{cfg.name}</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-serif text-4xl font-semibold">{latest?.score.toFixed(1) ?? "—"}</span>
                        <span className="text-sm">{trend > 0 ? "steigend" : trend < 0 ? "fallend" : "stabil"}</span>
                      </div>
                      <div className="mt-3 space-y-1 text-xs">
                        {series.slice(-5).map((s) => (
                          <div key={s.id} className="flex justify-between"><span>{formatDate(s.computedAt)}</span><span className="font-semibold">{s.score.toFixed(1)}</span></div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
