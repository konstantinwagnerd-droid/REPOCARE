/**
 * Query-Runner: executes QueryBuilder output via drizzle's sql template.
 * Wraps parameter substitution safely (drizzle auto-binds via sql.raw + sql placeholder).
 */
import { db } from "@/db/client";
import { sql as dsql } from "drizzle-orm";
import { buildQuery, type QuerySpec } from "./query-builder";

export async function runQuery(spec: QuerySpec, tenantId: string): Promise<{
  rows: Record<string, unknown>[];
  columns: string[];
  sqlString: string;
  rowCount: number;
}> {
  const { sql: sqlStr, params } = buildQuery(spec, tenantId);

  // drizzle sql template requires us to splice params manually. We build a sql
  // node by alternating fragments and parameter bindings to keep it parameterized.
  // sql.raw emits the SQL fragment; sql placeholder binds the parameter safely.
  const parts = sqlStr.split(/\$(\d+)/g);
  const chunks: unknown[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      chunks.push(dsql.raw(parts[i]));
    } else {
      const idx = Number(parts[i]) - 1;
      chunks.push(params[idx]);
    }
  }
  // Build sql template from chunks
  const query = chunks.reduce<ReturnType<typeof dsql.join> | null>((acc, chunk, idx) => {
    if (acc === null) return dsql`${chunk}`;
    return dsql`${acc}${chunk}`;
  }, null);

  const result = await db.execute(query as ReturnType<typeof dsql.empty>);
  // drizzle-postgres: result is array; drizzle-pglite: result.rows
  const rows = Array.isArray(result)
    ? (result as Record<string, unknown>[])
    : ((result as { rows?: Record<string, unknown>[] }).rows ?? []);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : spec.columns;
  return { rows, columns, sqlString: sqlStr, rowCount: rows.length };
}
