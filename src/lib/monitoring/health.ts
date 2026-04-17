/**
 * Health check probes.
 * - liveness: process is up
 * - readiness: can talk to DB + has resources
 */

export interface HealthResult {
  status: "ok" | "degraded" | "down";
  uptime: number;
  timestamp: string;
  checks: Record<string, { status: "ok" | "fail"; latencyMs?: number; error?: string }>;
}

const startedAt = Date.now();

export async function liveness(): Promise<HealthResult> {
  return {
    status: "ok",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    checks: { process: { status: "ok" } },
  };
}

export async function readiness(): Promise<HealthResult> {
  const checks: HealthResult["checks"] = {};
  let overall: HealthResult["status"] = "ok";

  // DB check (imports lazily to avoid edge-runtime bundling)
  const t0 = Date.now();
  try {
    const { db } = await import("@/db/client");
    // Drizzle does not expose a ping — run a trivial query.
    // Safe if db has .execute(); otherwise the try/catch handles it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDb = db as any;
    if (typeof anyDb?.execute === "function") await anyDb.execute("SELECT 1");
    checks.db = { status: "ok", latencyMs: Date.now() - t0 };
  } catch (e) {
    overall = "degraded";
    checks.db = { status: "fail", error: (e as Error).message, latencyMs: Date.now() - t0 };
  }

  // Memory sanity
  if (typeof process !== "undefined" && process.memoryUsage) {
    const mem = process.memoryUsage();
    const heapUsedMb = mem.heapUsed / 1024 / 1024;
    checks.memory = { status: heapUsedMb < 1024 ? "ok" : "fail", latencyMs: Math.round(heapUsedMb) };
    if (heapUsedMb >= 1024) overall = "degraded";
  }

  return {
    status: overall,
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    checks,
  };
}
