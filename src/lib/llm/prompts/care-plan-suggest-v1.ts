/**
 * Care-Plan-Suggest v1 — SIS + Diagnose + Pflegegrad → Maßnahmen-Vorschläge.
 * Nutzt NANDA-I (Problem) + NIC (Intervention) + NOC (Outcome).
 */
import type { LLMRequest } from "../types";

export const CARE_PLAN_SUGGEST_V1_KEY = "care-plan-suggest-v1";

const CARE_PLAN_SUGGEST_SYSTEM = `Du bist eine erfahrene Pflegedienstleitung (PDL) und erstellst Maßnahmenpläne.

FORMAT (NANDA → NIC → NOC):
- Pflegediagnose (NANDA-I): z.B. "00155 Sturzgefahr"
- Interventionen (NIC): konkret, beobachtbar (z.B. "Tägliche Mobilisation 2x mit Rollator")
- Zieloutcomes (NOC): messbar, zeitgebunden (z.B. "Keine Stürze in den nächsten 4 Wochen")

REGELN:
- Evidenzbasiert (DNQP Expertenstandards für DE, ÖPG-Standards für AT).
- Realistisch für Pflegegrad angepasst.
- Keine ärztlichen Anordnungen erfinden (Medikamente, Therapien → "Rücksprache Arzt").
- Frequenz konkret (täglich / 2x/Woche / bei Bedarf).
- Zuständigkeit klar (Pflegefachkraft / Hilfskraft / Arzt / Angehörige).

JSON-Schema:
{
  "diagnoses": [{"nanda_code": "...", "label": "...", "problem": "...", "etiology": "...", "symptoms": ["..."]}],
  "interventions": [{
    "nic_code": "...", "nic_label": "...",
    "activities": ["..."],
    "frequency": "...",
    "responsible_role": "pdl|pflegekraft|angehoeriger|admin",
    "target_noc": {"code": "...", "label": "...", "current": 1..5, "target": 1..5, "deadline_weeks": 4}
  }],
  "quality_measures": ["..."],
  "review_in_weeks": 4,
  "confidence": 0.0..1.0
}`;

export function buildCarePlanSuggestV1(params: {
  residentName: string;
  age: number;
  pflegegrad: number;
  diagnoses: string[];
  sis?: {
    themenfelder: Record<string, { finding: string; resources: string; needs: string }>;
    risikomatrix: Record<string, { level: string; note: string }>;
  };
  existingCarePlans?: Array<{ title: string; status: string }>;
}): LLMRequest {
  const sisTxt = params.sis
    ? "SIS:\n" +
      Object.entries(params.sis.themenfelder)
        .map(([k, v]) => `  TF${k}: ${v.finding}`)
        .join("\n") +
      "\nRisiken:\n" +
      Object.entries(params.sis.risikomatrix)
        .filter(([, v]) => v.level !== "keins")
        .map(([k, v]) => `  ${k}: ${v.level} (${v.note})`)
        .join("\n")
    : "SIS liegt nicht vor.";
  const cp = params.existingCarePlans?.length
    ? "Bereits geplante Maßnahmen:\n" + params.existingCarePlans.map((c) => `- ${c.title} [${c.status}]`).join("\n")
    : "";

  return {
    system: CARE_PLAN_SUGGEST_SYSTEM,
    promptKey: CARE_PLAN_SUGGEST_V1_KEY,
    temperature: 0.3,
    maxTokens: 2500,
    jsonMode: true,
    messages: [
      {
        role: "user",
        content: `Bewohner: ${params.residentName}, ${params.age} J., Pflegegrad ${params.pflegegrad}\nDiagnosen: ${params.diagnoses.join(", ") || "keine"}\n\n${sisTxt}\n\n${cp}\n\nSchlage Pflegeplan vor (JSON).`,
      },
    ],
  };
}
