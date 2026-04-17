"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { HelpTip } from "@/components/tooltip/HelpTip";
import { KeyboardHint } from "@/components/tooltip/KeyboardHint";

const mockHandover = `ÜBERGABE FRÜHDIENST → SPÄTDIENST — Station A, ${new Date().toLocaleDateString("de-AT")}

AUFMERKSAMKEIT BENÖTIGT
• Frau Berger (Zi. 114): Mobilisation heute nur mit Gehhilfe möglich, Sturzangst. Nächste Schicht: Aufstehhilfe zusätzlich kontrollieren.
• Herr Kovač (Zi. 207): RR-Werte leicht erhöht (148/89 um 10:30), arztinformiert. Kontrolle 16:00 geplant.
• Frau Sommer (Zi. 305): Dekubitus Grad II am Sakrum zeigt erste Granulation, nächster Verbandswechsel um 18:00.

MEDIKATION
• Herr Leitner: Marcumar-Plan angepasst, INR-Kontrolle morgen 07:00.
• Frau Wagner: Schmerzmedikation bei Bedarf — Pause eingehalten, zuletzt 14:00.

VORFÄLLE LETZTE 8H
• 09:15 — Frau Weber: kurzfristige Desorientierung, nach 10 min spontan rückläufig.
• 11:40 — Herr Binder: Sturzereignis im Bad, keine Verletzung, Protokoll erstellt.

POSITIV
• Frau Müller zeigt deutliche Fortschritte beim Essen, heute komplette Mahlzeit eigenständig.
• Gruppenaktivität „Erinnerungsrunde“ mit 7 Bewohner:innen sehr gut angenommen.

OFFENE AUFGABEN
• Wunddoku-Fotos Frau Sommer abschließen
• Angehörigengespräch Familie Kovač um 17:00 bestätigen
• Badewanne Zi. 207 meldet Wartungsbedarf (bereits gemeldet)`;

export function HandoverGenerator() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setState("loading");
    await new Promise((r) => setTimeout(r, 2200));
    setState("done");
  }

  async function copy() {
    await navigator.clipboard.writeText(mockHandover);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (state === "idle") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </span>
        <div>
          <h3 className="flex items-center justify-center gap-2 font-serif text-xl font-semibold">
            Übergabe automatisch erstellen
            <HelpTip label="Wie funktioniert das?">
              Die Uebergabe wird SIS-strukturiert aus Berichten, Vitalwerten, Wundverlauf und Vorfaellen der letzten 8h generiert.
              Sie koennen die Formatierung vor dem Speichern manuell anpassen.
            </HelpTip>
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            CareAI analysiert alle Berichte und Ereignisse der letzten 8 Stunden und erstellt einen strukturierten Übergabebericht.
          </p>
        </div>
        <Button onClick={generate} variant="accent" size="lg"><Sparkles className="h-4 w-4" /> Bericht generieren</Button>
        <KeyboardHint keys={["Mod", "Enter"]} className="mt-1" />
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-1">
          <div className="font-serif text-lg font-semibold">Berichte werden analysiert…</div>
          <div className="text-sm text-muted-foreground">Vitalwerte · Maßnahmen · Vorfälle · Wundverlauf</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-5 font-sans text-sm leading-relaxed">{mockHandover}</pre>
      <div className="flex flex-wrap gap-2">
        <Button onClick={copy} variant="outline">{copied ? <><Check className="h-4 w-4" /> Kopiert</> : <><Copy className="h-4 w-4" /> Kopieren</>}</Button>
        <Button variant="accent">Als Übergabe speichern</Button>
        <Button variant="ghost" onClick={() => setState("idle")}>Neu generieren</Button>
      </div>
    </div>
  );
}
