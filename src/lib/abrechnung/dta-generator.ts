/**
 * DTA-Datei-Generator nach § 302 SGB V (EDIFACT-artig).
 *
 * Format-Details siehe docs/research/krankenkassen-abrechnung.md.
 *
 * Dies ist eine Referenz-Implementierung, die den Struktur-Aufbau einer SLGA/SLLA-Datei
 * korrekt abbildet — vor Produktiv-Einsatz muss das Ergebnis gegen den TA-Validator
 * der ITSG bzw. der Kasse geprüft und nach Vorgabe der konkret empfangenden
 * Datenannahmestelle feinjustiert werden (Klein-Abweichungen je Kassen-Stelle
 * sind üblich).
 */

import type { DtaRecord, InvoicePosition } from "./types";
import { validateDta } from "./validator";

const SEG = "'"; // Segment-Abschluss
const EL = "+"; // Datenelement-Trenner
const COMP = ":"; // Komponenten-Trenner

/** YYYY-MM-DD → YYMMDD */
function toDtaDate(iso: string): string {
  // "2026-04-18" → "260418"
  return iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10);
}

function toDtaAmount(cent: number): string {
  // "15075" → "000000150,75"  (12 Zeichen, 9 vor Komma, 2 nach, Komma als Dezimalzeichen)
  const euro = Math.floor(cent / 100);
  const rest = cent % 100;
  return euro.toString().padStart(9, "0") + "," + rest.toString().padStart(2, "0");
}

function escapeIsoText(s: string): string {
  // DTA-Syntax: Zeichen +, :, ' und ? müssen mit ? escaped werden
  return s.replace(/([+:'?])/g, "?$1");
}

/**
 * Baut den SLGA-Block (Rechnungs-Kopf).
 */
export function buildSlga(record: DtaRecord): string {
  const { header, gesamtbetragCent } = record;
  const lines: string[] = [];
  // UNB Interchange Header
  lines.push(
    `UNB${EL}UNOC${COMP}3${EL}${header.senderIk}${COMP}30${EL}${header.empfaengerIk}${COMP}30${EL}${toDtaDate(
      new Date().toISOString().slice(0, 10),
    )}${COMP}1200${EL}${header.dateiNr.toString().padStart(8, "0")}${SEG}`,
  );
  // UNH Nachrichten-Kopf
  lines.push(`UNH${EL}${header.dateiNr.toString().padStart(4, "0")}${EL}SLGA${COMP}12${COMP}0${COMP}0${SEG}`);
  // FKT Funktionsgruppe
  lines.push(`FKT${EL}${header.fkt}${EL}${EL}${header.senderIk}${EL}${header.empfaengerIk}${SEG}`);
  // REC Rechnung
  lines.push(
    `REC${EL}1${COMP}1${EL}${toDtaDate(header.zeitraumVon)}${header.dateiNr.toString().padStart(4, "0")}${COMP}${toDtaDate(
      new Date().toISOString().slice(0, 10),
    )}${EL}${escapeIsoText(header.rechnungsNr)}${SEG}`,
  );
  // INV Rechnungs-Zeitraum + Gesamtbetrag
  lines.push(
    `INV${EL}${toDtaDate(header.zeitraumVon)}${COMP}${toDtaDate(header.zeitraumBis)}${EL}${record.positionen.length}${COMP}1${EL}${toDtaAmount(
      gesamtbetragCent,
    )}${SEG}`,
  );
  // GES Gesamtsumme
  lines.push(`GES${EL}${toDtaAmount(gesamtbetragCent)}${SEG}`);
  // UNT Nachrichten-Ende (Segmente-Anzahl inkl. UNH+UNT)
  const segCount = lines.length + 1 - 1; // minus UNB (gehört zu UNZ)
  lines.push(`UNT${EL}${segCount}${EL}${header.dateiNr.toString().padStart(4, "0")}${SEG}`);
  // UNZ Interchange-Ende
  lines.push(`UNZ${EL}1${EL}${header.dateiNr.toString().padStart(8, "0")}${SEG}`);
  return lines.join("\r\n");
}

/**
 * Baut den SLLA-Block (Einzelpositionen).
 */
export function buildSlla(record: DtaRecord): string {
  const { header, positionen } = record;
  const lines: string[] = [];
  lines.push(
    `UNB${EL}UNOC${COMP}3${EL}${header.senderIk}${COMP}30${EL}${header.empfaengerIk}${COMP}30${EL}${toDtaDate(
      new Date().toISOString().slice(0, 10),
    )}${COMP}1200${EL}${header.dateiNr.toString().padStart(8, "0")}${SEG}`,
  );
  lines.push(`UNH${EL}${header.dateiNr.toString().padStart(4, "0")}${EL}SLLA${COMP}12${COMP}0${COMP}0${SEG}`);
  lines.push(`FKT${EL}${header.fkt}${EL}${EL}${header.senderIk}${EL}${header.empfaengerIk}${SEG}`);

  for (const [i, pos] of positionen.entries()) {
    lines.push(`NAD${EL}${escapeIsoText(pos.versichertenNr)}${EL}${escapeIsoText(pos.versichertenName)}${SEG}`);
    lines.push(
      `ELP${EL}${i + 1}${EL}${pos.positionsNr}${EL}${toDtaDate(pos.datum)}${EL}${pos.menge.toString().padStart(6, "0")}${EL}${toDtaAmount(
        pos.einzelpreisCent,
      )}${EL}${toDtaAmount(pos.einzelpreisCent * pos.menge)}${SEG}`,
    );
    if (pos.hinweis) {
      lines.push(`BES${EL}${escapeIsoText(pos.hinweis)}${SEG}`);
    }
  }

  const segCount = lines.length - 1;
  lines.push(`UNT${EL}${segCount}${EL}${header.dateiNr.toString().padStart(4, "0")}${SEG}`);
  lines.push(`UNZ${EL}1${EL}${header.dateiNr.toString().padStart(8, "0")}${SEG}`);
  return lines.join("\r\n");
}

/** Ergebnis der DTA-Generierung. */
export interface DtaGenerationResult {
  valid: boolean;
  issues: ReturnType<typeof validateDta>["issues"];
  files: Array<{ filename: string; content: string }>;
}

export function buildDateiname(typ: "SLGA" | "SLLA", lfdNr: number, senderIk: string): string {
  // Konvention: TYP<LfdNr4>.<IK-letzte-3>
  return `${typ}${lfdNr.toString().padStart(4, "0")}.${senderIk.slice(-3)}`;
}

/**
 * Haupt-Entry: generiert SLGA + SLLA als Datei-Paar.
 */
export function generateDta(record: DtaRecord): DtaGenerationResult {
  const v = validateDta(record);
  if (!v.valid) {
    return { valid: false, issues: v.issues, files: [] };
  }
  const slga = buildSlga(record);
  const slla = buildSlla(record);
  return {
    valid: true,
    issues: v.issues,
    files: [
      { filename: buildDateiname("SLGA", record.header.dateiNr, record.header.senderIk), content: slga },
      { filename: buildDateiname("SLLA", record.header.dateiNr, record.header.senderIk), content: slla },
    ],
  };
}

/**
 * Gesamtbetrag aus Positionen berechnen (Helper).
 */
export function calcGesamtbetrag(positionen: InvoicePosition[]): number {
  return positionen.reduce((sum, p) => sum + p.einzelpreisCent * p.menge, 0);
}
