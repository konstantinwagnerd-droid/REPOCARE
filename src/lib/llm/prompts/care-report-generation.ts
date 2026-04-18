export const CARE_REPORT_VERSION = "v1.1.0";

export interface CareReportInput {
  residentName: string;
  pflegegrad: number;
  transcript: string;
  vitals?: Array<{ type: string; value: number; unit: string }>;
}

export function buildCareReportPrompt(input: CareReportInput) {
  const vitalsStr = (input.vitals ?? [])
    .map((v) => `${v.type}: ${v.value} ${v.unit}`)
    .join(", ") || "keine";

  return {
    promptKey: `care-report-generation:${CARE_REPORT_VERSION}`,
    system: `Du bist Pflegedokumentations-Assistent nach SIS-Standard (AT/DE).
Strukturiere die Pflege-Sprachnotiz in die 6 SIS-Themenfelder, extrahiere Vital-Werte,
Maßnahmen, Auffälligkeiten und Empfehlungen.
Regeln:
- Fachsprache, aber verständlich für Pflegefachkräfte.
- NUR Fakten aus dem Transkript verwenden. KEINE Halluzinationen, keine Interpretationen erfinden.
- Wenn eine Information fehlt → Feld leer lassen oder weglassen.
- Format: JSON mit Feldern: summary (string), sisTags (string[]), vitals (array), actions (array), concerns (string[]), recommendations (string[]), confidence (0..1).
- actions[].urgency ∈ {"routine","info","dringend"}.
- confidence: deine Selbsteinschätzung der Zuverlässigkeit der Extraktion (0..1).`,
    messages: [
      {
        role: "user" as const,
        content: `Bewohner:in: ${input.residentName} (PG ${input.pflegegrad})
Vitalwerte: ${vitalsStr}
Transkript:
"""${input.transcript}"""`,
      },
    ],
    jsonMode: true,
    temperature: 0.3,
    maxTokens: 1536,
  };
}
