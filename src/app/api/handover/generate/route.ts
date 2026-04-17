import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { residents, careReports, vitalSigns, incidents, carePlans } from "@/db/schema";
import { desc, gte, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const tenantId = session.user.tenantId;

  const [residentList, recentReports, recentVitals, recentIncidents, openPlans] = await Promise.all([
    db.select().from(residents).where(eq(residents.tenantId, tenantId)).limit(10),
    db.select().from(careReports).orderBy(desc(careReports.createdAt)).limit(20),
    db.select().from(vitalSigns).where(gte(vitalSigns.recordedAt, since)).limit(50),
    db.select().from(incidents).where(gte(incidents.occurredAt, since)).limit(10),
    db.select().from(carePlans).where(eq(carePlans.status, "offen")).limit(10),
  ]);

  // Template-based handover generation (demo-honest, Claude API in production)
  const date = format(new Date(), "EEEE, dd. MMMM yyyy", { locale: de });
  const shift = new Date().getHours() < 14 ? "Früh" : new Date().getHours() < 22 ? "Spät" : "Nacht";
  const nextShift = shift === "Früh" ? "Spät" : shift === "Spät" ? "Nacht" : "Früh";

  const handover = `# KI-Schichtbericht — ${date}
## Übergabe ${shift}schicht → ${nextShift}schicht
*Automatisch generiert aus den letzten 24h Dokumentationen. Bitte prüfen und ggf. ergänzen.*

---

## Statistik Schicht
- Bewohner:innen gesamt: **${residentList.length}**
- Berichte in letzten 24h: **${recentReports.length}**
- Vitalwerte erfasst: **${recentVitals.length}**
- Vorfälle: **${recentIncidents.length}**
- Offene Maßnahmen: **${openPlans.length}**

---

## Allgemeine Lage
Die ${shift}schicht verlief ${recentIncidents.length === 0 ? "weitgehend ruhig ohne kritische Vorfälle" : `mit ${recentIncidents.length} dokumentierten Vorfall/Vorfällen — Details unten`}. ${recentVitals.length > 0 ? `${recentVitals.length} Vitalwertemessungen wurden durchgeführt und dokumentiert.` : ""}

---

## Bewohner:innen — Highlights

${residentList.slice(0, 5).map((r, i) => {
  const reports = recentReports.filter((rep) => rep.residentId === r.id);
  return `### ${i + 1}. ${r.fullName} (Zi. ${r.room})
- **Pflegegrad:** ${r.pflegegrad}
- **Berichte heute:** ${reports.length}
${reports[0] ? `- **Letzter Eintrag:** ${reports[0].content.slice(0, 120)}...` : "- Keine neuen Berichte in letzten 24h."}
`;
}).join("\n")}

---

## Offene Maßnahmen für ${nextShift}schicht

${openPlans.length === 0 ? "Keine offenen Maßnahmen. ✓" : openPlans.slice(0, 6).map((p, i) => `${i + 1}. **${p.title}** — ${p.frequency} (${p.responsibleRole})\n   ${p.description}`).join("\n\n")}

---

## Vorfälle 24h

${recentIncidents.length === 0 ? "Keine Vorfälle. ✓" : recentIncidents.map((inc) => `- **${inc.severity.toUpperCase()}:** ${inc.type} — ${inc.description.slice(0, 100)}`).join("\n")}

---

## Übergabe-Checkliste
- [ ] Alle Medikamente für ${nextShift}schicht bereitgestellt
- [ ] Vitalwerte-Protokoll übergeben
- [ ] Besondere Beobachtungen mündlich ergänzt
- [ ] Dienstbuch unterschrieben

---
*Dieser Bericht wurde automatisch aus der Datenbank erstellt. CareAI v1.0 — KI-Dokumentationsassistent für die Pflege.*`;

  return NextResponse.json({ handover, generatedAt: new Date().toISOString() });
}
