import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { incidents, residents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { fmtDate, fmtDateTime, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

export default async function IncidentPrint({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getPrintContext();

  const [i] = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1);
  if (!i) notFound();

  const [r] = await db.select().from(residents).where(eq(residents.id, i.residentId)).limit(1);
  const reporter = i.reportedBy
    ? (await db.select().from(users).where(eq(users.id, i.reportedBy)).limit(1))[0]
    : null;

  return (
    <PrintPage title={`Ereignismeldung — ${i.type}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Ereignis- / Incident-Meldung"
        title={`Ereignismeldung: ${i.type}`}
        subtitle={r?.fullName}
        meta={[
          { label: "Schweregrad", value: i.severity },
          { label: "Ereignis-Zeit", value: fmtDateTime(i.occurredAt) },
          { label: "Gemeldet am", value: fmtDate(new Date()) },
        ]}
      />

      <PrintSection title="Bewohner" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Name", value: r?.fullName ?? "—" },
            { label: "Zimmer", value: r?.room ?? "—" },
            { label: "Geburtsdatum", value: fmtDate(r?.birthdate ?? null) },
            { label: "PG", value: r ? `PG ${r.pflegegrad}` : "—" },
          ]}
        />
      </PrintSection>

      <PrintSection title="5-W-Methode" keepTogether>
        <PrintKV
          cols={1}
          items={[
            { label: "Wer", value: reporter?.fullName ?? "—" },
            { label: "Was", value: i.type },
            { label: "Wann", value: fmtDateTime(i.occurredAt) },
            { label: "Wo", value: r?.station ? `${r.station}, Zimmer ${r.room}` : "—" },
            { label: "Wie / Hergang", value: i.description },
          ]}
        />
      </PrintSection>

      <PrintSection title="Sofortmaßnahmen & Benachrichtigungen" keepTogether>
        <div style={{ fontSize: "9.5pt", lineHeight: 1.5 }}>
          <div style={{ marginBottom: "1mm" }}>
            <strong>Getroffene Sofortmaßnahmen:</strong>
          </div>
          <div
            style={{
              border: "1px solid #d8dedc",
              minHeight: "14mm",
              padding: "2mm",
              marginBottom: "3mm",
            }}
          >
            {/* Freitextbereich zum handschriftlichen Ergänzen */}
            {"\u00A0"}
          </div>
          <div style={{ marginBottom: "1mm" }}>
            <strong>Benachrichtigungen:</strong>
          </div>
          <ul style={{ paddingLeft: "5mm", margin: 0 }}>
            <li>Arzt/Ärztin: ☐ informiert — Name: ________________</li>
            <li>Angehörige: ☐ informiert — Name: _______________</li>
            <li>PDL: ☐ informiert</li>
            <li>Einrichtungsleitung: ☐ informiert</li>
            <li>Heimaufsicht (wenn erforderlich): ☐ informiert</li>
          </ul>
        </div>
      </PrintSection>

      <PrintSection title="Folgen / Nachsorge">
        <div
          style={{
            border: "1px solid #d8dedc",
            minHeight: "20mm",
            padding: "2mm",
            fontSize: "9.5pt",
          }}
        >
          {"\u00A0"}
        </div>
      </PrintSection>

      <PrintSignatures
        slots={[
          { label: "Meldende:r Mitarbeiter:in", name: reporter?.fullName, role: "Pflegekraft", date: fmtDate(new Date()) },
          { label: "Pflegedienstleitung", role: "PDL" },
        ]}
        note="Ereignismeldung im CIRS-System archivieren und bei meldepflichtigen Ereignissen an Behörden weiterleiten."
      />

      <PrintFooter
        facilityName={ctx.facilityName}
        documentId={`INC-${i.id.slice(0, 8)}`}
        note={`Schweregrad: ${i.severity.toUpperCase()}`}
      />
    </PrintPage>
  );
}
