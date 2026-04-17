/**
 * PII-Scanner für DSGVO-Compliance der Trainings-Datasets.
 *
 * Konservativ: lieber einen False-Positive als ein durchgerutschtes PII.
 * Scannt Inputs auf typische deutsche PII-Muster.
 */

import type { DatasetEntry, PiiScanResult } from "./types";

// German first/last name allowlist for common synthetic labels — these are OK
const ALLOWLIST_NAMES = new Set([
  "Bewohner",
  "Bewohnerin",
  "Frau A.",
  "Frau B.",
  "Frau M.",
  "Herr A.",
  "Herr B.",
  "Herr M.",
  "Tochter",
  "Sohn",
  "PDL",
  "Pflegekraft",
  "Hausarzt",
]);

// Common German surname indicators — anything beyond single-letter suffix is suspect
const SURNAME_PATTERN = /\b(?:Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]{2,})\b/g;

const PHONE_PATTERN = /\b(?:\+49|0)[\s\-]?\(?\d{2,5}\)?[\s\-]?\d{3,}[\s\-]?\d{2,}\b/g;
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const DATE_OF_BIRTH_PATTERN = /\b(?:geb\.|geboren\s+am)\s+\d{1,2}\.\s?\d{1,2}\.\s?(?:19|20)\d{2}\b/gi;
const ADDRESS_PATTERN = /\b[A-ZÄÖÜ][a-zäöüß]+(?:straße|weg|platz|gasse|allee)\s+\d+/gi;
const INSURANCE_NUMBER_PATTERN = /\b[A-Z]\d{9}\b/g;

export function scanEntry(entry: DatasetEntry): PiiScanResult | null {
  const findings: PiiScanResult["findings"] = [];
  const text = `${entry.input}\n${entry.output}`;

  let match: RegExpExecArray | null;

  SURNAME_PATTERN.lastIndex = 0;
  while ((match = SURNAME_PATTERN.exec(text)) !== null) {
    const surname = match[1];
    if (!ALLOWLIST_NAMES.has(surname) && surname.length > 2) {
      findings.push({ type: "name", value: match[0], position: match.index });
    }
  }

  for (const [pattern, type] of [
    [PHONE_PATTERN, "phone"],
    [EMAIL_PATTERN, "email"],
    [DATE_OF_BIRTH_PATTERN, "date_of_birth"],
    [ADDRESS_PATTERN, "address"],
    [INSURANCE_NUMBER_PATTERN, "medical_id"],
  ] as const) {
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      findings.push({ type, value: match[0], position: match.index });
    }
  }

  if (findings.length === 0) return null;
  return { entryId: entry.id, findings };
}

export function scanDataset(entries: DatasetEntry[]): PiiScanResult[] {
  const results: PiiScanResult[] = [];
  for (const e of entries) {
    const r = scanEntry(e);
    if (r) results.push(r);
  }
  return results;
}

export function isClean(entries: DatasetEntry[]): boolean {
  return scanDataset(entries).length === 0;
}
