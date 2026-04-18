/**
 * Risk-Assessment v1 — Vital-Werte + Historie → Risk-Scores.
 * Modelle: Braden (Dekubitus), Tinetti/Morse (Sturz), CAM (Delir), Dehydration-Indikatoren.
 */
import type { LLMRequest } from "../types";

export const RISK_ASSESSMENT_V1_KEY = "risk-assessment-v1";

const RISK_SYSTEM_V1 = `Du bist ein Pflegefachexperte und bewertest Risiken nach etablierten Skalen.

Bewerte diese 4 Risiken (Score 0.0..1.0, wobei 1.0 = maximales Risiko):
- STURZ (Morse/Tinetti-basiert): Alter, Mobilität, Historie von Stürzen, kognitive Beeinträchtigung, Medikamente (BZD, Antihypertensiva).
- DEKUBITUS (Braden-basiert): Immobilität, Ernährung, Inkontinenz, Reibung, Hautzustand.
- DELIR (CAM-basiert): akute Verwirrtheit, Aufmerksamkeitsstörung, desorganisiertes Denken, veränderter Bewusstseinszustand.
- DEHYDRATION: Flüssigkeitsaufnahme, Hautturgor, Haut-/Schleimhautzeichen, Vitalwerte (Tachykardie, Hypotonie).

REGELN:
- Arbeite nur mit den gegebenen Daten. Bei fehlenden Daten → niedrigerer Confidence.
- Nenne konkrete Faktoren (kein Allgemein-Blabla).
- Empfehlung kurz, umsetzbar.

JSON-Schema:
{
  "risks": {
    "sturz": {"score": 0.0..1.0, "factors": ["..."], "recommendation": "...", "confidence": 0.0..1.0},
    "dekubitus": {...},
    "delir": {...},
    "dehydration": {...}
  }
}`;

export interface RiskAssessInput {
  residentName: string;
  age: number;
  pflegegrad: number;
  diagnoses: string[];
  medications: string[];
  recentVitals: Array<{ type: string; value: number | string; unit?: string; at: string }>;
  recentIncidents: Array<{ type: string; severity: string; at: string }>;
  mobilityNotes?: string;
  nutritionNotes?: string;
}

export function buildRiskAssessV1(params: RiskAssessInput): LLMRequest {
  const vitals = params.recentVitals.slice(0, 20).map((v) => `- ${v.type}: ${v.value}${v.unit ?? ""} (${v.at})`).join("\n") || "keine";
  const incs = params.recentIncidents.map((i) => `- ${i.type} (${i.severity}, ${i.at})`).join("\n") || "keine";
  const user = [
    `Bewohner: ${params.residentName}, Alter ${params.age}, Pflegegrad ${params.pflegegrad}`,
    `Diagnosen: ${params.diagnoses.join(", ") || "keine"}`,
    `Medikamente: ${params.medications.join(", ") || "keine"}`,
    `Vitalwerte (letzte):\n${vitals}`,
    `Vorkommnisse:\n${incs}`,
    params.mobilityNotes ? `Mobilität: ${params.mobilityNotes}` : "",
    params.nutritionNotes ? `Ernährung: ${params.nutritionNotes}` : "",
    "",
    "Gib Risk-Scores für Sturz, Dekubitus, Delir, Dehydration (JSON).",
  ].filter(Boolean).join("\n");

  return {
    system: RISK_SYSTEM_V1,
    promptKey: RISK_ASSESSMENT_V1_KEY,
    temperature: 0.2,
    maxTokens: 1200,
    jsonMode: true,
    messages: [{ role: "user", content: user }],
  };
}
