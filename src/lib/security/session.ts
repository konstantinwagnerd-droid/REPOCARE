import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";

/**
 * CSRF token: HMAC(session-id + ts) — stateless, rotates with session.
 */
const SECRET = process.env.CSRF_SECRET ?? "dev-csrf-secret-replace-in-prod";

export function generateCsrfToken(sessionId: string): string {
  const ts = Date.now().toString(36);
  const mac = createHmac("sha256", SECRET).update(`${sessionId}:${ts}`).digest("hex");
  return `${ts}.${mac}`;
}

export function verifyCsrfToken(sessionId: string, token: string, maxAgeMs = 86_400_000): boolean {
  const [ts, mac] = token.split(".");
  if (!ts || !mac) return false;
  const age = Date.now() - parseInt(ts, 36);
  if (!Number.isFinite(age) || age < 0 || age > maxAgeMs) return false;
  const expected = createHmac("sha256", SECRET).update(`${sessionId}:${ts}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function rotateSessionId(): string {
  return randomBytes(32).toString("base64url");
}
