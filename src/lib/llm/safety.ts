/**
 * Input-Sanitization, PII-Scrub, Output-Validation for LLM calls.
 * Pflege-Kontext: Namen, Adressen, SV-Nummer dürfen nicht rohe an US-APIs gehen.
 */

const AT_SV_NR = /\b\d{4}\s?\d{6}\b/g; // AT Sozialversicherungsnummer
const DE_SV_NR = /\b\d{2}\s?\d{6}\s?[A-Z]\s?\d{3}\b/g;
const IBAN = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g;
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE = /\+?\d{1,3}[\s-]?\(?\d{2,5}\)?[\s-]?\d{3,10}/g;

export interface ScrubResult {
  text: string;
  replacements: Record<string, string>;
}

/** Replace PII with stable tokens. Caller may swap back post-response. */
export function scrubPII(input: string): ScrubResult {
  const replacements: Record<string, string> = {};
  let i = 0;
  const sub = (re: RegExp, prefix: string) => (m: string) => {
    const token = `[${prefix}_${i++}]`;
    replacements[token] = m;
    return token;
  };

  const text = input
    .replace(AT_SV_NR, sub(AT_SV_NR, "SVNR"))
    .replace(DE_SV_NR, sub(DE_SV_NR, "SVNR"))
    .replace(IBAN, sub(IBAN, "IBAN"))
    .replace(EMAIL, sub(EMAIL, "EMAIL"))
    .replace(PHONE, sub(PHONE, "PHONE"));

  return { text, replacements };
}

export function restorePII(text: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (acc, [token, original]) => acc.split(token).join(original),
    text,
  );
}

/** Reject input that looks like a prompt-injection attack. */
export function detectPromptInjection(input: string): { safe: boolean; reason?: string } {
  const lowered = input.toLowerCase();
  const red = [
    "ignore previous instructions",
    "ignoriere vorherige anweisungen",
    "disregard the system",
    "system prompt:",
    "you are now",
    "du bist jetzt",
  ];
  for (const p of red) if (lowered.includes(p)) return { safe: false, reason: p };
  return { safe: true };
}

export function sanitize(input: string, opts: { maxLength?: number } = {}): string {
  const max = opts.maxLength ?? 20000;
  return input.replace(/\u0000/g, "").slice(0, max).trim();
}

/** Validate JSON output. Throws if malformed. */
export function parseJSONSafely<T = unknown>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
