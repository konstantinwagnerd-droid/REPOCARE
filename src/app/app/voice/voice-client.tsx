"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Pause, Play, Loader2, Check, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const MAX_SECONDS = 5 * 60; // 5 min — Whisper Free-Tier safety

type Phase = "idle" | "recording" | "paused" | "transcribing" | "structuring" | "done" | "error";

type StructuredResult = {
  summary: string;
  sisTags?: string[];
  vitals?: Array<{ type?: string; label?: string; value: string | number; unit?: string }>;
  actions?: Array<{ text: string; urgency?: string } | string>;
  concerns?: string[];
  recommendations?: string[];
  confidence?: number;
  provider?: string;
};

/**
 * Picks the first MIME type supported by this browser.
 * Safari ≥ 14 needs mp4; Chromium/FF prefer webm/opus.
 */
function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const c of candidates) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((MediaRecorder as any).isTypeSupported?.(c)) return c;
  }
  return "";
}

export function VoiceClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const [editableTranscript, setEditableTranscript] = useState<string>("");
  const [structured, setStructured] = useState<StructuredResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(new Array(32).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeRef = useRef<string>("");

  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, []);

  function stopAllStreams() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    mediaRecorderRef.current = null;
  }

  function startVisualizer(stream: MediaStream) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    src.connect(analyser);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    const buf = new Uint8Array(analyser.fftSize);
    const loop = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(buf);
      // Downsample to 32 bars.
      const bars: number[] = [];
      const step = Math.floor(buf.length / 32);
      for (let i = 0; i < 32; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += Math.abs(buf[i * step + j] - 128);
        bars.push(Math.min(1, sum / step / 64));
      }
      setWaveform(bars);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }

  async function start() {
    setErrorMsg("");
    setTranscript("");
    setStructured(null);
    setSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      mimeRef.current = mime;
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => void handleStop();
      mr.start(250);
      mediaRecorderRef.current = mr;
      startVisualizer(stream);
      setPhase("recording");
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            // auto-stop at limit
            try {
              mediaRecorderRef.current?.state !== "inactive" && mediaRecorderRef.current?.stop();
            } catch {}
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      setErrorMsg(
        "Mikrofonzugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen."
      );
      setPhase("error");
      // eslint-disable-next-line no-console
      console.error("getUserMedia failed", e);
    }
  }

  function pause() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state === "recording") {
      mr.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("paused");
    }
  }

  function resume() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state === "paused") {
      mr.resume();
      timerRef.current = setInterval(() => {
        setSeconds((s) => (s + 1 >= MAX_SECONDS ? MAX_SECONDS : s + 1));
      }, 1000);
      setPhase("recording");
    }
  }

  function stop() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state !== "inactive") mr.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleStop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("transcribing");

    const mime = mimeRef.current || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mime });
    chunksRef.current = [];

    try {
      const fd = new FormData();
      const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm";
      fd.append("audio", blob, `recording.${ext}`);
      fd.append("durationSeconds", String(seconds));

      const resp = await fetch("/api/voice/transcribe", { method: "POST", body: fd });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({ error: "unknown" }));
        if (resp.status === 429) {
          throw new Error("Tageslimit erreicht (10 Transkriptionen pro Tag).");
        }
        if (resp.status === 413) {
          throw new Error("Aufnahme zu lang. Maximum: 5 Minuten.");
        }
        throw new Error(body.error ?? `HTTP ${resp.status}`);
      }
      const data = (await resp.json()) as { transcript: string; provider?: string };
      setTranscript(data.transcript ?? "");
      setEditableTranscript(data.transcript ?? "");

      // Auto-run structure step
      await runStructure(data.transcript ?? "");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Transkription fehlgeschlagen.");
      setPhase("error");
    }
  }

  async function runStructure(text: string) {
    setPhase("structuring");
    try {
      const resp = await fetch("/api/voice/structure", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as StructuredResult;
      setStructured(data);
      setPhase("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Strukturierung fehlgeschlagen.");
      setPhase("error");
    }
  }

  async function reprocess() {
    setEditMode(false);
    setTranscript(editableTranscript);
    await runStructure(editableTranscript);
  }

  function reset() {
    stopAllStreams();
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setEditableTranscript("");
    setStructured(null);
    setErrorMsg("");
    setEditMode(false);
  }

  const timeString = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;
  const nearLimit = seconds >= MAX_SECONDS - 30;

  return (
    <div className="space-y-6">
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-5 py-12 text-center">
          <button
            onClick={start}
            className="group flex h-32 w-32 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Aufnahme starten"
          >
            <Mic className="h-12 w-12" />
          </button>
          <div>
            <div className="font-serif text-xl font-semibold">Tippen Sie, um zu sprechen</div>
            <div className="text-sm text-muted-foreground">
              Maximal 5 Minuten pro Aufnahme. Audio wird nicht dauerhaft gespeichert.
            </div>
          </div>
        </div>
      )}

      {(phase === "recording" || phase === "paused") && (
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <div className="relative">
            {phase === "recording" &&
              [1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-destructive"
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 + i * 0.3 }}
                  transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
            <button
              onClick={stop}
              className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg"
              aria-label="Aufnahme stoppen"
            >
              <Square className="h-12 w-12 fill-current" />
            </button>
          </div>

          {/* Waveform */}
          <div className="flex h-12 items-center gap-1">
            {waveform.map((v, i) => (
              <div
                key={i}
                className="w-1.5 rounded-sm bg-accent/80"
                style={{ height: `${Math.max(4, v * 48)}px` }}
              />
            ))}
          </div>

          <div>
            <div className="font-serif text-2xl font-semibold tabular-nums">{timeString}</div>
            <div className={`text-sm ${nearLimit ? "text-destructive" : "text-muted-foreground"}`}>
              {nearLimit
                ? `Noch ${MAX_SECONDS - seconds}s — Aufnahme wird automatisch gestoppt.`
                : phase === "paused"
                ? "Pausiert — zum Fortsetzen tippen."
                : "Aufnahme läuft."}
            </div>
          </div>

          <div className="flex gap-2">
            {phase === "recording" ? (
              <Button variant="outline" size="sm" onClick={pause}>
                <Pause className="mr-1 h-4 w-4" /> Pause
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={resume}>
                <Play className="mr-1 h-4 w-4" /> Fortsetzen
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={reset}>
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      {(phase === "transcribing" || phase === "structuring") && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="font-serif text-lg font-semibold">
            {phase === "transcribing" ? "Transkription läuft…" : "KI strukturiert nach SIS…"}
          </div>
          <div className="text-sm text-muted-foreground">
            Das kann ca. 10–30 Sekunden dauern.
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="font-serif text-lg font-semibold">Fehler</div>
          <p className="max-w-md text-sm text-muted-foreground">{errorMsg}</p>
          <Button onClick={reset}>Neu starten</Button>
        </div>
      )}

      {phase === "done" && structured && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary" /> Transkript
              </div>
              {!editMode ? (
                <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                  Bearbeiten
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditMode(false);
                    setEditableTranscript(transcript);
                  }}>
                    Abbrechen
                  </Button>
                  <Button variant="accent" size="sm" onClick={reprocess}>
                    Übernehmen & neu strukturieren
                  </Button>
                </div>
              )}
            </div>
            {editMode ? (
              <textarea
                className="min-h-32 w-full rounded-lg border border-border bg-background p-3 text-sm leading-relaxed"
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{transcript}</p>
            )}
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
                <Sparkles className="h-3.5 w-3.5" /> KI-Vorschlag · prüfen vor Übernahme
              </div>
              {typeof structured.confidence === "number" && (
                <Badge variant="outline" className="text-xs">
                  Konfidenz: {Math.round(structured.confidence * 100)}%
                </Badge>
              )}
            </div>
            <h3 className="font-serif text-lg font-semibold">{structured.summary}</h3>

            {structured.sisTags && structured.sisTags.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold">SIS-Zuordnung</div>
                <div className="flex flex-wrap gap-2">
                  {structured.sisTags.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {structured.vitals && structured.vitals.length > 0 && (
                <div>
                  <div className="mb-2 text-sm font-semibold">Erkannte Vitalwerte</div>
                  <ul className="space-y-1 text-sm">
                    {structured.vitals.map((v, i) => (
                      <li
                        key={i}
                        className="flex justify-between rounded-lg bg-background px-3 py-2"
                      >
                        <span className="text-muted-foreground">{v.label ?? v.type}</span>
                        <span className="font-semibold">
                          {v.value}
                          {v.unit ? ` ${v.unit}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {structured.actions && structured.actions.length > 0 && (
                <div>
                  <div className="mb-2 text-sm font-semibold">Vorgeschlagene Maßnahmen</div>
                  <ul className="space-y-1 text-sm">
                    {structured.actions.map((a, i) => {
                      const text = typeof a === "string" ? a : a.text;
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-2 rounded-lg bg-background px-3 py-2"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {structured.concerns && structured.concerns.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Auffälligkeiten
                </div>
                <ul className="space-y-1 text-sm">
                  {structured.concerns.map((c, i) => (
                    <li key={i} className="rounded-lg bg-destructive/10 px-3 py-2">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {structured.provider && (
              <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                Provider: {structured.provider}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="accent" size="lg">
              Übernehmen & speichern
            </Button>
            <Button variant="outline" size="lg" onClick={() => setEditMode(true)}>
              Bearbeiten
            </Button>
            <Button variant="ghost" onClick={reset}>
              Neu aufnehmen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
