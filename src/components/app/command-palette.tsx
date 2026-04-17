"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard, Users, FileText, Mic, ShieldCheck, Settings, Plus, LogOut, Moon, Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        setOpen((o) => !o);
      }

      // Keyboard shortcuts (only when palette is closed)
      if (open) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "?" ) { e.preventDefault(); setOpen(true); return; }
      if (e.key === "g") {
        // Wait for next key
        const handler = (e2: KeyboardEvent) => {
          if (e2.key === "d") { router.push("/app"); setOpen(false); }
          if (e2.key === "b") { router.push("/app/residents"); setOpen(false); }
          document.removeEventListener("keydown", handler);
        };
        document.addEventListener("keydown", handler, { once: true });
      }
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) { router.push("/app/voice"); setOpen(false); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, router]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Suchen oder Befehl eingeben..." />
      <CommandList>
        <CommandEmpty>Kein Ergebnis. Versuchen Sie einen anderen Suchbegriff.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => router.push("/app"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/app/residents"))}>
            <Users className="mr-2 h-4 w-4" />
            Bewohner:innen
            <CommandShortcut>G B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/app/handover"))}>
            <FileText className="mr-2 h-4 w-4" />
            Schichtbericht
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/app/voice"))}>
            <Mic className="mr-2 h-4 w-4" />
            Spracheingabe starten
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Aktionen">
          <CommandItem onSelect={() => run(() => router.push("/app/voice"))}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Bericht
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/admin/audit"))}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Audit-Log
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/admin/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Erscheinungsbild">
          <CommandItem onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}>
            {resolvedTheme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {resolvedTheme === "dark" ? "Helles Design" : "Dunkles Design"}
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Konto">
          <CommandItem onSelect={() => run(() => signOut({ callbackUrl: "/" }))} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
