import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { VoiceCommandProvider } from "@/components/voice-commands/VoiceCommandProvider";
import { AnalyticsTracker } from "@/components/analytics/Tracker";
import { PrivacyBanner } from "@/components/analytics/PrivacyBanner";
import { NotificationToaster } from "@/components/notifications/NotificationToaster";
import { ImpersonationBanner } from "@/components/impersonation/banner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "pdl") redirect("/app");

  return (
    <VoiceCommandProvider>
      <ImpersonationBanner />
      <div className="flex min-h-screen">
        <Sidebar role={session.user.role} userName={session.user.name ?? "Admin"} base="admin" />
        <div className="flex flex-1 flex-col">
          <Topbar userName={session.user.name ?? "Admin"} facility="Pflegezentrum Hietzing · Admin" />
          <main id="main-content" className="flex-1 bg-muted/20 pb-8">{children}</main>
        </div>
      </div>
      <AnalyticsTracker role={session.user.role} />
      <NotificationToaster />
      <PrivacyBanner />
    </VoiceCommandProvider>
  );
}
