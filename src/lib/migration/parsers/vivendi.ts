/**
 * Vivendi PD (Connext) Export-Parser.
 * Vivendi exportiert XML mit Root <VivendiExport> und <Klient>-Elementen.
 */

import type { ParseResult, ParsedRecord, ValidationError } from "../types";
import { parseSimpleXml } from "./xml-lite";

export function parseVivendi(text: string): ParseResult {
  const errors: ValidationError[] = [];
  const records: ParsedRecord[] = [];
  const detectedFields = new Set<string>();

  try {
    const nodes = parseSimpleXml(text, "Klient");
    nodes.forEach((node, idx) => {
      const raw: Record<string, string> = {};
      Object.entries(node).forEach(([k, v]) => {
        raw[k] = String(v ?? "");
        detectedFields.add(k);
      });
      records.push({ raw, row: idx + 1 });
    });
  } catch (err) {
    errors.push({
      row: 0,
      severity: "error",
      code: "VIVENDI_XML_PARSE",
      message: `XML-Parse-Fehler: ${(err as Error).message}`,
    });
  }

  return {
    source: "vivendi",
    totalRecords: records.length,
    detectedFields: Array.from(detectedFields),
    records,
    parseErrors: errors,
  };
}

export const vivendiDefaultMapping: Array<{ source: string; target: string }> = [
  { source: "Vorname", target: "firstName" },
  { source: "Nachname", target: "lastName" },
  { source: "Geburtstag", target: "dateOfBirth" },
  { source: "Geschlecht", target: "gender" },
  { source: "Pflegegrad", target: "careLevel" },
  { source: "Zimmernummer", target: "room" },
  { source: "AufnahmeDatum", target: "admissionDate" },
  { source: "KVNummer", target: "insuranceNumber" },
  { source: "Diagnose", target: "diagnosis" },
  { source: "Allergien", target: "allergies" },
  { source: "Medikamente", target: "medication" },
  { source: "Bezugsperson", target: "emergencyContact" },
  { source: "BezugspersonTelefon", target: "emergencyPhone" },
  { source: "Betreuer", target: "legalGuardian" },
  { source: "Freitext", target: "notes" },
];
