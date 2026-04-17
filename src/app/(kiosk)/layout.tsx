import type { Metadata } from "next";
import { KioskShell } from "@/components/kiosk/KioskShell";

export const metadata: Metadata = {
  title: "Kiosk · CareAI",
  description: "Tablet-Kiosk fuer Pflegeeinrichtungen. Read-only, PIN-geschuetzt.",
  robots: { index: false, follow: false },
};

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <KioskShell>
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-900/40 text-neutral-50">
        {children}
      </main>
    </KioskShell>
  );
}
