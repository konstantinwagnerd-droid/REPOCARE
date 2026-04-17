// Re-Identifikations-Risiko-Bewertung (heuristisch).
// Berechnet realisiertes k und Anteil eindeutiger Quasi-Identifier.

import type { AnonymizedRecord, RiskAssessment } from "./types";

export function assessRisk(rows: AnonymizedRecord[]): RiskAssessment {
  if (rows.length === 0) {
    return { kAnonymity: 0, uniqueQuasiIdentifiers: 0, totalRows: 0, level: "niedrig", hinweise: ["Keine Daten zur Bewertung."] };
  }
  const QI = ["zimmer", "geschlecht", "alter", "pflegegrad", "herkunftsland"];
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const key = QI.map((f) => `${f}=${String(r[f] ?? "")}`).join("|");
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const bucketSizes = Object.values(counts);
  const k = bucketSizes.length ? Math.min(...bucketSizes) : 0;
  const uniqueBuckets = bucketSizes.filter((c) => c === 1).length;

  const hinweise: string[] = [];
  let level: RiskAssessment["level"];
  if (k >= 5) { level = "niedrig"; hinweise.push("k≥5 erreicht — gutes Anonymitätsniveau."); }
  else if (k >= 3) { level = "mittel"; hinweise.push("k=3 — akzeptabel für interne Nutzung, nicht für Publikation."); }
  else { level = "hoch"; hinweise.push("k<3 — einzelne Personen potenziell re-identifizierbar. Strategien verschärfen!"); }

  if (uniqueBuckets > 0) {
    hinweise.push(`${uniqueBuckets} eindeutige Quasi-Identifier-Kombinationen gefunden — diese Zeilen sind besonders gefährdet.`);
  }
  // Klartext-Felder warnen
  const sampleRow = rows[0];
  if (sampleRow.text && typeof sampleRow.text === "string" && sampleRow.text.length > 200) {
    hinweise.push('Lange Freitext-Felder erkannt — empfohlen: „Freitext kürzen" aktivieren.');
  }
  if (sampleRow.vorname && sampleRow.vorname !== "Bewohner:in") {
    hinweise.push('Realnamen erkannt — empfohlen: „Namen pseudonymisieren" aktivieren.');
  }

  return {
    kAnonymity: k,
    uniqueQuasiIdentifiers: uniqueBuckets,
    totalRows: rows.length,
    level,
    hinweise,
  };
}
