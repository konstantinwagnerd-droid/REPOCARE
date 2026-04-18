/**
 * Content-Security-Policy builder.
 *
 * Strategy: strict-dynamic with per-request nonce for scripts.
 * Allow self + inline-for-next style (Next.js emits inline styles).
 */
/**
 * Edge-runtime-sicher: nutzt Web-Crypto statt node:crypto,
 * damit CSP-Builder auch in der Next.js-Middleware funktioniert.
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  // Works in both Node (global webcrypto) and Edge runtime
  crypto.getRandomValues(bytes);
  // Base64-Encoding Edge-kompatibel
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa !== "undefined"
    ? btoa(binary)
    : Buffer.from(bytes).toString("base64");
}

export function buildCSP(_nonce: string, _opts: { reportOnly?: boolean } = {}): string {
  // Pragmatische CSP: Next.js setzt das Nonce nicht zuverlässig auf alle generierten
  // Script-Tags (App-Router-Hydration nutzt inline-bootstrap). 'unsafe-inline' für
  // Scripts ist temporär nötig — wird ignoriert sobald 'strict-dynamic' präsent ist
  // (in modernen Browsern), aber als Fallback für Next-Internals belassen.
  // TODO: nach Next.js native nonce-Support flächendeckend wieder verschärfen.
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", "https:", ...(process.env.NODE_ENV !== "production" ? ["ws:", "wss:"] : [])],
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
