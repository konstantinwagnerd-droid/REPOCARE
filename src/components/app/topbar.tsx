"use client";

import { Bell, Search, Mic, AlertTriangle, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useState } from "react";
import { CommandPalette } from "./command-palette";
import { toast } from "sonner";

export function Topbar({ userName, facility }: { userName: string; facility: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [, setCmdOpen] = useState(false);

  const handleEmergency = () => {
    toast.error("Notfall gemeldet! Bitte sofort zur Station.", {
      duration: 10000,
      action: { label: "Details eingeben", onClick: () => {} },
    });
  };

  return (
    <>
      <CommandPalette />
      <div className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{facility}</div>
          <div className="font-serif text-sm font-semibold">
            Heute, {new Date().toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Emergency button */}
          <button
            onClick={handleEmergency}
            aria-label="Notfall melden"
            className="flex h-10 items-center gap-1.5 rounded-xl bg-destructive px-3 text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Notfall
          </button>

          {/* Voice shortcut */}
          <a href="/app/voice" aria-label="Spracheingabe starten" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary text-primary transition-colors">
            <Mic className="h-4 w-4" />
          </a>

          {/* Search / command palette */}
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Suche öffnen (Cmd+K)"
            className="flex h-10 items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Suchen</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 text-xs sm:inline">⌘K</kbd>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Design wechseln"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <button aria-label="Benachrichtigungen" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4" />
            <Badge variant="accent" className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 text-[10px]">3</Badge>
          </button>

          <Avatar>
            <AvatarFallback>{initials(userName)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
}
