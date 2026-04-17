/**
 * SenSo (Atoss / Sensopflege) Export-Parser.
 * SenSo exportiert CSV (Semikolon) mit deutschen Umlauten in Windows-1252 oder UTF-8.
 * Spalten sind typischerweise ProzentZeichen-getrennt nummeriert.
 */

import type { ParseResult } from "../types";
import { parseGenericCsv } from "./generic-csv";

export function parseSenso(text: string): ParseResult {
  const result = parseGenericCsv(text, { delimiter: ";", trimHeaders: true });
  return { ...result, source: "senso" };
}

export const sensoDefaultMapping: Array<{ source: string; target: string }> = [
  { source: "K_Vorname", target: "firstName" },
  { source: "K_Nachname", target: "lastName" },
  { source: "K_Geburtsdatum", target: "dateOfBirth" },
  { source: "K_Geschlecht", target: "gender" },
  { source: "K_Pflegegrad", target: "careLevel" },
  { source: "K_Zimmer", target: "room" },
  { source: "K_Aufnahme", target: "admissionDate" },
  { source: "K_Versicherung", target: "insuranceNumber" },
  { source: "K_Diagnose", target: "diagnosis" },
  { source: "K_Allergien", target: "allergies" },
  { source: "K_Medikation", target: "medication" },
  { source: "K_Notfall", target: "emergencyContact" },
  { source: "K_NotfallTel", target: "emergencyPhone" },
  { source: "K_Betreuer", target: "legalGuardian" },
  { source: "K_Notiz", target: "notes" },
];
