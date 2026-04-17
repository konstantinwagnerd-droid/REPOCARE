/**
 * SIS (Strukturierte Informationssammlung) Klassifikation.
 * Ordnet freien Text den 6 SIS-Themenfeldern zu.
 */
export const SIS_CLASSIFICATION_VERSION = "v1.2.0";

export const SIS_THEMEN = [
  "Kognitive und kommunikative Fähigkeiten",
  "Mobilität & Beweglichkeit",
  "Krankheitsbezogene Anforderungen",
  "Selbstversorgung",
  "Leben in sozialen Beziehungen",
  "Gestaltung des Alltagslebens",
] as const;

export function buildSISPrompt(transcript: string) {
  return {
    promptKey: `sis-classification:${SIS_CLASSIFICATION_VERSION}`,
    system: `Du bist eine erfahrene österreichische Pflegedienstleitung.
Analysiere den folgenden Pflegebericht und ordne die Inhalte den sechs SIS-Themenfeldern zu.
Antworte AUSSCHLIESSLICH als gültiges JSON in diesem Schema:
{
  "themen": [{"name": "<Themenfeld>", "relevanz": "hoch|mittel|niedrig", "zitat": "<Text aus Bericht>"}],
  "zusammenfassung": "<max 2 Sätze>",
  "risiken": ["<Risiko 1>", "<Risiko 2>"]
}
SIS-Themenfelder: ${SIS_THEMEN.join(", ")}.`,
    messages: [{ role: "user" as const, content: transcript }],
    jsonMode: true,
    temperature: 0.2,
    maxTokens: 1024,
  };
}
