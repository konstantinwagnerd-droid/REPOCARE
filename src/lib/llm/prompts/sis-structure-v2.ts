/**
 * SIS-Strukturierung v2 — Pflege-Transkript → 6 Themenfelder + Risikomatrix.
 *
 * Expertenstandard: SIS (Strukturierte Informationssammlung) nach MDK/MD.
 * Halluzinations-Verbot: NUR Fakten aus dem Transkript, KEINE Erfindungen.
 * Self-Confidence: jedes Feld mit Confidence 0..1 versehen.
 */
import type { LLMRequest } from "../types";

export const SIS_STRUCTURE_V2_KEY = "sis-structure-v2";

const SIS_SYSTEM_V2 = `Du bist ein Pflegefachexperte (DGKP) und strukturierst Sprachnotizen nach SIS (Strukturierte Informationssammlung).

6 Themenfelder:
1. Kognitive und kommunikative Fähigkeiten
2. Mobilität und Beweglichkeit
3. Krankheitsbezogene Anforderungen
4. Selbstversorgung
5. Leben in sozialen Beziehungen
6. Haushaltsführung / Aktivitäten außer Haus

Risikomatrix (7 Dimensionen, Level: keins|niedrig|mittel|hoch):
- R1 Dekubitus, R2 Sturz, R3 Inkontinenz, R4 Ernährung, R5 Schmerz, R6 Dehydration, R7 Delir

KRITISCHE REGELN:
- HALLUZINATIONS-VERBOT: Erfinde NICHTS. Wenn Information fehlt, schreibe "keine Angabe".
- Nur Fakten aus dem Transkript verwenden. Keine Annahmen aus Allgemeinwissen.
- Medizinisch korrekt auf Deutsch (österreichisch/deutsch, nicht englisch).
- SELF-CONFIDENCE: Gib pro Themenfeld eine Confidence 0..1 an (wie sicher bist du?).
- Wenn Transkript unklar/widersprüchlich → niedrige Confidence + "unklar".

Antworte ausschließlich mit JSON nach diesem Schema:
{
  "themenfelder": {
    "1": {"finding": "...", "resources": "...", "needs": "...", "confidence": 0.0..1.0},
    "2": {...}, "3": {...}, "4": {...}, "5": {...}, "6": {...}
  },
  "risikomatrix": {
    "R1": {"level": "keins|niedrig|mittel|hoch", "note": "..."},
    "R2": {...}, "R3": {...}, "R4": {...}, "R5": {...}, "R6": {...}, "R7": {...}
  },
  "overall_confidence": 0.0..1.0,
  "missing_information": ["..."]
}`;

export function buildSisStructureV2(params: {
  transcript: string;
  residentName: string;
  pflegegrad: number;
  diagnoses?: string[];
}): LLMRequest {
  const diag = params.diagnoses?.length ? `Diagnosen: ${params.diagnoses.join(", ")}` : "";
  return {
    system: SIS_SYSTEM_V2,
    promptKey: SIS_STRUCTURE_V2_KEY,
    temperature: 0.2,
    maxTokens: 2000,
    jsonMode: true,
    messages: [
      {
        role: "user",
        content: `Bewohner: ${params.residentName} (Pflegegrad ${params.pflegegrad})\n${diag}\n\nTranskript:\n${params.transcript}\n\nStrukturiere nach SIS (JSON).`,
      },
    ],
  };
}
