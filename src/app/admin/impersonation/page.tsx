import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { listSessions } from "@/lib/impersonation/store";
import { getCurrentImpersonation } from "@/lib/impersonation/service";
import { ImpersonationClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ImpersonationPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { role: string; tenantId: string; id: string };
  if (user.role !== "admin") redirect("/admin");
  const allUsers = await db.select().from(users).where(eq(users.tenantId, user.tenantId));
  const history = listSessions(user.tenantId, 50);
  const current = await getCurrentImpersonation();
  return (
    <ImpersonationClient
      adminId={user.id}
      users={allUsers.map((u) => ({ id: u.id, name: u.fullName, email: u.email, role: u.role }))}
      history={history}
      current={current}
    />
  );
}
