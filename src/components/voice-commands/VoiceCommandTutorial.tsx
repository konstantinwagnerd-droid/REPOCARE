"use client";

import { useState } from "react";
import { Mic, X } from "lucide-react";
import { byCategory, CATEGORY_LABELS } from "@/lib/voice-commands/registry";
import type { VoiceIntentCategory } from "@/lib/voice-commands/types";

export function VoiceCommandTutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cat, setCat] = useState<VoiceIntentCategory | "all">("all");
  const grouped = byCategory();
  const cats = Object.keys(grouped) as VoiceIntentCategory[];
  const visible = cat === "all" ? cats : [cat];

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-tutorial-title"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-card p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Schliessen"
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="mb-6 flex items-center gap-3">
          <Mic className="h-8 w-8 text-primary-600" aria-hidden />
          <h2 id="voice-tutorial-title" className="font-serif text-3xl font-semibold">
            Sprachbefehle
          </h2>
        </div>
        <p className="mb-6 text-muted-foreground">
          Leertaste 500 ms halten oder <kbd className="rounded bg-muted px-2 py-1 text-sm">Alt+V</kbd> druecken, um den
          Mikrofon-Modus zu starten.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cat === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            Alle
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {visible.map((c) => (
            <section key={c}>
              <h3 className="mb-3 font-serif text-xl font-semibold">{CATEGORY_LABELS[c]}</h3>
              <ul className="grid gap-3 md:grid-cols-2">
                {grouped[c].map((intent) => (
                  <li key={intent.id} className="rounded-2xl border border-border bg-background p-4">
                    <p className="font-medium">{intent.description}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {intent.examples.map((ex, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span aria-hidden className="text-primary-600">·</span>
                          &ldquo;{ex}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
