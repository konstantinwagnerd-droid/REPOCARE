import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { residents, carePlans, riskScores } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

/**
 * Maßnahmenplan — Route per residentId (alle aktiven Pläne eines Bewohners).
 * Struktur: Stammdaten → Risiken → Ziele (SMART) → Maßnahmen pro Tageszeit.
 */
export default async function MassnahmenPrint({
  params,
}: {
  params: Promise<{ residentId: string }>;
}) {
  const { residentId } = await params;
  const ctx = await getPrintContext();

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) notFound();

  const plans = await db
    .select()
    .from(carePlans)
    .where(eq(carePlans.residentId, residentId))
    .orderBy(desc(carePlans.createdAt));

  const risks = await db
    .select()
    .from(riskScores)
    .where(eq(riskScores.residentId, residentId))
    .orderBy(desc(riskScores.computedAt));

  // Maßnahmen grob nach Tageszeit-Indikator in frequency klassifizieren
  const timeSlots: Record<string, typeof plans> = {
    Früh: [],
    Mittag: [],
    Nachmittag: [],
    Abend: [],
    Nacht: [],
    "Bei Bedarf / Täglich": [],
  };
  for (const p of plans) {
    const f = (p.frequency ?? "").toLowerCase();
    if (f.includes("früh") || f.includes("morgen")) timeSlots.Früh.push(p);
    else if (f.includes("mittag")) timeSlots.Mittag.push(p);
    else if (f.includes("nachmittag")) timeSlots.Nachmittag.push(p);
    else if (f.includes("abend")) timeSlots.Abend.push(p);
    else if (f.includes("nacht")) timeSlots.Nacht.push(p);
    else timeSlots["Bei Bedarf / Täglich"].push(p);
  }

  return (
    <PrintPage title={`Maßnahmenplan — ${r.fullName}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Maßnahmenplan nach § 113b SGB XI"
        title="Individueller Maßnahmenplan"
        subtitle={r.fullName}
        meta={[
          { label: "Zimmer", value: r.room },
          { label: "PG", value: `PG ${r.pflegegrad}` },
          { label: "Gültig ab", value: fmtDate(new Date()) },
        ]}
      />

      <PrintSection title="Bewohner-Daten" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Name", value: r.fullName },
            { label: "Geburtsdatum", value: fmtDate(r.birthdate) },
            { label: "Aufnahme", value: fmtDate(r.admissionDate) },
            { label: "Pflegegrad", value: `PG ${r.pflegegrad}` },
            { label: "Hauptdiagnosen", value: (r.diagnoses ?? []).join(", ") || "—" },
            { label: "Allergien", value: (r.allergies ?? []).join(", ") || "—" },
          ]}
        />
      </PrintSection>

      {risks.length > 0 ? (
        <PrintSection title="Ermittelte Risiken" keepTogether>
          <PrintTable
            columns={[
              { key: "type", label: "Risiko", width: "30%" },
              { key: "score", label: "Score", width: "15%" },
              { key: "level", label: "Stufe", width: "20%" },
              { key: "computed", label: "Erhoben am", width: "35%" },
            ]}
            rows={risks.slice(0, 10).map((x) => ({
              type: x.type,
              score: x.score.toFixed(1),
              level: x.score >= 3 ? "hoch" : x.score >= 2 ? "mittel" : "niedrig",
              computed: fmtDate(x.computedAt),
            }))}
          />
        </PrintSection>
      ) : null}

      <PrintSection title="Pflegeziele (SMART)">
        <ul style={{ paddingLeft: "5mm", margin: 0, fontSize: "9.5pt" }}>
          {plans.slice(0, 8).map((p) => (
            <li key={p.id} style={{ marginBottom: "1.5mm" }}>
              <strong>{p.title}</strong> — {p.description}
              {p.dueDate ? <em style={{ color: "#5C6664" }}> (Evaluation bis {fmtDate(p.dueDate)})</em> : null}
            </li>
          ))}
          {plans.length === 0 ? <li><em style={{ color: "#5C6664" }}>Noch keine Pflegeziele hinterlegt.</em></li> : null}
        </ul>
      </PrintSection>

      <PrintSection title="Maßnahmen nach Tageszeit">
        {Object.entries(timeSlots).map(([slot, list]) =>
          list.length === 0 ? null : (
            <div key={slot} style={{ marginBottom: "3mm", pageBreakInside: "avoid" }}>
              <div style={{ fontWeight: 700, color: "#0E6B67", marginBottom: "1mm" }}>{slot}</div>
              <PrintTable
                columns={[
                  { key: "title", label: "Maßnahme", width: "28%" },
                  { key: "description", label: "Durchführung", width: "44%" },
                  { key: "frequency", label: "Frequenz", width: "16%" },
                  { key: "responsible", label: "Zuständig", width: "12%" },
                ]}
                rows={list.map((p) => ({
                  title: p.title,
                  description: p.description,
                  frequency: p.frequency,
                  responsible: p.responsibleRole,
                }))}
              />
            </div>
          ),
        )}
      </PrintSection>

      <PrintSignatures
        slots={[
          { label: "Bezugspflegekraft", role: "Pflegefachkraft", date: fmtDate(new Date()) },
          { label: "Bewohner / Angehörige", role: "Einverständnis", date: fmtDate(new Date()) },
          { label: "Pflegedienstleitung", role: "PDL" },
        ]}
        note="Der Maßnahmenplan wurde mit dem Bewohner/Angehörigen besprochen und einvernehmlich festgelegt."
      />

      <PrintFooter facilityName={ctx.facilityName} documentId={`MP-${r.id.slice(0, 8)}`} />
    </PrintPage>
  );
}
