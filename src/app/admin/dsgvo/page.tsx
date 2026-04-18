import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, dsgvoRequests } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { DsgvoClient } from "./dsgvo-client";
import { Shield, FileClock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  PageContainer, PageHeader, PageSection, PageGrid, StatCard,
} from "@/components/admin/page-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DsgvoPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const [resList, requests] = await Promise.all([
    db.select({ id: residents.id, fullName: residents.fullName, room: residents.room }).from(residents).where(and(eq(residents.tenantId, tenantId), isNull(residents.deletedAt))),
    db.select().from(dsgvoRequests).where(eq(dsgvoRequests.tenantId, tenantId)).orderBy(desc(dsgvoRequests.createdAt)),
  ]);

  const open = requests.filter((r) => r.status === "offen").length;
  const inReview = requests.filter((r) => r.status === "in_pruefung").length;
  const done = requests.filter((r) => r.status === "erledigt").length;
  const rejected = requests.filter((r) => r.status === "abgelehnt_aufbewahrungspflicht").length;

  return (
    <PageContainer>
      <PageHeader
        title="DSGVO"
        subtitle="Auskunft (Art. 15), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20)."
        icon={Shield}
        breadcrumbs={[
          { label: "Administration", href: "/admin" },
          { label: "DSGVO" },
        ]}
      />

      <PageSection heading="Anfragen-Status">
        <PageGrid columns={4}>
          <StatCard label="Offen" value={open} sublabel="Neu eingegangen" icon={FileClock} tone={open > 0 ? "warning" : "default"} />
          <StatCard label="In Prüfung" value={inReview} sublabel="Rechtliche Bewertung" icon={AlertTriangle} tone={inReview > 0 ? "primary" : "default"} />
          <StatCard label="Erledigt" value={done} sublabel="Gesamt-Historie" icon={CheckCircle2} tone="success" />
          <StatCard label="Abgelehnt" value={rejected} sublabel="Aufbewahrungspflicht" icon={Shield} tone={rejected > 0 ? "danger" : "default"} />
        </PageGrid>
      </PageSection>

      <DsgvoClient residents={resList} initialRequests={requests} />
    </PageContainer>
  );
}
