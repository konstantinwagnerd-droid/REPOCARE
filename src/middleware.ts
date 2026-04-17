import { NextResponse, type NextRequest } from "next/server";
import { securityHeaders } from "@/lib/security/headers";
import { buildCSP, generateNonce, CSP_HEADER } from "@/lib/security/csp";
import { authLimiter, voiceLimiter, exportLimiter, keyFromRequest } from "@/lib/security/rate-limit";

const BOT_UA = /(bot|crawl|spider|slurp|mediapartners|headlesschrome|phantomjs)/i;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ??
    "unknown"
  );
}

function requestId(): string {
  // Edge-compatible UUID v4
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);
  const rid = requestId();

  // Rate limit sensitive API surfaces
  type Limiter = typeof authLimiter | null;
  let limiter: Limiter = null;
  if (pathname.startsWith("/api/auth")) limiter = authLimiter;
  else if (pathname.startsWith("/api/voice")) limiter = voiceLimiter;
  else if (pathname.startsWith("/api/exports")) limiter = exportLimiter;

  if (limiter) {
    const key = keyFromRequest({ headers: req.headers }, undefined);
    const r = limiter.check(key);
    if (!r.allowed) {
      return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": Math.ceil(r.retryAfterMs / 1000).toString(),
          "x-ratelimit-limit": r.limit.toString(),
          "x-ratelimit-remaining": r.remaining.toString(),
          "x-request-id": rid,
        },
      });
    }
  }

  // Build response with CSP nonce
  const nonce = generateNonce();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", rid);
  requestHeaders.set("x-csp-nonce", nonce);
  requestHeaders.set("x-client-ip", ip);
  // Geo-Info: Vercel / Cloudflare setzen das Country-Header — wir kopieren es durch
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "";
  requestHeaders.set("x-geo-country", country);

  // Bot detection (info only — log via x-is-bot)
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) requestHeaders.set("x-is-bot", "1");

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  for (const [k, v] of Object.entries(securityHeaders())) res.headers.set(k, v);
  res.headers.set(CSP_HEADER, buildCSP(nonce));
  res.headers.set("x-request-id", rid);
  res.headers.delete("x-powered-by");

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next static / image
     * - favicon, robots, sitemap, manifest
     * - public images
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|og-images/).*)",
  ],
};
