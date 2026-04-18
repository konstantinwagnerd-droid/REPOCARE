/**
 * Tenant-spezifische Auto-Lern-Logik für Vokabular-Korrekturen.
 *
 * Flow:
 *  1. User korrigiert im Editor ein Wort manuell (nicht im Dictionary enthalten)
 *  2. Wir speichern (original → korrigiert) in localStorage pro tenantId
 *  3. Nach `LEARN_THRESHOLD` gleichen Korrekturen → zur aktiven Regelliste hinzufügen
 *  4. Optional: Server-Sync via `/api/voice/vocabulary` (siehe dortige Route)
 *
 * Privacy: Diese Daten bleiben standardmäßig client-seitig im Browser des Nutzers;
 * sie werden NICHT an OpenAI/Whisper gesendet. Server-Sync ist optional und
 * nur mandanten-lokal in der eigenen DB.
 */

import type { VocabCorrection } from "./pflege-vocabulary";

export interface LearnedCorrection {
  /** Original-Text vom User (Whisper-Fehlerausgabe). */
  pattern: string;
  /** Kanonische Zielform, die der User eingegeben hat. */
  correct: string;
  tenantId: string;
  /** Wie oft diese Korrektur manuell angewandt wurde. */
  count: number;
  /** ISO-8601. */
  lastUsed: string;
}

const STORAGE_PREFIX = "careai.voice.learned.";
export const LEARN_THRESHOLD = 3;

function storageKey(tenantId: string): string {
  return STORAGE_PREFIX + tenantId;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Lädt alle gelernten Korrekturen für einen Mandanten.
 */
export function loadLearned(tenantId: string): LearnedCorrection[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(tenantId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearnedCorrection[]) : [];
  } catch {
    return [];
  }
}

function saveLearned(tenantId: string, entries: LearnedCorrection[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(storageKey(tenantId), JSON.stringify(entries));
  } catch {
    // Quota exceeded etc. — silently drop; Dictionary bleibt funktional.
  }
}

/**
 * Registriert eine manuelle Korrektur. Erhöht Counter wenn das Paar
 * (pattern, correct) bereits existiert; sonst neuer Eintrag.
 */
export function recordCorrection(
  tenantId: string,
  pattern: string,
  correct: string,
): LearnedCorrection {
  const normalized = pattern.trim().toLowerCase();
  const target = correct.trim();
  if (!normalized || !target || normalized === target.toLowerCase()) {
    // Nichts Lernbares — wir registrieren nichts.
    return { pattern: normalized, correct: target, tenantId, count: 0, lastUsed: new Date().toISOString() };
  }
  const entries = loadLearned(tenantId);
  const existing = entries.find(
    (e) => e.pattern.toLowerCase() === normalized && e.correct === target,
  );
  const now = new Date().toISOString();
  if (existing) {
    existing.count += 1;
    existing.lastUsed = now;
    saveLearned(tenantId, entries);
    return existing;
  }
  const fresh: LearnedCorrection = {
    pattern: normalized,
    correct: target,
    tenantId,
    count: 1,
    lastUsed: now,
  };
  entries.push(fresh);
  saveLearned(tenantId, entries);
  return fresh;
}

/**
 * Escape-Funktion für Regex-Literale — damit user-getippte Patterns nicht
 * versehentlich Regex-Meta-Charaktere enthalten.
 */
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Konvertiert gelernte Einträge (mit count ≥ LEARN_THRESHOLD) in
 * VocabCorrection-Regeln, die an `applyCorrections(transcript, extraRules)`
 * übergeben werden können.
 */
export function learnedToRules(
  learned: LearnedCorrection[],
  threshold: number = LEARN_THRESHOLD,
): VocabCorrection[] {
  return learned
    .filter((l) => l.count >= threshold && l.pattern && l.correct)
    .map<VocabCorrection>((l) => ({
      pattern: new RegExp(`\\b${escapeRegex(l.pattern)}\\b`, "gi"),
      correct: l.correct,
      category: "standard",
      // Tenant-Lernregeln starten mit niedrigerer Confidence (manuelle Bestätigung)
      confidence: Math.min(0.9, 0.7 + l.count * 0.02),
    }));
}

/**
 * Convenience-Loader: liefert direkt einsatzbereite Regeln für einen Tenant.
 */
export function loadLearnedRules(tenantId: string): VocabCorrection[] {
  return learnedToRules(loadLearned(tenantId));
}

/**
 * Löscht alle gelernten Einträge eines Mandanten (z.B. "Vokabular zurücksetzen").
 */
export function clearLearned(tenantId: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(storageKey(tenantId));
  } catch {
    /* noop */
  }
}
