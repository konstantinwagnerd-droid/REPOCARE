"use client";

import { Bell, Search, Mic, AlertTriangle, Moon, Sun, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useState } from "react";
import { CommandPalette } from "./command-palette";
import { toast } from "sonner";
import { useOptionalTour } from "@/components/tour/TourProvider";
import { useOptionalT } from "@/lib/i18n";
import { AppLanguageSwitcher } from "./app-language-switcher";

export function Topbar({ userName, facility }: { userName: string; facility: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [, setCmdOpen] = useState(false);
  const tourCtx = useOptionalTour();
  const i18n = useOptionalT();
  const t = i18n?.t ?? ((_k: string, f?: string) => f ?? _k);

  const handleEmergency = () => {
    toast.error(t("emergency.reported", "Notfall gemeldet! Bitte sofort zur Station."), {
      duration: 10000,
      action: { label: t("emergency.enterDetails", "Details eingeben"), onClick: () => {} },
    });
  };

  return (
    <>
      <CommandPalette />
      <div data-tour="topbar" className="flex h-16 items-center justify-between gap-2 border-b border-border bg-background pl-16 pr-3 sm:px-6 lg:pl-6">
        <div className="min-w-0">
          <div className="truncate text-xs uppercase tracking-wider text-muted-foreground">{facility}</div>
          <div className="truncate font-serif text-sm font-semibold">
            <span className="hidden sm:inline">Heute, </span>
            {new Date().toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Emergency button — immer sichtbar, primär auf Mobile */}
          <button
            onClick={handleEmergency}
            aria-label={t("topbar.emergency", "Notfall melden")}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-destructive px-3 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">{t("topbar.emergency", "Notfall")}</span>
          </button>

          {i18n && <AppLanguageSwitcher />}

          {/* Voice shortcut — auf Mobile nicht nötig (Bottom-Nav hat Voice) */}
          <a
            href="/app/voice"
            aria-label="Spracheingabe starten"
            className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border text-primary transition-colors hover:bg-secondary lg:flex"
          >
            <Mic className="h-4 w-4" />
          </a>

          {/* Search / command palette */}
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Suche öffnen (Cmd+K)"
            className="hidden h-11 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Suchen</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 text-xs lg:inline">⌘K</kbd>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={resolvedTheme === "dark" ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Tour / Hilfe — nur Desktop */}
          {tourCtx && (
            <button
              onClick={() => tourCtx?.startTourForRole("pflegekraft")}
              aria-label="Tour / Hilfe"
              className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary lg:flex"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}

          {/* Notifications */}
          <button
            aria-label="Benachrichtigungen (3 ungelesen)"
            className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary sm:flex"
          >
            <Bell className="h-4 w-4" />
            <Badge variant="accent" className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 text-[10px]">3</Badge>
          </button>

          <Avatar className="hidden sm:flex">
            <AvatarFallback>{initials(userName)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
}
