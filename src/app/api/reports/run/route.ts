import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runQuery } from "@/lib/reports/query-runner";
import type { QuerySpec } from "@/lib/reports/query-builder";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const spec = (await req.json()) as QuerySpec;
    const result = await runQuery(spec, session.user.tenantId);
    return NextResponse.json({
      rows: result.rows,
      columns: result.columns,
      rowCount: result.rowCount,
      sql: result.sqlString,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
