import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { emailInbound } from "@/db/schema";
import { desc, eq, or, isNull } from "drizzle-orm";
import { EmailInboxClient } from "./EmailInboxClient";

export const metadata = { title: "E-Mail-Posteingang · Admin · CareAI" };

export default async function EmailInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ classification?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  const sp = await searchParams;

  const rows = await db
    .select()
    .from(emailInbound)
    .where(tenantId ? or(eq(emailInbound.tenantId, tenantId), isNull(emailInbound.tenantId)) : undefined)
    .orderBy(desc(emailInbound.receivedAt))
    .limit(200);

  const filtered = sp.classification
    ? rows.filter((r) => r.classification === sp.classification)
    : rows;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">E-Mail-Posteingang</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Eingehende Mails an info@careai.health. Automatisch klassifiziert und an Abteilung weitergeleitet.
        </p>
      </header>
      <EmailInboxClient rows={filtered.map((r) => ({
        id: r.id,
        fromEmail: r.fromEmail,
        fromName: r.fromName,
        subject: r.subject,
        bodyText: r.bodyText ?? "",
        receivedAt: r.receivedAt ? new Date(r.receivedAt).toISOString() : new Date().toISOString(),
        classification: r.classification,
        confidence: r.confidence,
        routedTo: r.routedTo,
      }))} activeFilter={sp.classification ?? null} />
    </div>
  );
}
