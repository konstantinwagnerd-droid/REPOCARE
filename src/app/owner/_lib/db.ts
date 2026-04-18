/**
 * Owner-Bereich: gemeinsame DB-Helper. Nutzt postgres-js direkt
 * (kein Drizzle-Wrapper) für maximale Flexibilität bei Cross-Tenant-Queries.
 */
import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function ownerDb() {
  if (!_sql && process.env.DATABASE_URL) {
    _sql = postgres(process.env.DATABASE_URL, {
      max: 2,
      prepare: false,
      idle_timeout: 10,
    });
  }
  return _sql;
}

export async function safeQuery<T = unknown>(fn: (sql: ReturnType<typeof postgres>) => Promise<T>, fallback: T): Promise<T> {
  const sql = ownerDb();
  if (!sql) return fallback;
  try {
    return await fn(sql);
  } catch {
    return fallback;
  }
}
