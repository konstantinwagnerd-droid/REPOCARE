/**
 * Medifox/Connext-Export-Parser.
 * Medifox exportiert typischerweise eine UTF-8-CSV mit Semikolon-Trennung
 * und Spalten: Nachname;Vorname;Geburtsdatum;Geschlecht;Pflegegrad;Zimmer;Einzug;...
 */

import type { ParseResult } from "../types";
import { parseGenericCsv } from "./generic-csv";

export function parseMedifox(text: string): ParseResult {
  const result = parseGenericCsv(text, { delimiter: ";", trimHeaders: true });
  return { ...result, source: "medifox" };
}

/** Default-Mapping für Medifox-Exports — wird im UI als Vorschlag angeboten. */
export const medifoxDefaultMapping: Array<{ source: string; target: string }> = [
  { source: "Vorname", target: "firstName" },
  { source: "Nachname", target: "lastName" },
  { source: "Geburtsdatum", target: "dateOfBirth" },
  { source: "Geschlecht", target: "gender" },
  { source: "Pflegegrad", target: "careLevel" },
  { source: "Zimmer", target: "room" },
  { source: "Einzugsdatum", target: "admissionDate" },
  { source: "Versicherungsnummer", target: "insuranceNumber" },
  { source: "Hauptdiagnose", target: "diagnosis" },
  { source: "Allergien", target: "allergies" },
  { source: "Medikation", target: "medication" },
  { source: "Angehoeriger", target: "emergencyContact" },
  { source: "AngehoerigerTelefon", target: "emergencyPhone" },
  { source: "Betreuer", target: "legalGuardian" },
  { source: "Notizen", target: "notes" },
];
