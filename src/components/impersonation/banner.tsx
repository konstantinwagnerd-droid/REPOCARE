import { getCurrentImpersonation } from "@/lib/impersonation/service";
import { ImpersonationBannerClient } from "./banner-client";

export async function ImpersonationBanner() {
  const session = await getCurrentImpersonation();
  if (!session) return null;
  return (
    <ImpersonationBannerClient
      adminName={session.adminName}
      targetName={session.targetName}
      targetRole={session.targetRole}
      startedAt={session.startedAt}
    />
  );
}
