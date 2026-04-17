/**
 * Dataset-Exporter für HuggingFace / OpenAI / Anthropic Formate.
 */

import type { DatasetEntry, ExportFormat } from "./types";

const SYSTEM_PROMPTS: Record<string, string> = {
  "sis-classification":
    "Du bist ein Pflege-Dokumentations-Assistent. Klassifiziere den Eingabetext in das passende SIS-Themenfeld (1-6).",
  "vital-anomaly-detection":
    "Du bist ein medizinischer Analyse-Assistent. Bewerte Vitalwerte-Trends als normal, auffällig oder kritisch, mit Begründung.",
  "medication-interaction":
    "Du bist ein pharmakologischer Assistent. Prüfe Medikamenten-Kombinationen auf Interaktionen mit Referenz zu PRISCUS/FORTA.",
  "care-report-generation":
    "Du bist ein Pflege-Schreibassistent. Erstelle aus Stichworten vollständige, fachlich fundierte Pflegeberichte.",
  "voice-transcription-corrections":
    "Du bist ein Transkriptions-Korrektor. Korrigiere rohe Whisper-Transkripte zu fachlich-medizinisch korrekter Form.",
  "dementia-validation-prompts":
    "Du bist ein Demenz-Kommunikations-Assistent. Gib Antworten im Sinne der Validations-Therapie nach Naomi Feil.",
  "incident-postmortem-drafting":
    "Du bist ein Qualitätsmanagement-Assistent. Erstelle aus Incident-Daten einen strukturierten Postmortem-Draft.",
};

function systemPromptFor(entries: DatasetEntry[]): string {
  const dataset = entries[0]?.meta?.dataset ?? "";
  return SYSTEM_PROMPTS[dataset] ?? "Du bist ein hilfreicher Assistent für Pflegeeinrichtungen.";
}

export function toOpenAI(entries: DatasetEntry[]): ExportFormat["openai"] {
  const system = systemPromptFor(entries);
  return entries.map((e) => ({
    messages: [
      { role: "system", content: system },
      { role: "user", content: e.input },
      { role: "assistant", content: e.output },
    ],
  }));
}

export function toAnthropic(entries: DatasetEntry[]): ExportFormat["anthropic"] {
  const system = systemPromptFor(entries);
  return entries.map((e) => ({
    system,
    messages: [
      { role: "user", content: e.input },
      { role: "assistant", content: e.output },
    ],
  }));
}

export function toHuggingFace(entries: DatasetEntry[]): ExportFormat["huggingface"] {
  return entries;
}

export function toJsonl(entries: unknown[]): string {
  return entries.map((e) => JSON.stringify(e)).join("\n") + "\n";
}
