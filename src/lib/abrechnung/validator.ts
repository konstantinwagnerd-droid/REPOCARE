/**
 * Validator für DTA-Daten gegen TA § 302 SGB V Schema.
 *
 * Prüft:
 *  - IK-Prüfziffer (Modulo-10 nach ARGE-IK Spec)
 *  - Pflicht-Felder
 *  - Summen-Konsistenz
 *  - Zeichensatz-Konformität (ISO-8859-15)
 */

import type { DtaRecord, InvoicePosition, IkNumber } from "./types";

export interface ValidationIssue {
  severity: "error" | "warning";
  code: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

/**
 * Validiert eine 9-stellige IK-Nummer gem. ARGE-IK Modulo-10.
 * IK-Struktur: Klasse(2) + BL(3) + LfdNr(3) + Prüfziffer(1)
 * Prüfziffer = Modulo-10 über Stellen 1-8 gewichtet 2,1,2,1,...
 */
export function isValidIk(raw: string): raw is IkNumber {
  if (!/^\d{9}$/.test(raw)) return false;
  const digits = raw.split("").map(Number);
  const checkDigit = digits[8];
  const weights = [2, 1, 2, 1, 2, 1, 2, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const product = digits[i] * weights[i];
    // Quersumme bei zweistelligen Zwischenergebnissen
    sum += product >= 10 ? Math.floor(product / 10) + (product % 10) : product;
  }
  const computed = (10 - (sum % 10)) % 10;
  return computed === checkDigit;
}

export function toIkNumber(raw: string): IkNumber {
  if (!isValidIk(raw)) throw new Error(`Ungültige IK-Nummer: ${raw}`);
  return raw as IkNumber;
}

/** Prüft ob String in ISO-8859-15 darstellbar ist. */
export function isIso885915Safe(s: string): boolean {
  // ISO-8859-15 = Latin-9; erlaubt fast alle üblichen DE/AT-Zeichen + €, Š, š, Ž, ž, Œ, œ, Ÿ
  // Einfacher Check: keine Codepoints > 0x017F außer den wenigen 8859-15-Erweiterungen
  const allowed = new Set([0x20ac, 0x0160, 0x0161, 0x017d, 0x017e, 0x0152, 0x0153, 0x0178]);
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (cp <= 0xff) continue;
    if (allowed.has(cp)) continue;
    return false;
  }
  return true;
}

export function validateDta(record: DtaRecord): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Header-Validierung
  if (!isValidIk(record.header.senderIk)) {
    issues.push({ severity: "error", code: "E010", field: "header.senderIk", message: "Ungültige Sender-IK (Prüfziffer falsch)" });
  }
  if (!isValidIk(record.header.empfaengerIk)) {
    issues.push({ severity: "error", code: "E010", field: "header.empfaengerIk", message: "Ungültige Empfänger-IK" });
  }
  if (!record.header.rechnungsNr || record.header.rechnungsNr.length > 20) {
    issues.push({ severity: "error", code: "E100", field: "header.rechnungsNr", message: "Rechnungs-Nr fehlt oder > 20 Zeichen" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.header.zeitraumVon)) {
    issues.push({ severity: "error", code: "E101", message: "Zeitraum-Von nicht ISO-Datum" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.header.zeitraumBis)) {
    issues.push({ severity: "error", code: "E101", message: "Zeitraum-Bis nicht ISO-Datum" });
  }
  if (record.header.zeitraumBis < record.header.zeitraumVon) {
    issues.push({ severity: "error", code: "E102", message: "Zeitraum-Bis vor Zeitraum-Von" });
  }

  // Positionen
  if (record.positionen.length === 0) {
    issues.push({ severity: "error", code: "E200", message: "Keine Abrechnungs-Positionen in der Sendung" });
  }

  let berechnet = 0;
  for (const [i, pos] of record.positionen.entries()) {
    const prefix = `positionen[${i}]`;
    if (!/^\d{5}$/.test(pos.positionsNr)) {
      issues.push({ severity: "error", code: "E030", field: `${prefix}.positionsNr`, message: `Positionsnummer "${pos.positionsNr}" hat kein gültiges 5-stelliges Format` });
    }
    if (pos.menge <= 0) {
      issues.push({ severity: "error", code: "E210", field: `${prefix}.menge`, message: "Menge muss > 0 sein" });
    }
    if (pos.einzelpreisCent < 0) {
      issues.push({ severity: "error", code: "E220", field: `${prefix}.einzelpreisCent`, message: "Negativer Einzelpreis nicht zulässig" });
    }
    if (!pos.versichertenNr) {
      issues.push({ severity: "error", code: "E020", field: `${prefix}.versichertenNr`, message: "Versicherten-Nr fehlt" });
    }
    if (!isValidIk(pos.kostentraegerIk)) {
      issues.push({ severity: "error", code: "E010", field: `${prefix}.kostentraegerIk`, message: "Ungültige Kostenträger-IK" });
    }
    if (!isIso885915Safe(pos.versichertenName) || (pos.hinweis && !isIso885915Safe(pos.hinweis))) {
      issues.push({ severity: "warning", code: "W300", field: `${prefix}.versichertenName`, message: "Name/Hinweis enthält Zeichen außerhalb ISO-8859-15" });
    }
    berechnet += pos.einzelpreisCent * pos.menge;
  }

  // Summen-Konsistenz
  if (berechnet !== record.gesamtbetragCent) {
    issues.push({
      severity: "error",
      code: "E040",
      field: "gesamtbetragCent",
      message: `Summen-Inkonsistenz: SLLA ergibt ${berechnet} Cent, SLGA-Summe behauptet ${record.gesamtbetragCent} Cent`,
    });
  }

  const hasError = issues.some((i) => i.severity === "error");
  return { valid: !hasError, issues };
}
