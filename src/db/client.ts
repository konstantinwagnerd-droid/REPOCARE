import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";
import path from "node:path";

const dbPath = process.env.PGLITE_PATH || path.resolve(process.cwd(), "local.db");

// Cache across hot reloads in dev to avoid re-opening the WASM instance.
declare global {
  // eslint-disable-next-line no-var
  var __pgliteClient: PGlite | undefined;
}

const client = globalThis.__pgliteClient ?? new PGlite(dbPath);
if (process.env.NODE_ENV !== "production") {
  globalThis.__pgliteClient = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;
