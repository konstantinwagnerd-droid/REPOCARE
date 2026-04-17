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
    system: `Du erstellst strukturierte Pflegeberichte nach SIS-Standard (AT/DE).
Regeln:
- Fachsprache, aber verständlich für Pflegefachkräfte.
- Nur Fakten aus dem Transkript verwenden. Keine Interpretationen erfinden.
- Format: JSON mit Feldern summary, vitals, sisTags, actions, concerns.
- actions[].urgency ∈ {"routine","info","dringend"}.`,
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
