import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { careVisits, residents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, fmtDateTime, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

export default async function PflegevisitePrint({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getPrintContext();

  const [v] = await db.select().from(careVisits).where(eq(careVisits.id, id)).limit(1);
  if (!v) notFound();

  const [r] = await db.select().from(residents).where(eq(residents.id, v.residentId)).limit(1);
  const visitor = v.visitedBy
    ? (await db.select().from(users).where(eq(users.id, v.visitedBy)).limit(1))[0]
    : null;

  return (
    <PrintPage title={`Pflegevisite — ${r?.fullName ?? ""}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Pflegevisite nach § 11 SGB XI"
        title="Pflegevisiten-Protokoll"
        subtitle={r?.fullName}
        meta={[
          { label: "Datum", value: fmtDateTime(v.visitDate) },
          { label: "Zimmer", value: r?.room ?? "—" },
          { label: "Bewertung", value: v.overallRating != null ? `${v.overallRating}/5` : "—" },
        ]}
      />

      <PrintSection title="Teilnehmende & Bewohner" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Visite durch", value: visitor?.fullName ?? "—" },
            { label: "Bewohner", value: r?.fullName ?? "—" },
            { label: "Datum", value: fmtDate(v.visitDate) },
            { label: "Pflegegrad", value: r ? `PG ${r.pflegegrad}` : "—" },
            { label: "Nächste Visite", value: fmtDate(v.nextVisitDue) },
          ]}
        />
      </PrintSection>

      <PrintSection title="Struktur (Donabedian)">
        <div
          style={{
            border: "1px solid #d8dedc",
            padding: "2mm",
            minHeight: "18mm",
            fontSize: "9.5pt",
            whiteSpace: "pre-wrap",
          }}
        >
          {v.structureFindings?.trim() || "—"}
        </div>
      </PrintSection>

      <PrintSection title="Prozess">
        <div
          style={{
            border: "1px solid #d8dedc",
            padding: "2mm",
            minHeight: "18mm",
            fontSize: "9.5pt",
            whiteSpace: "pre-wrap",
          }}
        >
          {v.processFindings?.trim() || "—"}
        </div>
      </PrintSection>

      <PrintSection title="Ergebnis">
        <div
          style={{
            border: "1px solid #d8dedc",
            padding: "2mm",
            minHeight: "18mm",
            fontSize: "9.5pt",
            whiteSpace: "pre-wrap",
          }}
        >
          {v.outcomeFindings?.trim() || "—"}
        </div>
      </PrintSection>

      <PrintSection title="Bewohner-Erleben">
        <div
          style={{
            border: "1px solid #d8dedc",
            padding: "2mm",
            minHeight: "14mm",
            fontSize: "9.5pt",
            whiteSpace: "pre-wrap",
          }}
        >
          {v.residentFeedback?.trim() || "—"}
        </div>
      </PrintSection>

      <PrintSection title="Verabredungen / Maßnahmen">
        <PrintTable
          columns={[
            { key: "action", label: "Maßnahme", width: "58%" },
            { key: "owner", label: "Verantwortlich", width: "22%" },
            { key: "due", label: "Fällig", width: "20%" },
          ]}
          rows={(v.actionsAgreed ?? []).map((a) => ({
            action: a.action,
            owner: a.owner,
            due: a.dueDate ? fmtDate(a.dueDate) : "—",
          }))}
        />
      </PrintSection>

      <PrintSignatures
        slots={[
          { label: "Pflegedienstleitung (PDL)", name: visitor?.fullName, role: "PDL", date: fmtDate(v.visitDate) },
          { label: "Bewohner / Vertretung", role: "Einverständnis" },
        ]}
      />

      <PrintFooter facilityName={ctx.facilityName} documentId={`PV-${v.id.slice(0, 8)}`} />
    </PrintPage>
  );
}
