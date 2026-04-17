"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { match, buildContext } from "@/lib/voice-commands/matcher";
import { beep, speak } from "@/lib/voice-commands/feedback";
import { emitVoiceEvent } from "@/lib/voice-commands/bus";
import { VoiceCommandOverlay } from "./VoiceCommandOverlay";

/**
 * Minimal Web Speech Recognition typing (not yet in lib.dom).
 */
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [i: number]: { 0: { transcript: string }; isFinal: boolean; length: number };
  };
}
type SpeechRecognitionLike = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: Event) => void) | null;
};

export interface VoiceLogEntry {
  at: string;
  utterance: string;
  intentId: string | null;
  matched: boolean;
}

interface Ctx {
  listening: boolean;
  start: () => void;
  stop: () => void;
  transcript: string;
  log: VoiceLogEntry[];
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  supported: boolean;
}

const VoiceCtx = createContext<Ctx | null>(null);

export function useVoiceCommands() {
  const c = useContext(VoiceCtx);
  if (!c) throw new Error("useVoiceCommands must be used within VoiceCommandProvider");
  return c;
}

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [log, setLog] = useState<VoiceLogEntry[]>([]);
  const [enabled, setEnabledState] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }, []);

  // Load enabled preference
  useEffect(() => {
    try {
      const v = window.localStorage.getItem("careai.voice.enabled");
      if (v !== null) setEnabledState(v === "1");
    } catch {
      /* silent */
    }
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      window.localStorage.setItem("careai.voice.enabled", v ? "1" : "0");
    } catch {
      /* silent */
    }
  }, []);

  // Init SpeechRecognition
  const ensureRec = useCallback(() => {
    if (recRef.current) return recRef.current;
    if (!supported) return null;
    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = "de-DE";
    rec.continuous = false;
    rec.interimResults = true;
    recRef.current = rec;
    return rec;
  }, [supported]);

  const handleFinal = useCallback(
    (utterance: string) => {
      const result = match(utterance);
      const entry: VoiceLogEntry = {
        at: new Date().toISOString(),
        utterance,
        intentId: result.intent?.id ?? null,
        matched: !!result.intent,
      };
      setLog((prev) => [entry, ...prev].slice(0, 50));
      if (result.intent) {
        const ctx = buildContext(utterance, result.groups, pathname ?? "/");
        const res = result.intent.action(ctx);
        if (res.speak) speak(res.speak);
        if (res.event) emitVoiceEvent(res.event);
        if (res.navigate) router.push(res.navigate);
      } else {
        speak("Nicht verstanden");
        beep("error");
      }
    },
    [pathname, router],
  );

  const start = useCallback(() => {
    if (!enabled) return;
    const rec = ensureRec();
    if (!rec) return;
    setTranscript("");
    setListening(true);
    beep("start");
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0].transcript;
        if (r.isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final.trim()) {
        handleFinal(final.trim());
      }
    };
    rec.onend = () => {
      setListening(false);
      beep("end");
    };
    rec.onerror = () => {
      setListening(false);
      beep("error");
    };
    try {
      rec.start();
    } catch {
      /* already running */
    }
  }, [enabled, ensureRec, handleFinal]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* silent */
    }
    setListening(false);
  }, []);

  // Hotkey — Alt+V toggles
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        if (listening) stop();
        else start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, listening, start, stop]);

  // Hold-Space 500ms (nur wenn Fokus NICHT in Eingabefeld)
  useEffect(() => {
    if (!enabled) return;
    let timer: number | null = null;
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (timer) return;
      timer = window.setTimeout(() => {
        start();
        timer = null;
      }, 500);
    };
    const onUp = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled, start]);

  const value = useMemo<Ctx>(
    () => ({ listening, start, stop, transcript, log, enabled, setEnabled, supported }),
    [listening, start, stop, transcript, log, enabled, setEnabled, supported],
  );

  return (
    <VoiceCtx.Provider value={value}>
      {children}
      <VoiceCommandOverlay />
    </VoiceCtx.Provider>
  );
}
