"use client";

import { useState } from "react";
import { Mic, Check, X, Play, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoiceCommands } from "@/components/voice-commands/VoiceCommandProvider";
import { VoiceCommandTutorial } from "@/components/voice-commands/VoiceCommandTutorial";
import { byCategory, CATEGORY_LABELS } from "@/lib/voice-commands/registry";
import type { VoiceIntentCategory } from "@/lib/voice-commands/types";

export default function VoiceCommandsSettingsPage() {
  const { enabled, setEnabled, supported, start, listening, log } = useVoiceCommands();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [disabledCats, setDisabledCats] = useState<Set<VoiceIntentCategory>>(new Set());
  const grouped = byCategory();

  const toggleCat = (c: VoiceIntentCategory) => {
    setDisabledCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      try {
        window.localStorage.setItem("careai.voice.disabledCategories", JSON.stringify([...next]));
      } catch {
        /* silent */
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Mic className="h-10 w-10 text-primary-600" aria-hidden />
          <h1 className="font-serif text-4xl font-semibold">Sprachbefehle</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Navigieren, dokumentieren und Vitalwerte eintragen per Sprache. Verarbeitung erfolgt vollstaendig im Browser —
          keine Audio-Daten werden an CareAI gesendet.
        </p>
      </header>

      {!supported && (
        <Card className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/30">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-200">
              Nicht unterstuetzt
            </CardTitle>
            <CardDescription>
              Ihr Browser unterstuetzt die Web-Speech-API nicht. Empfohlen: Chrome, Edge, Safari auf iOS 14.5+.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Aktivierung und Hotkeys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 p-4">
            <div>
              <p className="font-medium">Sprachbefehle aktiv</p>
              <p className="text-sm text-muted-foreground">
                Alt+V zum Starten · Leertaste 500 ms halten · ESC abbrechen
              </p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-6 w-6 accent-primary-600"
              aria-label="Sprachbefehle aktivieren"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button onClick={start} disabled={!enabled || !supported || listening} variant="default">
              <Play className="h-4 w-4" aria-hidden />
              {listening ? "Hoere zu…" : "Test-Modus starten"}
            </Button>
            <Button onClick={() => setTutorialOpen(true)} variant="outline">
              <BookOpen className="h-4 w-4" aria-hidden />
              Alle Befehle anzeigen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kategorien</CardTitle>
          <CardDescription>Bestimmte Kategorien koennen deaktiviert werden, um Fehlmatches zu vermeiden.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 md:grid-cols-2">
            {(Object.keys(grouped) as VoiceIntentCategory[]).map((c) => {
              const off = disabledCats.has(c);
              return (
                <li key={c} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-medium">{CATEGORY_LABELS[c]}</p>
                    <p className="text-sm text-muted-foreground">{grouped[c].length} Befehle</p>
                  </div>
                  <button
                    onClick={() => toggleCat(c)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      off ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                    aria-label={`${CATEGORY_LABELS[c]} ${off ? "aktivieren" : "deaktivieren"}`}
                  >
                    {off ? <X className="h-5 w-5" aria-hidden /> : <Check className="h-5 w-5" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Letzte Befehle</CardTitle>
          <CardDescription>Debug-Log der letzten 50 erkannten Befehle (nur lokal).</CardDescription>
        </CardHeader>
        <CardContent>
          {log.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Noch keine Befehle erkannt.</p>
          ) : (
            <ul className="divide-y divide-border">
              {log.map((e, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm">&ldquo;{e.utterance}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.at).toLocaleTimeString("de-AT")} · {e.intentId ?? "—"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      e.matched ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                    }`}
                  >
                    {e.matched ? "Erkannt" : "Nicht erkannt"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <VoiceCommandTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}
