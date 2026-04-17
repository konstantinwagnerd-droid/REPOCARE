export const VOICE_CORRECTION_VERSION = "v1.0.0";

export function buildVoiceCorrectionPrompt(rawTranscript: string) {
  return {
    promptKey: `voice-correction:${VOICE_CORRECTION_VERSION}`,
    system: `Du korrigierst Fehler in österreichischer/deutscher Spracherkennung im Pflegekontext.
Typische Fehler: Zahlen (mm Hg vs. mmHg), medizinische Abkürzungen (BZ, RR, Temp), Namen, Zeitangaben.
Regeln:
- NUR offensichtliche Transkriptionsfehler korrigieren.
- Inhalte NICHT umdeuten oder ergänzen.
- Nur den korrigierten Text zurückgeben, KEINEN Kommentar.`,
    messages: [{ role: "user" as const, content: rawTranscript }],
    jsonMode: false,
    temperature: 0.1,
    maxTokens: 1024,
  };
}
