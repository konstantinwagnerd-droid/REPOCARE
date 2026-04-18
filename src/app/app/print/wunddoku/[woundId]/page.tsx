import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { wounds, woundObservations, woundMeasurements, residents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, fmtDateTime, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

export default async function WundDokuPrint({
  params,
}: {
  params: Promise<{ woundId: string }>;
}) {
  const { woundId } = await params;
  const ctx = await getPrintContext();

  const [w] = await db.select().from(wounds).where(eq(wounds.id, woundId)).limit(1);
  if (!w) notFound();

  const [r] = await db.select().from(residents).where(eq(residents.id, w.residentId)).limit(1);
  const observations = await db
    .select()
    .from(woundObservations)
    .where(eq(woundObservations.woundId, woundId))
    .orderBy(desc(woundObservations.recordedAt))
    .limit(20);
  const measurements = await db
    .select()
    .from(woundMeasurements)
    .where(eq(woundMeasurements.woundId, woundId))
    .orderBy(desc(woundMeasurements.measuredAt))
    .limit(20);

  const neueste = measurements[0];

  return (
    <PrintPage title={`Wunddoku — ${r?.fullName ?? "Wunde"}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="DNQP Expertenstandard Chronische Wunden 2015"
        title="Wunddokumentation"
        subtitle={r?.fullName ?? ""}
        meta={[
          { label: "Lokalisation", value: w.location },
          { label: "Typ", value: w.type },
          { label: "Stadium", value: w.stage },
          { label: "Wunde seit", value: fmtDate(w.openedAt) },
        ]}
      />

      <PrintSection title="Bewohner & Wund-Stammdaten" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Bewohner", value: r?.fullName ?? "—" },
            { label: "Zimmer", value: r?.room ?? "—" },
            { label: "Geburtsdatum", value: fmtDate(r?.birthdate ?? null) },
            { label: "PG", value: r ? `PG ${r.pflegegrad}` : "—" },
            { label: "Wund-Typ", value: w.type },
            { label: "Klassifikation / Stadium", value: w.stage },
            { label: "Lokalisation", value: w.location },
            { label: "Wunde seit", value: fmtDate(w.openedAt) },
            { label: "Abgeheilt am", value: fmtDate(w.closedAt) },
          ]}
        />
      </PrintSection>

      <PrintSection title="Body-Chart (Lokalisation)" keepTogether>
        <div
          style={{
            border: "1px solid #d8dedc",
            padding: "3mm",
            height: "35mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5C6664",
            fontSize: "8.5pt",
          }}
        >
          ⬚ Body-Chart-Skizze hier einzeichnen — Lokalisation: <strong style={{ color: "#1A1D1C", marginLeft: "1.5mm" }}>{w.location}</strong>
        </div>
      </PrintSection>

      {neueste ? (
        <PrintSection title="Aktuelle Vermessung (TIME-Prinzip)" keepTogether>
          <PrintKV
            cols={3}
            items={[
              { label: "Länge", value: `${neueste.lengthMm} mm` },
              { label: "Breite", value: `${neueste.widthMm} mm` },
              { label: "Tiefe", value: neueste.depthMm != null ? `${neueste.depthMm} mm` : "—" },
              { label: "Fläche", value: neueste.areaMm2 != null ? `${(neueste.areaMm2 / 100).toFixed(1)} cm²` : "—" },
              { label: "Exsudat", value: neueste.exudate ?? "—" },
              { label: "Wundbett", value: neueste.woundBed ?? "—" },
              { label: "Wundrand", value: neueste.edges ?? "—" },
              { label: "Umgebung", value: neueste.surrounding ?? "—" },
              { label: "Schmerz (NRS)", value: neueste.painScore != null ? `${neueste.painScore}/10` : "—" },
              { label: "Geruch", value: neueste.odor ? "ja" : "nein" },
              { label: "Gemessen am", value: fmtDateTime(neueste.measuredAt) },
            ]}
          />
        </PrintSection>
      ) : null}

      <PrintSection title="Verlauf (Messwerte)">
        <PrintTable
          columns={[
            { key: "date", label: "Datum", width: "18%" },
            { key: "lbt", label: "L × B × T (mm)", width: "18%" },
            { key: "flaeche", label: "Fläche (cm²)", width: "12%" },
            { key: "exudat", label: "Exsudat", width: "12%" },
            { key: "bett", label: "Wundbett", width: "16%" },
            { key: "pain", label: "Schmerz", width: "8%" },
            { key: "note", label: "Hinweis", width: "16%" },
          ]}
          rows={measurements.map((m) => ({
            date: fmtDate(m.measuredAt),
            lbt: `${m.lengthMm} × ${m.widthMm} × ${m.depthMm ?? "–"}`,
            flaeche: m.areaMm2 != null ? (m.areaMm2 / 100).toFixed(1) : "—",
            exudat: m.exudate ?? "—",
            bett: m.woundBed ?? "—",
            pain: m.painScore != null ? `${m.painScore}/10` : "—",
            note: m.edges ?? "—",
          }))}
        />
      </PrintSection>

      <PrintSection title="Beobachtungen & Therapie-Plan">
        <ul style={{ paddingLeft: "5mm", margin: 0, fontSize: "9.5pt" }}>
          {observations.slice(0, 10).map((o) => (
            <li key={o.id} style={{ marginBottom: "1.2mm" }}>
              <strong>{fmtDateTime(o.recordedAt)}</strong>: {o.observation}
            </li>
          ))}
          {observations.length === 0 ? <li><em style={{ color: "#5C6664" }}>Keine Beobachtungen erfasst.</em></li> : null}
        </ul>
      </PrintSection>

      <PrintSignatures
        slots={[
          { label: "Wundmanager:in", role: "Zertifiziert", date: fmtDate(new Date()) },
          { label: "Behandelnde:r Arzt/Ärztin", role: "Arzt/Ärztin" },
        ]}
        note="Dokumentation gemäß DNQP-Expertenstandard Chronische Wunden und ICW-Standard."
      />

      <PrintFooter facilityName={ctx.facilityName} documentId={`WD-${w.id.slice(0, 8)}`} />
    </PrintPage>
  );
}
