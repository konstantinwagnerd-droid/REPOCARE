import { describe, it, expect, vi, beforeEach } from "vitest";
import { cacheKey, memoCache } from "@/lib/performance/cache";

beforeEach(() => memoCache.clear());

describe("performance.cache", () => {
  it("builds deterministic keys", () => {
    expect(cacheKey("residents", { tenantId: "t1", page: 2 })).toBe(cacheKey("residents", { page: 2, tenantId: "t1" }));
  });
  it("caches and returns same value within TTL", async () => {
    const fn = vi.fn().mockResolvedValue(42);
    const val1 = await memoCache.getOrSet("k", 10_000, fn);
    const val2 = await memoCache.getOrSet("k", 10_000, fn);
    expect(val1).toBe(42);
    expect(val2).toBe(42);
    expect(fn).toHaveBeenCalledOnce();
  });
  it("invalidates by tag", async () => {
    const fn = vi.fn().mockResolvedValue(1);
    await memoCache.getOrSet("k1", 10_000, fn, ["tenant-1"]);
    memoCache.invalidateTag("tenant-1");
    await memoCache.getOrSet("k1", 10_000, fn, ["tenant-1"]);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
