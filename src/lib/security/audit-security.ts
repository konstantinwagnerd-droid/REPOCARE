/**
 * Security audit helpers: failed-login tracking + account lockout.
 *
 * In-memory store; swap for Redis in production.
 */

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60_000;

interface Entry {
  fails: number;
  firstFailAt: number;
  lockedUntil: number;
}

const store = new Map<string, Entry>();

export function recordFailedLogin(identifier: string): { locked: boolean; remainingMs: number } {
  const now = Date.now();
  const e = store.get(identifier) ?? { fails: 0, firstFailAt: now, lockedUntil: 0 };
  if (now > e.firstFailAt + LOCKOUT_MS) {
    e.fails = 0;
    e.firstFailAt = now;
  }
  e.fails += 1;
  if (e.fails >= MAX_ATTEMPTS) e.lockedUntil = now + LOCKOUT_MS;
  store.set(identifier, e);
  return { locked: e.lockedUntil > now, remainingMs: Math.max(0, e.lockedUntil - now) };
}

export function isLocked(identifier: string): boolean {
  const e = store.get(identifier);
  return !!e && e.lockedUntil > Date.now();
}

export function clearFailedLogins(identifier: string): void {
  store.delete(identifier);
}
