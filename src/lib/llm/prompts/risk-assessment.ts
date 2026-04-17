export const RISK_ASSESSMENT_VERSION = "v1.0.0";

export type RiskKind = "sturz" | "dekubitus" | "delir";

export interface RiskInput {
  kind: RiskKind;
  residentName: string;
  age: number;
  pflegegrad: number;
  diagnoses: string[];
  recentNotes: string[];
  medications?: string[];
}

const SCALES: Record<RiskKind, string> = {
  sturz:
    "Sturzrisiko-Assessment (Expertenstandard DNQP / Hendrich II). Bewerte Faktoren: Ganginstabilität, " +
    "Medikation (Sedativa, Antihypertensiva), Kognition, Kontinenz, Seh-/Hörvermögen, Sturzanamnese. " +
    "Ergebnis: risikoStufe ∈ {niedrig, mittel, hoch}, score 0–16.",
  dekubitus:
    "Dekubitusrisiko (Braden-Skala 6–23, <18 = Risiko). Kategorien: Sensorische Wahrnehmung, Feuchtigkeit, " +
    "Aktivität, Mobilität, Ernährung, Reibung/Scherkräfte.",
  delir:
    "Delirrisiko (4AT Screening / CAM-ICU-Inspiriert). Bewertung: Alertness, AMT4, Aufmerksamkeit, " +
    "akuter Verlauf. Score 0–12.",
};

export function buildRiskPrompt(input: RiskInput) {
  return {
    promptKey: `risk-assessment-${input.kind}:${RISK_ASSESSMENT_VERSION}`,
    system: `Du bist klinische Pflegeexpertin mit DNQP-Expertenstandard-Kenntnis.
Aufgabe: ${SCALES[input.kind]}
Antworte ausschliesslich JSON:
{
  "risikoStufe": "niedrig|mittel|hoch",
  "score": <number>,
  "begruendung": "<2-4 Sätze>",
  "massnahmen": ["<Pflegerische Intervention 1>", "<...>"],
  "reassessmentInTagen": <number>
}`,
    messages: [{ role: "user" as const, content: JSON.stringify(input) }],
    jsonMode: true,
    temperature: 0.2,
    maxTokens: 800,
  };
}
