import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, sisAssessments, careReports, carePlans, riskScores, vitalSigns } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Gap = { severity: "rot" | "gelb" | "gruen"; type: string; detail: string };

export default async function DokuCheckPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const resList = await db.select().from(residents).where(and(eq(residents.tenantId, tenantId), isNull(residents.deletedAt)));

  const now = new Date();
  const sixMonthsAgo = new Date(now); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const threeDaysAgo = new Date(now.getTime() - 3 * 86400 * 1000);

  const rows = await Promise.all(resList.map(async (r) => {
    const [latestSis] = await db.select().from(sisAssessments).where(eq(sisAssessments.residentId, r.id)).orderBy(desc(sisAssessments.createdAt)).limit(1);
    const [latestReport] = await db.select().from(careReports).where(eq(careReports.residentId, r.id)).orderBy(desc(careReports.createdAt)).limit(1);
    const plans = await db.select().from(carePlans).where(eq(carePlans.residentId, r.id));
    const [latestRisk] = await db.select().from(riskScores).where(eq(riskScores.residentId, r.id)).orderBy(desc(riskScores.computedAt)).limit(1);
    const recentVitals = await db.select().from(vitalSigns).where(eq(vitalSigns.residentId, r.id)).orderBy(desc(vitalSigns.recordedAt)).limit(1);

    const gaps: Gap[] = [];
    if (!latestSis || new Date(latestSis.createdAt) < sixMonthsAgo) {
      gaps.push({ severity: "rot", type: "SIS fehlt/veraltet", detail: latestSis ? `zuletzt ${formatDate(latestSis.createdAt)}` : "nie erstellt" });
    }
    if (!latestReport || new Date(latestReport.createdAt) < threeDaysAgo) {
      gaps.push({ severity: "rot", type: "Pflegebericht >3 Tage", detail: latestReport ? `zuletzt ${formatDate(latestReport.createdAt)}` : "kein Bericht" });
    }
    if (plans.length === 0) {
      gaps.push({ severity: "gelb", type: "Kein Maßnahmenplan", detail: "Maßnahmenplan erstellen" });
    }
    const highRisk = latestRisk && latestRisk.score > 6;
    if (highRisk && (!recentVitals[0] || new Date(recentVitals[0].recordedAt).getTime() < Date.now() - 48 * 3600 * 1000)) {
      gaps.push({ severity: "gelb", type: "Vitalwerte-Lücke bei Risiko-Bewohner:in", detail: latestRisk ? `Score ${latestRisk.score.toFixed(1)}` : "" });
    }

    const worst: Gap["severity"] = gaps.some((g) => g.severity === "rot") ? "rot" : gaps.some((g) => g.severity === "gelb") ? "gelb" : "gruen";
    return { resident: r, gaps, worst };
  }));

  const red = rows.filter((x) => x.worst === "rot").length;
  const yellow = rows.filter((x) => x.worst === "gelb").length;
  const green = rows.filter((x) => x.worst === "gruen").length;

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Dokumentations-Vollständigkeit</h1>
        <p className="mt-1 text-muted-foreground">Lücken-Analyse für die MD-/NQZ-Vorbereitung. Alle aktiven Bewohner:innen.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-6"><AlertCircle className="h-8 w-8 text-red-600" /><div><div className="text-2xl font-semibold">{red}</div><div className="text-sm text-muted-foreground">Kritische Lücken</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-6"><AlertTriangle className="h-8 w-8 text-amber-600" /><div><div className="text-2xl font-semibold">{yellow}</div><div className="text-sm text-muted-foreground">Hinweise</div></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-6"><CheckCircle2 className="h-8 w-8 text-emerald-600" /><div><div className="text-2xl font-semibold">{green}</div><div className="text-sm text-muted-foreground">Vollständig</div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Bewohner-Status</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="p-3">Status</th><th>Bewohner:in</th><th>Lücken</th><th>Aktion</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(({ resident, gaps, worst }) => (
                <tr key={resident.id}>
                  <td className="p-3">
                    <Badge variant={worst === "rot" ? "danger" : worst === "gelb" ? "warning" : "success"}>
                      {worst === "rot" ? "kritisch" : worst === "gelb" ? "hinweis" : "ok"}
                    </Badge>
                  </td>
                  <td className="font-medium">{resident.fullName}<span className="ml-2 text-xs text-muted-foreground">Zimmer {resident.room}</span></td>
                  <td>
                    {gaps.length === 0 && <span className="text-sm text-emerald-700">keine Lücken</span>}
                    <ul className="space-y-1 text-sm">
                      {gaps.map((g, i) => (
                        <li key={i} className="flex gap-2">
                          <span className={g.severity === "rot" ? "text-red-600" : "text-amber-600"}>●</span>
                          <span>{g.type} <span className="text-muted-foreground">— {g.detail}</span></span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td><Button asChild size="sm" variant="outline"><Link href={`/app/residents/${resident.id}`}>Öffnen</Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
