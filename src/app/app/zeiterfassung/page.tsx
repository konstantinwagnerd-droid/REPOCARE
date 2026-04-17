import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStatus, getTimeSheetMonth } from "@/lib/zeiterfassung/store";
import { ZeiterfassungClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ZeiterfassungPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id: string; name?: string; tenantId: string };
  const status = getStatus(user.tenantId, user.id);
  const ym = new Date().toISOString().slice(0, 7);
  const sheet = getTimeSheetMonth(user.tenantId, user.id, user.name ?? user.id, ym);
  return <ZeiterfassungClient initialStatus={status} initialSheet={sheet} userName={user.name ?? user.id} />;
}
