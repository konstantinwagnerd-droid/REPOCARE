/**
 * In-memory sliding-window rate limiter.
 *
 * For production use behind a reverse proxy, swap the internal store for
 * Redis (ioredis + sorted sets). The API stays the same.
 */

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  limit: number;
}

export class RateLimiter {
  private readonly hits = new Map<string, number[]>();
  constructor(private readonly opts: RateLimitOptions) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.opts.windowMs;
    const prev = this.hits.get(key) ?? [];
    const recent = prev.filter((t) => t > windowStart);

    if (recent.length >= this.opts.max) {
      const oldest = recent[0];
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, oldest + this.opts.windowMs - now),
        limit: this.opts.max,
      };
    }

    recent.push(now);
    this.hits.set(key, recent);
    return {
      allowed: true,
      remaining: this.opts.max - recent.length,
      retryAfterMs: 0,
      limit: this.opts.max,
    };
  }

  reset(key?: string) {
    if (key) this.hits.delete(key);
    else this.hits.clear();
  }
}

// Pre-configured limiters per sensitive surface.
export const authLimiter = new RateLimiter({ windowMs: 60_000, max: 10 });
export const voiceLimiter = new RateLimiter({ windowMs: 60_000, max: 30 });
export const exportLimiter = new RateLimiter({ windowMs: 60_000, max: 5 });
export const publicFormLimiter = new RateLimiter({ windowMs: 300_000, max: 3 });

export function keyFromRequest(req: { headers: Headers }, userId?: string): string {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ??
    "unknown";
  return userId ? `u:${userId}` : `ip:${ip}`;
}
