/**
 * Korrektur-Engine für Whisper-Transkripte.
 *
 * Arbeitsweise:
 *  1. Für jede Regel im Dictionary: sammle alle Matches im Original-Text (mit Offset)
 *  2. Sortiere Matches nach Offset, filtere Überlappungen (erste Match gewinnt)
 *  3. Baue den korrigierten Text einmal hin und berechne neue Offsets
 *
 * Offset-Konvention: `offset` und `length` beziehen sich auf den **korrigierten** Text,
 * damit das UI im Editor Chips an den richtigen Stellen rendern kann.
 */

import { PFLEGE_CORRECTIONS, type VocabCorrection, type VocabCategory } from "./pflege-vocabulary";

export interface Correction {
  /** Original-Text-Ausschnitt (was Whisper falsch transkribiert hat). */
  originalText: string;
  /** Kanonische Zielform. */
  correctedText: string;
  category: VocabCategory | string;
  /** 0.70–1.00 — steuert grün (≥0.9) vs. gelb (<0.9) im UI. */
  confidence: number;
  /** Char-Offset im *korrigierten* Text. */
  offset: number;
  /** Länge des *korrigierten* Text-Ausschnitts. */
  length: number;
}

interface RawMatch {
  start: number; // offset in original transcript
  end: number;   // exclusive
  match: string; // the actual matched substring
  rule: VocabCorrection;
}

/**
 * Findet alle Match-Kandidaten aus allen Regeln, ohne noch Text zu verändern.
 */
function collectMatches(transcript: string, rules: VocabCorrection[]): RawMatch[] {
  const matches: RawMatch[] = [];
  for (const rule of rules) {
    // Sicherstellen, dass das Regex global ist — sonst hängt exec() in Endlosschleife
    const re = rule.pattern.global
      ? rule.pattern
      : new RegExp(rule.pattern.source, rule.pattern.flags + "g");
    // Reset lastIndex (Regex ist oft geteilt)
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(transcript)) !== null) {
      if (m[0].length === 0) {
        // Schutz gegen Zero-Width-Matches
        re.lastIndex++;
        continue;
      }
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        match: m[0],
        rule,
      });
    }
  }
  return matches;
}

/**
 * Entfernt überlappende Matches — behält den frühesten Start; bei Gleichstand
 * gewinnt die höhere Confidence.
 */
function dedupeOverlaps(matches: RawMatch[]): RawMatch[] {
  const sorted = [...matches].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return b.end - a.end; // längere Matches zuerst
    return b.rule.confidence - a.rule.confidence;
  });
  const result: RawMatch[] = [];
  let lastEnd = -1;
  for (const m of sorted) {
    if (m.start >= lastEnd) {
      result.push(m);
      lastEnd = m.end;
    }
  }
  return result;
}

export interface ApplyCorrectionsResult {
  corrected: string;
  corrections: Correction[];
}

/**
 * Hauptfunktion: Wendet Dictionary-Regeln auf das Transkript an.
 *
 * @param transcript Roh-Transkript von Whisper
 * @param extraRules Optional: zusätzliche Regeln (z.B. tenant-gelernte)
 */
export function applyCorrections(
  transcript: string,
  extraRules: VocabCorrection[] = [],
): ApplyCorrectionsResult {
  if (!transcript || transcript.length === 0) {
    return { corrected: "", corrections: [] };
  }

  const rules = [...PFLEGE_CORRECTIONS, ...extraRules];
  const raw = collectMatches(transcript, rules);
  const picks = dedupeOverlaps(raw);

  // Baue korrigierten Text auf, merke neue Offsets
  let corrected = "";
  let cursor = 0;
  const corrections: Correction[] = [];

  for (const m of picks) {
    // Text bis zum Match unverändert übernehmen
    corrected += transcript.slice(cursor, m.start);
    const newOffset = corrected.length;
    // Case-Anpassung: wenn Original am Satz-/Wortanfang großgeschrieben war,
    // übernehmen wir das für den korrigierten Text (sofern nicht bereits groß).
    const replacement = preserveLeadingCase(m.match, m.rule.correct);
    corrected += replacement;
    corrections.push({
      originalText: m.match,
      correctedText: replacement,
      category: m.rule.category,
      confidence: m.rule.confidence,
      offset: newOffset,
      length: replacement.length,
    });
    cursor = m.end;
  }
  // Rest anhängen
  corrected += transcript.slice(cursor);

  return { corrected, corrections };
}

/**
 * Wenn das Original-Match mit Großbuchstaben begann (z.B. Satzanfang),
 * stellen wir sicher, dass die Korrektur ebenfalls groß beginnt — aber nur,
 * wenn die kanonische Form nicht bereits mit Großbuchstaben/Ziffer/Sonderzeichen
 * startet.
 */
function preserveLeadingCase(original: string, correct: string): string {
  if (!original || !correct) return correct;
  const firstOrig = original[0];
  const firstCorr = correct[0];
  if (/[A-ZÄÖÜ]/.test(firstOrig) && /[a-zäöü]/.test(firstCorr)) {
    return firstCorr.toUpperCase() + correct.slice(1);
  }
  return correct;
}

/**
 * Zähl-Funktion für UI: "3 Korrekturen angewendet"
 */
export function countCorrections(result: ApplyCorrectionsResult): number {
  return result.corrections.length;
}

/**
 * Gruppiert Korrekturen nach Kategorie — nützlich für UI-Summary.
 */
export function groupByCategory(
  corrections: Correction[],
): Record<string, Correction[]> {
  const out: Record<string, Correction[]> = {};
  for (const c of corrections) {
    (out[c.category] ??= []).push(c);
  }
  return out;
}
