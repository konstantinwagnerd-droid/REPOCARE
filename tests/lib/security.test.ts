import { describe, it, expect, beforeEach, vi } from "vitest";
import { RateLimiter } from "@/lib/security/rate-limit";
import { buildCSP, generateNonce } from "@/lib/security/csp";
import { checkPasswordStrength } from "@/lib/security/password";
import { isHoneypotFilled } from "@/lib/security/honeypot";
import { securityHeaders } from "@/lib/security/headers";

describe("RateLimiter (sliding window)", () => {
  let now = 1_700_000_000_000;
  beforeEach(() => {
    vi.spyOn(Date, "now").mockImplementation(() => now);
  });
  it("allows requests under the limit", () => {
    const rl = new RateLimiter({ windowMs: 60_000, max: 5 });
    for (let i = 0; i < 5; i++) expect(rl.check("ip-1").allowed).toBe(true);
  });
  it("blocks the 6th request in the window", () => {
    const rl = new RateLimiter({ windowMs: 60_000, max: 5 });
    for (let i = 0; i < 5; i++) rl.check("ip-2");
    const r = rl.check("ip-2");
    expect(r.allowed).toBe(false);
    expect(r.retryAfterMs).toBeGreaterThan(0);
  });
  it("resets after window expires", () => {
    const rl = new RateLimiter({ windowMs: 1_000, max: 2 });
    rl.check("ip-3");
    rl.check("ip-3");
    expect(rl.check("ip-3").allowed).toBe(false);
    now += 2_000;
    expect(rl.check("ip-3").allowed).toBe(true);
  });
});

describe("CSP builder", () => {
  it("emits a nonce in script-src", () => {
    const nonce = generateNonce();
    const csp = buildCSP(nonce);
    expect(csp).toContain(`'nonce-${nonce}'`);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
  });
  it("generates unique nonces", () => {
    expect(generateNonce()).not.toBe(generateNonce());
  });
});

describe("password strength", () => {
  it("rejects weak passwords", () => {
    expect(checkPasswordStrength("12345").ok).toBe(false);
    expect(checkPasswordStrength("password").ok).toBe(false);
  });
  it("accepts strong passwords", () => {
    expect(checkPasswordStrength("Kx9!mQ2-vzPw").ok).toBe(true);
  });
});

describe("honeypot", () => {
  it("detects filled honeypot", () => {
    expect(isHoneypotFilled({ website: "http://spam" })).toBe(true);
  });
  it("ignores empty honeypot", () => {
    expect(isHoneypotFilled({ website: "" })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
  });
});

describe("security headers", () => {
  it("includes HSTS, XFO, nosniff, Referrer-Policy", () => {
    const h = securityHeaders();
    expect(h["Strict-Transport-Security"]).toMatch(/max-age/);
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Referrer-Policy"]).toBeTruthy();
    expect(h["Permissions-Policy"]).toBeTruthy();
  });
});
