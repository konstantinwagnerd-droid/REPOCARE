"use client";

// PWA Install-Prompt: zeigt einen "App installieren"-Button an, sobald der
// Browser ein `beforeinstallprompt`-Event feuert. Nur einmal pro Session.

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  if (!evt || dismissed) return null;

  return (
    <div
      role="region"
      aria-label="CareAI als App installieren"
      className="fixed bottom-4 right-4 z-[70] flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg"
    >
      <span>CareAI als App installieren — funktioniert auch offline.</span>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        onClick={async () => {
          await evt.prompt();
          await evt.userChoice;
          setEvt(null);
        }}
      >
        <Download className="h-3 w-3" aria-hidden /> Installieren
      </button>
      <button
        type="button"
        aria-label="Schließen"
        className="text-neutral-500 hover:text-neutral-700"
        onClick={() => setDismissed(true)}
      >
        ✕
      </button>
    </div>
  );
}
