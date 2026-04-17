import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { VoiceCommandProvider } from "@/components/voice-commands/VoiceCommandProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "angehoeriger") redirect("/family");

  return (
    <VoiceCommandProvider>
      <div className="flex min-h-screen">
        <Sidebar role={session.user.role} userName={session.user.name ?? "Team"} base="app" />
        <div className="flex flex-1 flex-col">
          <Topbar userName={session.user.name ?? "Team"} facility="Pflegezentrum Hietzing" />
          <main className="flex-1 bg-muted/20">{children}</main>
        </div>
      </div>
    </VoiceCommandProvider>
  );
}
