/**
 * DAN-Produkte (GES.SYS, PflegePlus) Export-Parser.
 * DAN exportiert XML mit <Bewohner>-Elementen oder CSV (Tab-separiert).
 * Wir unterstützen beide Formate und erkennen automatisch.
 */

import type { ParseResult, ParsedRecord, ValidationError } from "../types";
import { parseGenericCsv } from "./generic-csv";
import { parseSimpleXml } from "./xml-lite";

export function parseDan(text: string): ParseResult {
  const trimmed = text.trimStart();
  if (trimmed.startsWith("<?xml") || trimmed.startsWith("<")) {
    return parseDanXml(text);
  }
  const result = parseGenericCsv(text, { delimiter: "\t", trimHeaders: true });
  return { ...result, source: "dan" };
}

function parseDanXml(xml: string): ParseResult {
  const errors: ValidationError[] = [];
  const records: ParsedRecord[] = [];
  const detectedFields = new Set<string>();

  try {
    const nodes = parseSimpleXml(xml, "Bewohner");
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
      code: "DAN_XML_PARSE",
      message: `XML-Parse-Fehler: ${(err as Error).message}`,
    });
  }

  return {
    source: "dan",
    totalRecords: records.length,
    detectedFields: Array.from(detectedFields),
    records,
    parseErrors: errors,
  };
}

export const danDefaultMapping: Array<{ source: string; target: string }> = [
  { source: "VName", target: "firstName" },
  { source: "NName", target: "lastName" },
  { source: "GebDat", target: "dateOfBirth" },
  { source: "Geschl", target: "gender" },
  { source: "PGrad", target: "careLevel" },
  { source: "Zi", target: "room" },
  { source: "EinzDat", target: "admissionDate" },
  { source: "VersNr", target: "insuranceNumber" },
  { source: "Diagnose", target: "diagnosis" },
  { source: "Allergie", target: "allergies" },
  { source: "Medikation", target: "medication" },
  { source: "Kontakt", target: "emergencyContact" },
  { source: "KontaktTel", target: "emergencyPhone" },
  { source: "Vormund", target: "legalGuardian" },
  { source: "Bemerkung", target: "notes" },
];
