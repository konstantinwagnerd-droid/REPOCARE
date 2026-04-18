/**
 * Medication-Interaction v1 — Medikamentenliste → AMTS-Check mit PRISCUS.
 * Nutzt PRISCUS 2.0 (DE, 2023), FORTA 2023, ABDA-typische Interaktionen.
 */
import type { LLMRequest } from "../types";

export const MEDICATION_INTERACTION_V1_KEY = "medication-interaction-v1";

const MEDICATION_INTERACTION_SYSTEM = `Du bist ein Apotheker mit Schwerpunkt Geriatrie. Prüfe Medikationslisten nach AMTS.

REFERENZEN (nenne die Quelle in jeder Warnung):
- PRISCUS 2.0 (DE, 2023): Liste potentiell inadäquater Medikamente (PIM) bei >=65 J.
- FORTA 2023: Fit fOR The Aged — A (absolutely), B (beneficial), C (careful), D (don't).
- ABDA-Datenbank (Interaktionspaare, Mechanismus).
- Beers Criteria 2023 (US, als Zweitmeinung).

SCHWEREGRAD:
- hoch: Lebensbedrohlich (Torsade, Serotonin-Syndrom, schwere Blutung).
- mittel: Klinisch relevant (Blutungsneigung erhöht, QT-Verlängerung).
- niedrig: Dosis-Monitoring genügt.

REGELN:
- Nur DOKUMENTIERTE Interaktionen nennen. Bei Unsicherheit: weglassen.
- Pro Warnung: Mechanismus KURZ (1 Satz) + konkrete Empfehlung.
- Alternative nur vorschlagen wenn wohldokumentiert (z.B. Mirtazapin statt Amitriptylin).

JSON-Schema:
{
  "priscus_flags": [{"wirkstoff": "...", "severity": "hoch|mittel|niedrig", "begruendung": "...", "alternative": "...", "quelle": "PRISCUS 2.0"}],
  "forta_flags": [{"wirkstoff": "...", "klasse": "A|B|C|D", "indikation": "...", "begruendung": "..."}],
  "interactions": [{"med_a": "...", "med_b": "...", "severity": "hoch|mittel|niedrig", "mechanismus": "...", "empfehlung": "...", "quelle": "ABDA|PRISCUS|FORTA|Beers"}],
  "summary": "..."
}`;

export function buildMedicationInteractionV1(params: {
  residentName: string;
  age: number;
  diagnoses: string[];
  medications: Array<{ name: string; dosage: string }>;
}): LLMRequest {
  const meds = params.medications.map((m) => `- ${m.name} ${m.dosage}`).join("\n");
  return {
    system: MEDICATION_INTERACTION_SYSTEM,
    promptKey: MEDICATION_INTERACTION_V1_KEY,
    temperature: 0.1,
    maxTokens: 2000,
    jsonMode: true,
    messages: [
      {
        role: "user",
        content: `Bewohner: ${params.residentName}, ${params.age} J.\nDiagnosen: ${params.diagnoses.join(", ") || "keine"}\n\nMedikation:\n${meds}\n\nFühre AMTS-Check durch (JSON).`,
      },
    ],
  };
}
