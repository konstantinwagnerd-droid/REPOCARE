"use client";

import { Mic, X } from "lucide-react";
import { useVoiceCommands } from "./VoiceCommandProvider";

export function VoiceCommandOverlay() {
  const { listening, transcript, stop } = useVoiceCommands();
  if (!listening) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sprachbefehl aktiv"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg"
    >
      <button
        onClick={stop}
        aria-label="Aufnahme beenden"
        className="absolute right-8 top-8 rounded-full bg-white/10 p-3 hover:bg-white/20"
      >
        <X className="h-6 w-6 text-white" aria-hidden />
      </button>
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-500/60" />
          <div className="absolute inset-4 animate-pulse rounded-full bg-primary-400/50" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl">
            <Mic className="h-16 w-16 text-white" aria-hidden />
          </div>
        </div>
        <p className="text-xl text-white/80">Ich hoere zu…</p>
        <div
          className="min-h-[3rem] max-w-2xl text-center font-serif text-3xl font-semibold text-white"
          aria-live="polite"
        >
          {transcript || <span className="text-white/40">Sprechen Sie jetzt</span>}
        </div>
        <p className="text-sm text-white/50">Leertaste loslassen oder ESC zum Beenden</p>
      </div>
    </div>
  );
}
