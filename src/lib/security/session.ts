/**
 * Edge-runtime-sicher: Web-Crypto statt node:crypto.
 * Diese Datei wird sowohl in Server-Components (Node) als auch
 * in der Next.js-Middleware (Edge) importiert.
 */

const SECRET = process.env.CSRF_SECRET ?? "dev-csrf-secret-replace-in-prod";

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return toHex(new Uint8Array(sig));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * CSRF token: HMAC(session-id + ts) — stateless, rotates with session.
 */
export async function generateCsrfToken(sessionId: string): Promise<string> {
  const ts = Date.now().toString(36);
  const mac = await hmacSha256Hex(SECRET, `${sessionId}:${ts}`);
  return `${ts}.${mac}`;
}

export async function verifyCsrfToken(
  sessionId: string,
  token: string,
  maxAgeMs = 86_400_000,
): Promise<boolean> {
  const [ts, mac] = token.split(".");
  if (!ts || !mac) return false;
  const age = Date.now() - parseInt(ts, 36);
  if (!Number.isFinite(age) || age < 0 || age > maxAgeMs) return false;
  const expected = await hmacSha256Hex(SECRET, `${sessionId}:${ts}`);
  try {
    return timingSafeEqualBytes(fromHex(mac), fromHex(expected));
  } catch {
    return false;
  }
}

/**
 * Neue Session-ID (base64url-kodiert, 32 Bytes Entropie).
 */
export function rotateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  // base64url ohne Padding
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
