import { intents } from "./intents";
import type { VoiceIntent, VoiceIntentCategory } from "./types";

export function listIntents(): VoiceIntent[] {
  return intents;
}

export function byCategory(): Record<VoiceIntentCategory, VoiceIntent[]> {
  const out = {} as Record<VoiceIntentCategory, VoiceIntent[]>;
  for (const i of intents) {
    (out[i.category] ||= []).push(i);
  }
  return out;
}

export const CATEGORY_LABELS: Record<VoiceIntentCategory, string> = {
  navigation: "Navigation",
  resident: "Bewohner-Suche",
  report: "Pflegebericht",
  vital: "Vitalwerte",
  medication: "Medikation",
  measure: "Massnahmen",
  emergency: "Notfall",
  shortcut: "Shortcuts",
};
