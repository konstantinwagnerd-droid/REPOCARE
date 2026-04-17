import type { MatchResult, VoiceActionContext } from "./types";
import { intents } from "./intents";

/**
 * Normalize German speech: lowercase, strip punct, collapse whitespace,
 * normalize number words ("achtzig" -> "80"? — out of scope; keep as-is).
 */
export function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Match utterance against intent registry. Returns best match or null.
 * Scoring: first-match wins (regex order). Fuzzy fallback: substring score.
 */
export function match(utterance: string, context: Partial<VoiceActionContext> = {}): MatchResult {
  const text = normalize(utterance);
  for (const intent of intents) {
    for (const re of intent.patterns) {
      const m = text.match(re);
      if (m) {
        return {
          intent,
          groups: m.slice(1).map((g) => g ?? ""),
          score: 1,
          utterance: text,
        };
      }
    }
  }

  // Fuzzy fallback — best partial match on example utterances
  let best: MatchResult = { intent: null, groups: [], score: 0, utterance: text };
  for (const intent of intents) {
    for (const ex of intent.examples) {
      const score = similarity(text, ex.toLowerCase());
      if (score > best.score && score > 0.65) {
        best = { intent, groups: [], score, utterance: text };
      }
    }
  }
  return best;
}

export function buildContext(
  utterance: string,
  groups: string[],
  currentPath: string,
  currentResidentId?: string,
): VoiceActionContext {
  return { utterance, groups, currentPath, currentResidentId };
}

/** Dice coefficient — simple & fast. */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = (s: string) => {
    const out = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bi = s.slice(i, i + 2);
      out.set(bi, (out.get(bi) ?? 0) + 1);
    }
    return out;
  };
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  let total = 0;
  A.forEach((v) => (total += v));
  B.forEach((v) => (total += v));
  A.forEach((v, k) => {
    const bv = B.get(k) ?? 0;
    inter += Math.min(v, bv);
  });
  return (2 * inter) / total;
}
