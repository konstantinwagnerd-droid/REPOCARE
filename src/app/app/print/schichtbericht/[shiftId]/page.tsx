import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { shifts, users, residents, vitalSigns, careReports, incidents } from "@/db/schema";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, fmtDateTime, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

const shiftLabel: Record<string, string> = { frueh: "Frühdienst", spaet: "Spätdienst", nacht: "Nachtdienst" };

function deriveShiftKind(startsAt: Date): "frueh" | "spaet" | "nacht" {
  const h = startsAt.getHours();
  if (h >= 5 && h < 13) return "frueh";
  if (h >= 13 && h < 21) return "spaet";
  return "nacht";
}

export default async function SchichtberichtPrint({
  params,
}: {
  params: Promise<{ shiftId: string }>;
}) {
  const { shiftId } = await params;
  const ctx = await getPrintContext();

  const [shift] = await db.select().from(shifts).where(eq(shifts.id, shiftId)).limit(1);
  if (!shift) notFound();

  const [pflegekraft] = await db.select().from(users).where(eq(users.id, shift.userId)).limit(1);

  const stationResidents = await db
    .select()
    .from(residents)
    .where(and(eq(residents.tenantId, shift.tenantId), eq(residents.station, shift.station)));

  const residentIds = stationResidents.map((r) => r.id);

  // Neueste Vitals + Reports + Vorkommnisse pro Bewohner fuer den Schicht-Zeitraum
  const vitalsDuring = residentIds.length
    ? await db
        .select()
        .from(vitalSigns)
        .where(
          and(
            sql`${vitalSigns.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(vitalSigns.recordedAt, shift.startsAt),
            lte(vitalSigns.recordedAt, shift.endsAt),
          ),
        )
        .orderBy(desc(vitalSigns.recordedAt))
    : [];

  const reportsDuring = residentIds.length
    ? await db
        .select()
        .from(careReports)
        .where(
          and(
            sql`${careReports.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(careReports.createdAt, shift.startsAt),
            lte(careReports.createdAt, shift.endsAt),
          ),
        )
    : [];

  const incidentsDuring = residentIds.length
    ? await db
        .select()
        .from(incidents)
        .where(
          and(
            sql`${incidents.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(incidents.occurredAt, shift.startsAt),
            lte(incidents.occurredAt, shift.endsAt),
          ),
        )
    : [];

  const rows = stationResidents.map((r) => {
    const v = vitalsDuring.find((x) => x.residentId === r.id);
    const rep = reportsDuring.find((x) => x.residentId === r.id);
    const inc = incidentsDuring.find((x) => x.residentId === r.id);
    return {
      name: `${r.fullName} · Zi. ${r.room}`,
      pg: `PG ${r.pflegegrad}`,
      vitals: v ? `${v.type}: ${v.valueText ?? v.valueNumeric ?? "—"}` : "—",
      stimmung: r.wellbeingScore != null ? `${r.wellbeingScore}/10` : "—",
      vorfall: inc ? `${inc.type} (${inc.severity})` : rep?.aiStructured?.concerns?.[0] ?? "—",
    };
  });

  return (
    <PrintPage title={`Schichtübergabe ${shiftLabel[deriveShiftKind(shift.startsAt)]}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Schichtübergabe-Bericht"
        title={shiftLabel[deriveShiftKind(shift.startsAt)]}
        subtitle={`${shift.station} · ${fmtDate(shift.startsAt)}`}
        meta={[
          { label: "Dienst-Beginn", value: fmtDateTime(shift.startsAt) },
          { label: "Dienst-Ende", value: fmtDateTime(shift.endsAt) },
          { label: "Pflegekraft", value: pflegekraft?.fullName ?? "—" },
        ]}
      />

      <PrintSection title="Schicht-Übersicht" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Station", value: shift.station },
            { label: "Bewohner im Dienst", value: stationResidents.length },
            { label: "Vitalzeichen erfasst", value: vitalsDuring.length },
            { label: "Berichte geschrieben", value: reportsDuring.length },
            { label: "Vorkommnisse", value: incidentsDuring.length },
          ]}
        />
      </PrintSection>

      <PrintSection title="Bewohner-Übersicht">
        <PrintTable
          columns={[
            { key: "name", label: "Bewohner / Zimmer", width: "34%" },
            { key: "pg", label: "PG", width: "8%" },
            { key: "vitals", label: "Letzte Vitalzeichen", width: "20%" },
            { key: "stimmung", label: "Stimmung", width: "10%" },
            { key: "vorfall", label: "Vorkommnis / Auffälligkeit", width: "28%" },
          ]}
          rows={rows}
        />
      </PrintSection>

      {incidentsDuring.length > 0 ? (
        <PrintSection title="Vorkommnisse im Detail" keepTogether>
          <ul style={{ paddingLeft: "5mm", margin: 0 }}>
            {incidentsDuring.map((i) => (
              <li key={i.id} style={{ marginBottom: "1.5mm" }}>
                <strong>{fmtDateTime(i.occurredAt)}</strong> — {i.type} ({i.severity}): {i.description}
              </li>
            ))}
          </ul>
        </PrintSection>
      ) : null}

      <PrintSignatures
        slots={[
          { label: "Übergebende Pflegekraft", name: pflegekraft?.fullName, role: "Pflegekraft", date: fmtDate(shift.endsAt) },
          { label: "Übernehmende Pflegekraft", role: "Pflegekraft" },
        ]}
        note="Beide Parteien bestätigen mit Unterschrift die ordnungsgemäße Übergabe des Dienstes."
      />

      <PrintFooter
        facilityName={ctx.facilityName}
        documentId={`SB-${shift.id.slice(0, 8)}`}
        generatedAt={new Date()}
      />
    </PrintPage>
  );
}
