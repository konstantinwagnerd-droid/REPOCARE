/**
 * Evolution API Client (WhatsApp Gateway)
 * ----------------------------------------
 * Self-hosted Evolution API (https://github.com/EvolutionAPI/evolution-api).
 * Env:
 *   EVOLUTION_API_URL     — Base URL (z.B. https://evo.example.com)
 *   EVOLUTION_API_KEY     — Global API key (Header: apikey)
 *   EVOLUTION_INSTANCE    — Instance name (z.B. "careai")
 *
 * Features: sendText, sendTemplate, validateNumber.
 * Rate-Limit: 1 msg/sec pro Empfaenger-Nummer (In-Memory-Bucket).
 * Retry: exponentieller Backoff (max 3 Versuche).
 */

const BASE = process.env.EVOLUTION_API_URL ?? "";
const KEY = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = process.env.EVOLUTION_INSTANCE ?? "careai";

const lastSentAt = new Map<string, number>(); // phone -> timestamp (ms)
const MIN_INTERVAL_MS = 1000;

export class EvolutionError extends Error {
  constructor(message: string, public status?: number, public body?: unknown) {
    super(message);
    this.name = "EvolutionError";
  }
}

function normalizePhone(phone: string): string {
  // E.164 ohne '+' — Evolution erwartet "43..." statt "+43..."
  return phone.replace(/[^\d]/g, "");
}

async function waitRateLimit(phone: string) {
  const last = lastSentAt.get(phone) ?? 0;
  const delta = Date.now() - last;
  if (delta < MIN_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - delta));
  }
  lastSentAt.set(phone, Date.now());
}

async function request<T>(path: string, init?: RequestInit, retries = 3): Promise<T> {
  if (!BASE || !KEY) {
    throw new EvolutionError("EVOLUTION_API_URL or EVOLUTION_API_KEY missing in env");
  }
  const url = `${BASE.replace(/\/$/, "")}${path}`;
  let lastErr: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          apikey: KEY,
          ...(init?.headers ?? {}),
        },
        cache: "no-store",
      });
      const text = await res.text();
      const body = text ? safeJson(text) : null;
      if (!res.ok) {
        // 4xx: kein Retry (Client-Fehler)
        if (res.status >= 400 && res.status < 500) {
          throw new EvolutionError(`Evolution ${res.status}: ${text.slice(0, 200)}`, res.status, body);
        }
        throw new EvolutionError(`Evolution ${res.status}`, res.status, body);
      }
      return body as T;
    } catch (err) {
      lastErr = err;
      if (err instanceof EvolutionError && err.status && err.status >= 400 && err.status < 500) {
        throw err;
      }
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new EvolutionError("Evolution request failed");
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendText(phone: string, text: string): Promise<SendResult> {
  const number = normalizePhone(phone);
  if (!number) return { ok: false, error: "invalid phone" };
  try {
    await waitRateLimit(number);
    const body = await request<{ key?: { id?: string } }>(
      `/message/sendText/${encodeURIComponent(INSTANCE)}`,
      {
        method: "POST",
        body: JSON.stringify({ number, text }),
      },
    );
    return { ok: true, messageId: body.key?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Evolution-Community unterstuetzt keine nativen WABA-Templates.
 * Wir interpolieren die Template-Variablen in reinen Text und senden via sendText.
 */
export async function sendTemplate(
  phone: string,
  templateName: string,
  vars: Record<string, string>,
  render: (vars: Record<string, string>) => string,
): Promise<SendResult> {
  const body = render(vars);
  const result = await sendText(phone, body);
  return result;
}

/**
 * Validiert, ob die Nummer bei WhatsApp registriert ist.
 * Fallback bei Fehlern: {exists: null}.
 */
export async function validateNumber(phone: string): Promise<{ exists: boolean | null; jid?: string }> {
  const number = normalizePhone(phone);
  if (!number) return { exists: null };
  try {
    const body = await request<Array<{ exists: boolean; jid: string; number: string }>>(
      `/chat/whatsappNumbers/${encodeURIComponent(INSTANCE)}`,
      {
        method: "POST",
        body: JSON.stringify({ numbers: [number] }),
      },
    );
    const entry = Array.isArray(body) ? body[0] : null;
    if (!entry) return { exists: null };
    return { exists: Boolean(entry.exists), jid: entry.jid };
  } catch {
    return { exists: null };
  }
}

export function isConfigured(): boolean {
  return Boolean(BASE && KEY);
}

/** In Ruhezeiten? Akzeptiert HH:MM Strings. */
export function isQuietNow(start: string, end: string, now = new Date()): boolean {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  // Ueber Mitternacht (22:00 -> 07:00)
  if (s > e) return mins >= s || mins < e;
  return mins >= s && mins < e;
}
