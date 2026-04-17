/**
 * Content-Security-Policy builder.
 *
 * Strategy: strict-dynamic with per-request nonce for scripts.
 * Allow self + inline-for-next style (Next.js emits inline styles).
 */
import { randomBytes } from "node:crypto";

export function generateNonce(): string {
  return randomBytes(16).toString("base64");
}

export function buildCSP(nonce: string, opts: { reportOnly?: boolean } = {}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // allow Next.js dev HMR
      ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", ...(process.env.NODE_ENV !== "production" ? ["ws:", "wss:"] : [])],
    "media-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

export const CSP_HEADER = "Content-Security-Policy";
export const CSP_REPORT_ONLY_HEADER = "Content-Security-Policy-Report-Only";
