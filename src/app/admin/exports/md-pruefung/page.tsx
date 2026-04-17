import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { MdPruefungClient } from "./md-pruefung-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function MdPruefungPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const resList = await db.select({
    id: residents.id, fullName: residents.fullName, room: residents.room, pflegegrad: residents.pflegegrad, station: residents.station,
  }).from(residents).where(and(eq(residents.tenantId, tenantId), isNull(residents.deletedAt)));

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">MD- / NQZ-Prüfungs-Bundle</h1>
        <p className="mt-1 text-muted-foreground">Bereiten Sie eine Prüfung in unter 30 Sekunden vor — Stichprobe wählen, generieren, exportieren.</p>
      </div>
      <MdPruefungClient residents={resList} />
    </div>
  );
}
