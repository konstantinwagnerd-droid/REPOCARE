"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Loader2, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const mockTranscript = `Frau Berger hat heute um sieben Uhr gut gefrühstückt, eine ganze Semmel mit Marmelade und einen Kaffee. Blutdruck gemessen 132 auf 78, Puls 74, regelmäßig. Keine Schmerzen geäußert. Die Wunde am rechten Unterschenkel zeigt erste Granulation, Verband wurde gewechselt. Mobilisation mit Gehhilfe hat heute 15 Minuten geklappt, sie war stolz darauf. Stimmung insgesamt gut.`;

const mockStructured = {
  summary: "Frühdienst Frau Berger, 15.04., unauffällig mit Fortschritten.",
  sis: [
    { field: "Themenfeld 2 (Mobilität)", note: "Mobilisation mit Gehhilfe 15 min — deutlich verbessert" },
    { field: "Themenfeld 3 (Krankheitsbezogen)", note: "Wunde UE rechts: Grad II, Granulation sichtbar" },
    { field: "Themenfeld 4 (Selbstversorgung)", note: "Nahrungsaufnahme: komplette Mahlzeit eigenständig" },
  ],
  vitals: [
    { label: "Blutdruck", value: "132/78 mmHg" },
    { label: "Puls", value: "74 bpm, regelmäßig" },
  ],
  actions: [
    "Verbandswechsel morgen 08:00 einplanen",
    "Mobilisation heute nachmittags wiederholen",
    "Schmerz-Screening nächste Schicht",
  ],
  concerns: [] as string[],
};

type Phase = "idle" | "recording" | "transcribing" | "structuring" | "done";

export function VoiceClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phase !== "recording") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  async function stop() {
    setPhase("transcribing");
    await new Promise((r) => setTimeout(r, 1500));
    setPhase("structuring");
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("done");
  }

  function start() { setSeconds(0); setPhase("recording"); }
  function reset() { setPhase("idle"); setSeconds(0); }

  return (
    <div className="space-y-6">
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-5 py-12 text-center">
          <button onClick={start} className="group flex h-32 w-32 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 active:scale-95" aria-label="Aufnahme starten">
            <Mic className="h-12 w-12" />
          </button>
          <div>
            <div className="font-serif text-xl font-semibold">Tippen Sie, um zu sprechen</div>
            <div className="text-sm text-muted-foreground">Sprechen Sie frei — CareAI versteht Dialekt und Fachbegriffe.</div>
          </div>
        </div>
      )}

      {phase === "recording" && (
        <div className="flex flex-col items-center gap-5 py-12 text-center">
          <div className="relative">
            {/* Pulsing audio wave rings */}
            {[1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-destructive"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 + i * 0.3 }}
                transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
            <button onClick={stop} className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg" aria-label="Aufnahme stoppen">
              <Square className="h-12 w-12 fill-current" />
            </button>
          </div>
          <div>
            <motion.div
              className="font-serif text-2xl font-semibold tabular-nums"
              key={seconds}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </motion.div>
            <div className="text-sm text-muted-foreground">Aufnahme läuft — tippen Sie zum Stoppen.</div>
          </div>
        </div>
      )}

      {(phase === "transcribing" || phase === "structuring") && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="font-serif text-lg font-semibold">
            {phase === "transcribing" ? "Transkription läuft…" : "KI strukturiert nach SIS…"}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary" /> Transkript
            </div>
            <p className="text-sm leading-relaxed">{mockTranscript}</p>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> KI-Vorschlag · prüfen vor Übernahme
            </div>
            <h3 className="font-serif text-lg font-semibold">{mockStructured.summary}</h3>

            <div className="mt-4">
              <div className="mb-2 text-sm font-semibold">SIS-Zuordnung</div>
              <div className="space-y-2">
                {mockStructured.sis.map((s) => (
                  <div key={s.field} className="flex gap-2 rounded-lg bg-background p-3 text-sm">
                    <Badge variant="outline" className="shrink-0">{s.field}</Badge>
                    <span>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold">Erkannte Vitalwerte</div>
                <ul className="space-y-1 text-sm">
                  {mockStructured.vitals.map((v) => (
                    <li key={v.label} className="flex justify-between rounded-lg bg-background px-3 py-2">
                      <span className="text-muted-foreground">{v.label}</span>
                      <span className="font-semibold">{v.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold">Vorgeschlagene Maßnahmen</div>
                <ul className="space-y-1 text-sm">
                  {mockStructured.actions.map((a) => (
                    <li key={a} className="flex items-start gap-2 rounded-lg bg-background px-3 py-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="accent" size="lg">Übernehmen & speichern</Button>
            <Button variant="outline" size="lg">Bearbeiten</Button>
            <Button variant="ghost" onClick={reset}>Neu aufnehmen</Button>
          </div>
        </div>
      )}
    </div>
  );
}
