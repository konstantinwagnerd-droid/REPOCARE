import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { whatsappContacts, whatsappMessages, residents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isConfigured } from "@/lib/whatsapp/evolution-client";
import { listTemplates } from "@/lib/whatsapp/templates";
import { WhatsappAdminClient } from "./Client";

export const metadata = { title: "WhatsApp · Admin · CareAI" };

export default async function WhatsappAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "pdl") redirect("/app");

  const contacts = await db.select().from(whatsappContacts).where(eq(whatsappContacts.tenantId, session.user.tenantId));
  const recentMessages = await db
    .select()
    .from(whatsappMessages)
    .where(eq(whatsappMessages.tenantId, session.user.tenantId))
    .orderBy(desc(whatsappMessages.createdAt))
    .limit(50);
  const residentList = await db
    .select({ id: residents.id, fullName: residents.fullName })
    .from(residents)
    .where(eq(residents.tenantId, session.user.tenantId));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">WhatsApp (Evolution API)</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Angehoerigen-Benachrichtigung via Self-Hosted WhatsApp Gateway. DSGVO-konform: Keine Inhalte — Link ins Portal.
          </p>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-medium ${isConfigured() ? "border-green-500/30 bg-green-500/10 text-green-700" : "border-amber-500/30 bg-amber-500/10 text-amber-700"}`}>
          {isConfigured() ? "API konfiguriert" : "API nicht konfiguriert"}
        </div>
      </header>
      <WhatsappAdminClient
        initialContacts={contacts.map((c) => ({
          ...c,
          consentGivenAt: c.consentGivenAt?.toISOString() ?? null,
          createdAt: c.createdAt.toISOString(),
        }))}
        initialMessages={recentMessages.map((m) => ({
          ...m,
          sentAt: m.sentAt?.toISOString() ?? null,
          deliveredAt: m.deliveredAt?.toISOString() ?? null,
          readAt: m.readAt?.toISOString() ?? null,
          createdAt: m.createdAt.toISOString(),
        }))}
        residents={residentList}
        templates={listTemplates().map((t) => ({
          name: t.name,
          label: t.label,
          description: t.description,
          requiredVars: t.requiredVars,
          scope: t.scope,
        }))}
      />
    </div>
  );
}
