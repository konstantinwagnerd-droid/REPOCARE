import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { MobileBottomNav } from "@/components/app/mobile-bottom-nav";
import { VoiceCommandProvider } from "@/components/voice-commands/VoiceCommandProvider";
import { AnalyticsTracker } from "@/components/analytics/Tracker";
import { PrivacyBanner } from "@/components/analytics/PrivacyBanner";
import { NotificationToaster } from "@/components/notifications/NotificationToaster";
import { ImpersonationBanner } from "@/components/impersonation/banner";
import { OfflineBanner } from "@/components/sample-data/OfflineBanner";
import { TourProvider } from "@/components/tour/TourProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "angehoeriger") redirect("/family");

  return (
    <VoiceCommandProvider>
      <TourProvider role={session.user.role}>
        <ImpersonationBanner />
        <div className="flex min-h-screen">
          <Sidebar role={session.user.role} userName={session.user.name ?? "Team"} base="app" />
          <div className="flex flex-1 flex-col">
            <Topbar userName={session.user.name ?? "Team"} facility="Pflegezentrum Hietzing" />
            <main id="main-content" className="flex-1 bg-muted/20">{children}</main>
          </div>
        </div>
        <MobileBottomNav role={session.user.role} userName={session.user.name ?? "Team"} />
        <AnalyticsTracker role={session.user.role} />
        <NotificationToaster />
        <PrivacyBanner />
        <OfflineBanner />
      </TourProvider>
    </VoiceCommandProvider>
  );
}
