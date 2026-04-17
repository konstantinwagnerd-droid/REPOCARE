export const HANDOVER_VERSION = "v1.0.0";

export interface HandoverInput {
  shift: "Früh" | "Spät" | "Nacht";
  nextShift: "Früh" | "Spät" | "Nacht";
  stats: { residents: number; reports: number; vitals: number; incidents: number; openPlans: number };
  highlights: Array<{ name: string; room: string; note: string }>;
  openActions: Array<{ title: string; frequency: string; role: string }>;
  incidents: Array<{ severity: string; type: string; description: string }>;
}

export function buildHandoverPrompt(input: HandoverInput) {
  return {
    promptKey: `handover-summary:${HANDOVER_VERSION}`,
    system: `Du bist eine erfahrene Pflegedienstleitung und verfasst eine Schichtübergabe.
Stil: präzise, ruhig, priorisiert. Markdown-Output. KEINE Floskeln.
Struktur: Allgemeine Lage → Highlights je Bewohner → Offene Maßnahmen → Vorfälle → Checkliste.`,
    messages: [
      {
        role: "user" as const,
        content: JSON.stringify(input),
      },
    ],
    jsonMode: false,
    temperature: 0.4,
    maxTokens: 2048,
  };
}
