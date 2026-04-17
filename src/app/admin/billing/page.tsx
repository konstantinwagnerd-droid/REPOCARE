import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listApiKeys, getTenantUsage, listInvoices } from "@/lib/billing/store";
import { PLAN_LIST } from "@/lib/billing/plans";
import { BillingClient } from "./client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = (session.user as { tenantId: string }).tenantId;
  const keys = listApiKeys(tenantId);
  const usage = getTenantUsage(tenantId, 30);
  const invoices = listInvoices(tenantId);
  return <BillingClient initialKeys={keys} initialUsage={usage} initialInvoices={invoices} plans={PLAN_LIST} />;
}
