import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LmsShell } from "@/components/lms/LmsShell";
import { DEMO_CURRENT_USER } from "@/lib/lms/store";

export default async function LmsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userName = session.user.name ?? DEMO_CURRENT_USER.name;
  const role = session.user.role ?? DEMO_CURRENT_USER.role;
  return (
    <LmsShell mode="learner" role={role} userName={userName} facility="Pflegezentrum Hietzing · Learning">
      {children}
    </LmsShell>
  );
}
