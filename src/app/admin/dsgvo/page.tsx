import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, dsgvoRequests } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { DsgvoClient } from "./dsgvo-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DsgvoPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const [resList, requests] = await Promise.all([
    db.select({ id: residents.id, fullName: residents.fullName, room: residents.room }).from(residents).where(and(eq(residents.tenantId, tenantId), isNull(residents.deletedAt))),
    db.select().from(dsgvoRequests).where(eq(dsgvoRequests.tenantId, tenantId)).orderBy(desc(dsgvoRequests.createdAt)),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">DSGVO</h1>
        <p className="mt-1 text-muted-foreground">Auskunft (Art. 15), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20).</p>
      </div>
      <DsgvoClient residents={resList} initialRequests={requests} />
    </div>
  );
}
