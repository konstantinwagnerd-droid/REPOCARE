import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listAllUserIds, getTimeSheetMonth, getUserMeta } from "@/lib/zeiterfassung/store";
import { ZeiterfassungAdminClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ZeiterfassungAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { tenantId: string; role: string };
  if (user.role !== "admin" && user.role !== "pdl") redirect("/app");
  const ym = new Date().toISOString().slice(0, 7);
  const ids = listAllUserIds(user.tenantId);
  const sheets = ids.map((uid) => getTimeSheetMonth(user.tenantId, uid, getUserMeta(user.tenantId, uid).name, ym));
  return <ZeiterfassungAdminClient initialSheets={sheets} ym={ym} />;
}
