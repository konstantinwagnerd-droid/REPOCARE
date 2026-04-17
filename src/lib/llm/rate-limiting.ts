/**
 * In-process sliding-window rate limiter.
 * Prod should back this with Redis; the interface is deliberately swap-compatible.
 */

type Key = string;
const buckets = new Map<Key, number[]>();

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  llm_per_user: { windowMs: 60_000, max: 20 },
  llm_per_tenant: { windowMs: 60_000, max: 200 },
};

export function checkRateLimit(key: Key, cfg: RateLimitConfig = DEFAULTS.llm_per_user): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const arr = buckets.get(key) ?? [];
  const fresh = arr.filter((t) => now - t < cfg.windowMs);
  if (fresh.length >= cfg.max) {
    const resetMs = cfg.windowMs - (now - fresh[0]);
    buckets.set(key, fresh);
    return { allowed: false, remaining: 0, resetMs };
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return { allowed: true, remaining: cfg.max - fresh.length, resetMs: cfg.windowMs };
}

export function rateLimitLLM(tenantId?: string, userId?: string): void {
  if (userId) {
    const r = checkRateLimit(`llm:u:${userId}`, DEFAULTS.llm_per_user);
    if (!r.allowed) throw new Error(`LLM rate limit (user) — retry in ${r.resetMs}ms`);
  }
  if (tenantId) {
    const r = checkRateLimit(`llm:t:${tenantId}`, DEFAULTS.llm_per_tenant);
    if (!r.allowed) throw new Error(`LLM rate limit (tenant) — retry in ${r.resetMs}ms`);
  }
}
