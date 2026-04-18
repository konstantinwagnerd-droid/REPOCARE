import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { residents, vitalSigns } from "@/db/schema";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, fmtDateTime, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

function parseDate(s: string | undefined, fallback: Date): Date {
  if (!s) return fallback;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

/**
 * Einfacher Unicode-Block-Trend: pro Messung ein Block (▁▂▃▄▅▆▇█) relativ
 * zum Min/Max-Wert der Serie.
 */
function renderTrend(values: number[]): string {
  const clean = values.filter((v) => Number.isFinite(v));
  if (clean.length < 2) return "—";
  const blocks = "▁▂▃▄▅▆▇█";
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;
  return clean
    .map((v) => blocks[Math.min(blocks.length - 1, Math.floor(((v - min) / range) * (blocks.length - 1)))])
    .join("");
}

export default async function VitalzeichenPrint({
  params,
  searchParams,
}: {
  params: Promise<{ residentId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { residentId } = await params;
  const sp = await searchParams;
  const ctx = await getPrintContext();

  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const from = parseDate(sp.from, defaultFrom);
  const to = parseDate(sp.to, now);

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) notFound();

  const rows = await db
    .select()
    .from(vitalSigns)
    .where(
      and(
        eq(vitalSigns.residentId, residentId),
        gte(vitalSigns.recordedAt, from),
        lte(vitalSigns.recordedAt, to),
      ),
    )
    .orderBy(asc(vitalSigns.recordedAt));

  // Gruppiert pro Typ für Trend
  const byType: Record<string, Array<{ value: number | null; valueText: string | null; at: Date }>> = {};
  for (const v of rows) {
    const arr = byType[v.type] ?? (byType[v.type] = []);
    arr.push({ value: v.valueNumeric, valueText: v.valueText, at: v.recordedAt });
  }

  return (
    <PrintPage title={`Vitalzeichen — ${r.fullName}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Vitalzeichen-Monitoring"
        title="Vitalzeichenverlauf"
        subtitle={r.fullName}
        meta={[
          { label: "Zeitraum", value: `${fmtDate(from)} – ${fmtDate(to)}` },
          { label: "Messungen", value: String(rows.length) },
          { label: "Zimmer", value: r.room },
        ]}
      />

      <PrintSection title="Bewohner" keepTogether>
        <PrintKV
          cols={3}
          items={[
            { label: "Name", value: r.fullName },
            { label: "Geburtsdatum", value: fmtDate(r.birthdate) },
            { label: "PG", value: `PG ${r.pflegegrad}` },
          ]}
        />
      </PrintSection>

      <PrintSection title="Trend-Übersicht pro Typ" keepTogether>
        <PrintTable
          columns={[
            { key: "type", label: "Messgröße", width: "18%" },
            { key: "count", label: "n", width: "6%", align: "right" },
            { key: "min", label: "Min", width: "10%", align: "right" },
            { key: "max", label: "Max", width: "10%", align: "right" },
            { key: "last", label: "Zuletzt", width: "16%" },
            { key: "trend", label: "Verlauf", width: "40%" },
          ]}
          rows={Object.entries(byType).map(([type, arr]) => {
            const numeric = arr.map((a) => a.value ?? NaN).filter((v) => Number.isFinite(v));
            const last = arr[arr.length - 1];
            return {
              type,
              count: arr.length,
              min: numeric.length ? Math.min(...numeric).toFixed(1) : "—",
              max: numeric.length ? Math.max(...numeric).toFixed(1) : "—",
              last: last ? `${last.valueText ?? last.value ?? "—"} (${fmtDate(last.at)})` : "—",
              trend: <span style={{ fontFamily: "monospace", letterSpacing: "0" }}>{renderTrend(numeric)}</span>,
            };
          })}
        />
      </PrintSection>

      <PrintSection title="Einzelmessungen (chronologisch)">
        <PrintTable
          columns={[
            { key: "at", label: "Zeitpunkt", width: "22%" },
            { key: "type", label: "Messgröße", width: "22%" },
            { key: "value", label: "Wert", width: "28%" },
            { key: "note", label: "Hinweis", width: "28%" },
          ]}
          rows={rows.map((v) => ({
            at: fmtDateTime(v.recordedAt),
            type: v.type,
            value: v.valueText ?? (v.valueNumeric != null ? v.valueNumeric.toFixed(1) : "—"),
            note: v.valueNumeric != null && v.valueText ? v.valueText : "—",
          }))}
        />
      </PrintSection>

      <PrintFooter facilityName={ctx.facilityName} documentId={`VZ-${r.id.slice(0, 8)}`} />
    </PrintPage>
  );
}
