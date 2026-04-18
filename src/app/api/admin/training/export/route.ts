/**
 * CSV-Export aller Schulungs-Versuche des Tenants (admin/pdl).
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { trainingAttempts, trainingModules, users } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const runtime = "nodejs";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "pdl") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const rows = await db
    .select({
      userName: users.fullName,
      userEmail: users.email,
      moduleTitle: trainingModules.title,
      category: trainingModules.category,
      startedAt: trainingAttempts.startedAt,
      completedAt: trainingAttempts.completedAt,
      score: trainingAttempts.score,
      passed: trainingAttempts.passed,
    })
    .from(trainingAttempts)
    .innerJoin(users, eq(users.id, trainingAttempts.userId))
    .innerJoin(trainingModules, eq(trainingModules.id, trainingAttempts.moduleId))
    .where(and(eq(trainingAttempts.tenantId, tenantId)))
    .orderBy(desc(trainingAttempts.completedAt));

  const header = [
    "Name",
    "Email",
    "Modul",
    "Kategorie",
    "Gestartet",
    "Abgeschlossen",
    "Score",
    "Bestanden",
  ];

  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.userName),
        csvEscape(r.userEmail),
        csvEscape(r.moduleTitle),
        csvEscape(r.category),
        csvEscape(r.startedAt ? new Date(r.startedAt).toISOString() : ""),
        csvEscape(r.completedAt ? new Date(r.completedAt).toISOString() : ""),
        csvEscape(r.score ?? ""),
        csvEscape(r.passed == null ? "" : r.passed ? "ja" : "nein"),
      ].join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="schulungen-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
