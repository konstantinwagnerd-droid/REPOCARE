import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { caseConferences, carePlans } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await db
    .select()
    .from(caseConferences)
    .where(eq(caseConferences.tenantId, session.user.tenantId))
    .orderBy(desc(caseConferences.date))
    .limit(50);
  return NextResponse.json({ conferences: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json() as {
    date: string;
    durationMinutes?: number;
    participants: Array<{ name: string; role: string }>;
    residentIds: string[];
    agendaItems: Array<{ title: string; notes?: string }>;
    notes?: string;
    actionItems: Array<{ residentId: string; action: string; owner: string; dueDate: string; criteria: string }>;
    summary?: string;
    createActionsAsCarePlans?: boolean;
  };

  const [conf] = await db.insert(caseConferences).values({
    tenantId: session.user.tenantId,
    date: new Date(body.date),
    durationMinutes: body.durationMinutes ?? null,
    participantsJson: body.participants ?? [],
    residentIds: body.residentIds ?? [],
    agendaItemsJson: body.agendaItems ?? [],
    notes: body.notes ?? null,
    actionItemsJson: body.actionItems ?? [],
    summary: body.summary ?? null,
    createdBy: session.user.id,
  }).returning();

  // Optional: Action-Items als care_plans anlegen
  if (body.createActionsAsCarePlans && body.actionItems?.length) {
    for (const item of body.actionItems) {
      if (!item.residentId || !item.action) continue;
      await db.insert(carePlans).values({
        residentId: item.residentId,
        title: item.action.slice(0, 120),
        description: `Aus Fallbesprechung ${new Date(body.date).toLocaleDateString("de-AT")}: ${item.action}\nErfolg: ${item.criteria}\nVerantwortlich: ${item.owner}`,
        frequency: "einmalig",
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
      });
    }
  }

  return NextResponse.json({ conference: conf });
}
