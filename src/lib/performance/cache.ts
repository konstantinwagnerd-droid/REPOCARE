/**
 * Lightweight in-memory cache with tag-based invalidation.
 * Drop-in for serverless-safe read-through caching. For multi-instance
 * deployments, back this by Redis and use Next.js `unstable_cache` + `revalidateTag`.
 */

export function cacheKey(ns: string, params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${JSON.stringify(params[k])}`)
    .join("&");
  return `${ns}?${sorted}`;
}

interface Entry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
}

class MemoCache {
  private store = new Map<string, Entry<unknown>>();

  async getOrSet<T>(key: string, ttlMs: number, producer: () => Promise<T>, tags: string[] = []): Promise<T> {
    const now = Date.now();
    const hit = this.store.get(key);
    if (hit && hit.expiresAt > now) return hit.value as T;
    const value = await producer();
    this.store.set(key, { value, expiresAt: now + ttlMs, tags });
    return value;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateTag(tag: string): void {
    for (const [k, v] of this.store) if (v.tags.includes(tag)) this.store.delete(k);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

export const memoCache = new MemoCache();

/**
 * Wrap Next.js `unstable_cache` when running inside a Next.js runtime.
 * Falls back to in-memory cache otherwise (e.g. tests).
 */
export async function nextCache<T>(key: string, producer: () => Promise<T>, opts: { tags?: string[]; revalidate?: number }): Promise<T> {
  try {
    // @ts-ignore — resolved at runtime by Next.js
    const { unstable_cache } = await import("next/cache");
    return unstable_cache(producer, [key], { tags: opts.tags ?? [], revalidate: opts.revalidate })();
  } catch {
    return memoCache.getOrSet(key, (opts.revalidate ?? 60) * 1000, producer, opts.tags ?? []);
  }
}
