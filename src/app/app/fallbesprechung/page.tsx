import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { residents, caseConferences } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { FallbesprechungClient } from "./Client";

export const metadata = { title: "Fallbesprechung · CareAI" };

export default async function FallbesprechungPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const residentList = await db
    .select({ id: residents.id, fullName: residents.fullName, room: residents.room })
    .from(residents)
    .where(eq(residents.tenantId, session.user.tenantId));

  const past = await db
    .select()
    .from(caseConferences)
    .where(eq(caseConferences.tenantId, session.user.tenantId))
    .orderBy(desc(caseConferences.date))
    .limit(10);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Fallbesprechung</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Strukturierter 6-Phasen-Workflow fuer Teams-Meeting im Pflegeheim. Dauer: ca. 45–60 Minuten.
        </p>
      </header>
      <FallbesprechungClient
        residents={residentList}
        pastConferences={past.map((c) => ({
          id: c.id,
          date: c.date.toISOString(),
          residentIds: c.residentIds ?? [],
          summary: c.summary ?? null,
        }))}
      />
    </div>
  );
}
