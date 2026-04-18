import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

export type PrintContext = {
  facilityName: string;
  facilityAddress?: string;
  userName: string;
  tenantId: string;
  userId?: string;
};

/**
 * Laedt Mandanten-Daten fuer Print-Header/Footer.
 * Fallback: generischer Demo-Mandant, damit Seiten auch ohne echten Session-
 * Eintrag rendern.
 */
export async function getPrintContext(): Promise<PrintContext> {
  const session = await auth();
  const user = session?.user as { name?: string; tenantId?: string; id?: string } | undefined;
  const fallback: PrintContext = {
    facilityName: "CareAI Demo-Einrichtung",
    facilityAddress: undefined,
    userName: user?.name ?? "Team",
    tenantId: user?.tenantId ?? "",
    userId: user?.id,
  };
  if (!user?.tenantId) return fallback;
  try {
    const [t] = await db.select().from(tenants).where(eq(tenants.id, user.tenantId)).limit(1);
    if (!t) return fallback;
    return {
      facilityName: t.name,
      facilityAddress: t.address ?? undefined,
      userName: user.name ?? "Team",
      tenantId: t.id,
      userId: user.id,
    };
  } catch {
    return fallback;
  }
}

export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function fmtDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}
