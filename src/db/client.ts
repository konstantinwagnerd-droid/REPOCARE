/**
 * Dual-Mode DB-Client:
 *  - Wenn DATABASE_URL gesetzt ist (Production / Vercel): Postgres via postgres-js
 *    (Supabase Transaction-Pooler, kompatibel mit Edge + Node Runtimes)
 *  - Sonst: PGlite embedded (lokale Entwicklung, kein Server, in ./local.db/)
 *
 * Drizzle's API ist driverübergreifend identisch — alle Queries funktionieren
 * mit beiden Treibern, weil das Schema (src/db/schema.ts) Postgres-Dialekt nutzt.
 */
import * as schema from "./schema";
import path from "node:path";

const usePostgres = !!process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __pgliteClient: unknown | undefined;
  // eslint-disable-next-line no-var
  var __postgresClient: unknown | undefined;
}

let dbInstance: unknown;

if (usePostgres) {
  // Production / Supabase: postgres-js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/postgres-js");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const postgres = require("postgres");

  const conn =
    (globalThis.__postgresClient as ReturnType<typeof postgres> | undefined) ??
    postgres(process.env.DATABASE_URL!, {
      max: 1, // Transaction-Pooler vertraegt keine grossen Pools
      prepare: false, // pgbouncer-Transaction-Mode kann keine Prepared Statements
      idle_timeout: 20,
      connect_timeout: 10,
    });
  if (process.env.NODE_ENV !== "production") {
    globalThis.__postgresClient = conn;
  }
  dbInstance = drizzle(conn, { schema });
} else {
  // Lokale Dev: PGlite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/pglite");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PGlite } = require("@electric-sql/pglite");

  const dbPath = process.env.PGLITE_PATH || path.resolve(process.cwd(), "local.db");
  const client =
    (globalThis.__pgliteClient as InstanceType<typeof PGlite> | undefined) ??
    new PGlite(dbPath);
  if (process.env.NODE_ENV !== "production") {
    globalThis.__pgliteClient = client;
  }
  dbInstance = drizzle(client, { schema });
}

// Type erase: drizzle's PGlite + postgres-js Returns sind strukturell identisch
// für unsere Schema-Operations — die Union ist nur intern verschieden.
export const db = dbInstance as ReturnType<typeof import("drizzle-orm/postgres-js").drizzle<typeof schema>>;
export type DB = typeof db;
