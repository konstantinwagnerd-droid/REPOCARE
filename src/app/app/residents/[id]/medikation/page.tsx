/**
 * Bewohner → Medikation → AMTS-Check Tab.
 *
 * Zeigt pro Medikament: PRISCUS, FORTA-Klasse, Interaktionen mit anderen Medikamenten.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db/client";
import { residents, medications } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { reviewMedications, type FortaKlasse } from "@/lib/amts";

export const metadata = { title: "Medikation · AMTS · CareAI" };
export const dynamic = "force-dynamic";

function fortaBadge(k: FortaKlasse | undefined) {
  if (!k) return null;
  const map: Record<FortaKlasse, string> = {
    A: "bg-emerald-100 text-emerald-900",
    B: "bg-sky-100 text-sky-900",
    C: "bg-amber-100 text-amber-900",
    D: "bg-rose-100 text-rose-900",
  };
  return <Badge className={map[k]}>FORTA {k}</Badge>;
}

function sevBadge(sev: "hoch" | "mittel" | "niedrig") {
  const map = {
    hoch: "bg-rose-100 text-rose-900",
    mittel: "bg-amber-100 text-amber-900",
    niedrig: "bg-stone-100 text-stone-800",
  };
  return <Badge className={map[sev]}>{sev}</Badge>;
}

export default async function ResidentMedikationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [r] = await db.select().from(residents).where(eq(residents.id, id)).limit(1);
  if (!r) notFound();

  const age = Math.floor((Date.now() - new Date(r.birthdate).getTime()) / (365.25 * 24 * 3600 * 1000));
  const meds = await db.select().from(medications).where(
    and(eq(medications.residentId, id), isNull(medications.endDate)),
  );

  const review = reviewMedications(meds.map((m) => m.name));

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div>
        <Link href={`/app/residents/${id}`} className="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Zurück zur Akte
        </Link>
      </div>

      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Medikation &amp; AMTS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {r.fullName}, {age} Jahre · {meds.length} aktive Medikamente · Schlimmster Schweregrad:{" "}
          {review.worstSeverity === "keine" ? (
            <span className="text-emerald-700 font-medium inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> unauffällig</span>
          ) : sevBadge(review.worstSeverity)}
        </p>
      </header>

      {age < 65 ? (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" />
            <span>PRISCUS 2.0 und FORTA sind primär für ≥65 J. validiert. Anzeige hier mit reduzierter Relevanz.</span>
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="meds">
        <TabsList>
          <TabsTrigger value="meds">Medikamente ({meds.length})</TabsTrigger>
          <TabsTrigger value="priscus">
            PRISCUS ({review.priscus.length})
          </TabsTrigger>
          <TabsTrigger value="forta">FORTA ({review.forta.length})</TabsTrigger>
          <TabsTrigger value="interactions">
            Interaktionen ({review.interactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meds">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Wirkstoff</th>
                    <th className="p-3 text-left">Dosis</th>
                    <th className="p-3 text-left">PRISCUS</th>
                    <th className="p-3 text-left">FORTA</th>
                  </tr>
                </thead>
                <tbody>
                  {meds.map((m) => {
                    const pr = review.priscus.find((x) => x.wirkstoff === m.name);
                    const fo = review.forta.find((x) => x.wirkstoff === m.name);
                    return (
                      <tr key={m.id} className="border-t">
                        <td className="p-3 font-medium">{m.name}</td>
                        <td className="p-3 text-xs text-muted-foreground">{m.dosage}</td>
                        <td className="p-3">
                          {pr ? (
                            <Badge className={pr.eintrag.priscus_bewertung === "vermeiden" ? "bg-rose-100 text-rose-900" : "bg-amber-100 text-amber-900"}>
                              {pr.eintrag.priscus_bewertung}
                            </Badge>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="p-3">{fo ? fortaBadge(fo.worst) : <span className="text-xs text-muted-foreground">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priscus">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> PRISCUS 2.0 Warnungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {review.priscus.length === 0 ? (
                <p className="text-sm text-emerald-700">Keine PRISCUS-Auffälligkeiten.</p>
              ) : review.priscus.map((p, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <strong>{p.wirkstoff}</strong>
                    <Badge className={p.eintrag.priscus_bewertung === "vermeiden" ? "bg-rose-100 text-rose-900" : "bg-amber-100 text-amber-900"}>
                      {p.eintrag.priscus_bewertung}
                    </Badge>
                    <span className="text-xs text-muted-foreground">({p.eintrag.klasse})</span>
                  </div>
                  <p className="text-sm">{p.eintrag.begruendung}</p>
                  {p.eintrag.alternative ? (
                    <p className="text-sm text-muted-foreground"><strong>Alternative:</strong> {p.eintrag.alternative}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">Quelle: PRISCUS 2.0 (DE, 2023)</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forta">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Wirkstoff</th>
                    <th className="p-3 text-left">Indikation</th>
                    <th className="p-3 text-left">Klasse</th>
                    <th className="p-3 text-left">Begründung</th>
                  </tr>
                </thead>
                <tbody>
                  {review.forta.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Keine FORTA-Einträge.</td></tr>
                  ) : review.forta.flatMap((f) =>
                      f.eintraege.map((e, j) => (
                        <tr key={`${f.wirkstoff}-${j}`} className="border-t">
                          <td className="p-3 font-medium">{f.wirkstoff}</td>
                          <td className="p-3 text-xs">{e.indikation}</td>
                          <td className="p-3">{fortaBadge(e.forta_klasse)}</td>
                          <td className="p-3 text-sm">{e.begruendung}</td>
                        </tr>
                      )),
                    )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card>
            <CardContent className="space-y-3 p-4">
              {review.interactions.length === 0 ? (
                <p className="text-sm text-emerald-700">Keine bekannten Interaktionen zwischen den aktuellen Medikamenten.</p>
              ) : review.interactions.map((i, idx) => (
                <div key={idx} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{i.medikament_a}</strong>
                    <span className="text-muted-foreground">↔</span>
                    <strong>{i.medikament_b}</strong>
                    {sevBadge(i.severity)}
                    <Badge variant="outline" className="text-xs">{i.quelle}</Badge>
                  </div>
                  <p className="text-sm"><strong>Mechanismus:</strong> {i.mechanismus}</p>
                  <p className="text-sm"><strong>Empfehlung:</strong> {i.empfehlung}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 flex-wrap text-xs">
        <Badge variant="outline">PRISCUS 2.0</Badge>
        <Badge variant="outline">FORTA 2023</Badge>
        <Badge variant="outline">ABDA</Badge>
        <Badge variant="outline">Beers 2023</Badge>
      </div>
    </div>
  );
}
