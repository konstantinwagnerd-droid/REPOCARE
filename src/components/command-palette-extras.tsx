"use client";

import { useRouter } from "next/navigation";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { HelpCircle, Calculator, ClipboardList, RefreshCw, LifeBuoy } from "lucide-react";

/**
 * Zusaetzliche Commands fuer die globale Command-Palette.
 * Einbindung: <CommandPaletteExtras onSelect={() => close()} /> innerhalb cmdk <CommandList>.
 */
export function CommandPaletteExtras({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter();

  const go = (href: string) => {
    onSelect?.();
    router.push(href);
  };

  const resetDemoData = async () => {
    onSelect?.();
    if (!confirm("Demo-Daten wirklich zuruecksetzen? Diese Aktion kann nicht rueckgaengig gemacht werden.")) return;
    try {
      await fetch("/api/demo/reset", { method: "POST" });
      alert("Demo-Daten wurden zurueckgesetzt.");
    } catch {
      alert("Zuruecksetzen fehlgeschlagen — bitte erneut versuchen.");
    }
  };

  return (
    <CommandGroup heading="Hilfe & Tools">
      <CommandItem onSelect={() => go("/help/sis-anleitung")}>
        <HelpCircle className="mr-2 h-4 w-4" />
        Hilfe oeffnen: SIS
      </CommandItem>
      <CommandItem onSelect={() => go("/help/spracheingabe-grundlagen")}>
        <HelpCircle className="mr-2 h-4 w-4" />
        Hilfe oeffnen: Spracheingabe
      </CommandItem>
      <CommandItem onSelect={() => go("/help/md-export")}>
        <HelpCircle className="mr-2 h-4 w-4" />
        Hilfe oeffnen: MD-Export
      </CommandItem>
      <CommandItem onSelect={() => go("/roi-rechner")}>
        <Calculator className="mr-2 h-4 w-4" />
        ROI-Rechner oeffnen
      </CommandItem>
      <CommandItem onSelect={() => go("/changelog")}>
        <ClipboardList className="mr-2 h-4 w-4" />
        Changelog anschauen
      </CommandItem>
      <CommandItem onSelect={() => go("/status")}>
        <LifeBuoy className="mr-2 h-4 w-4" />
        System-Status
      </CommandItem>
      <CommandItem onSelect={resetDemoData}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Demo-Daten zuruecksetzen
      </CommandItem>
    </CommandGroup>
  );
}
