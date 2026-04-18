/**
 * Helper für DSGVO-Unsubscribe-URLs. Liegt außerhalb von app/api/, weil
 * Next.js 15 nur HTTP-Method-Exports in route.ts zulässt.
 */
import crypto from "node:crypto";

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? process.env.AUTH_SECRET ?? "dev-only-secret";

export function signUnsubscribe(email: string): string {
  return crypto.createHmac("sha256", SECRET).update(email).digest("hex").slice(0, 32);
}

export function makeUnsubscribeUrl(baseUrl: string, email: string): string {
  return `${baseUrl}/api/email/unsubscribe?e=${encodeURIComponent(email)}&t=${signUnsubscribe(email)}`;
}
