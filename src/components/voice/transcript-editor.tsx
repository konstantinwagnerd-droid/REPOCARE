"use client";

/**
 * TranscriptEditor — Zwischenschritt zwischen Whisper-Transkript und Claude-Strukturierung.
 *
 * Features:
 *  - Zeigt Fachvokabular-Korrekturen als Highlight-Chips (grün = auto, gelb = zur Prüfung)
 *  - Tooltip beim Klick auf Chip: "Ursprünglich: X → Korrigiert: Y (Kategorie, Konfidenz)"
 *  - Textarea-Editor für freies Nachkorrigieren + Undo/Redo (Strg+Z / Strg+Shift+Z)
 *  - Lernt neue Korrekturen pro Tenant (localStorage, nach 3× auto-angewendet)
 *  - Buttons: Abbrechen · Nochmal aufnehmen · KI-Strukturieren
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mic, Sparkles, Undo2, Redo2, X } from "lucide-react";
import {
  applyCorrections,
  type Correction,
} from "@/lib/voice/correct-transcript";
import { loadLearnedRules, recordCorrection } from "@/lib/voice/vocab-learner";

interface TranscriptEditorProps {
  rawTranscript: string;
  /** Tenant-ID für Auto-Learn (falls leer, wird kein Mandanten-Vokabular gespeichert). */
  tenantId?: string;
  /** Dauer der Aufnahme in Sekunden (Anzeige). */
  durationSeconds?: number;
  onSubmit: (finalText: string) => void;
  onReRecord?: () => void;
  onCancel?: () => void;
}

const UNDO_LIMIT = 50;

export function TranscriptEditor({
  rawTranscript,
  tenantId,
  durationSeconds,
  onSubmit,
  onReRecord,
  onCancel,
}: TranscriptEditorProps) {
  // Korrekturen einmalig berechnen (auf rawTranscript + tenant-learned rules)
  const initial = useMemo(() => {
    const extra = tenantId ? loadLearnedRules(tenantId) : [];
    return applyCorrections(rawTranscript, extra);
  }, [rawTranscript, tenantId]);

  const [text, setText] = useState(initial.corrected);
  const [activeChip, setActiveChip] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([initial.corrected]);
  const [historyPos, setHistoryPos] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>(initial.corrections);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastAppliedText = useRef<string>(initial.corrected);

  // Wenn sich rawTranscript extern ändert (neue Aufnahme), reset
  useEffect(() => {
    setText(initial.corrected);
    setCorrections(initial.corrections);
    setHistory([initial.corrected]);
    setHistoryPos(0);
    lastAppliedText.current = initial.corrected;
  }, [initial.corrected, initial.corrections]);

  const pushHistory = useCallback(
    (value: string) => {
      setHistory((prev) => {
        const truncated = prev.slice(0, historyPos + 1);
        const next = [...truncated, value];
        return next.length > UNDO_LIMIT ? next.slice(next.length - UNDO_LIMIT) : next;
      });
      setHistoryPos((p) => Math.min(p + 1, UNDO_LIMIT - 1));
    },
    [historyPos],
  );

  const handleChange = (value: string) => {
    setText(value);
    // Korrekturen sind "stale" sobald User editiert — Chip-Highlighting nicht mehr garantiert
    if (value !== lastAppliedText.current) {
      setCorrections([]);
    }
    pushHistory(value);
  };

  const undo = useCallback(() => {
    if (historyPos > 0) {
      const newPos = historyPos - 1;
      setHistoryPos(newPos);
      setText(history[newPos]);
    }
  }, [history, historyPos]);

  const redo = useCallback(() => {
    if (historyPos < history.length - 1) {
      const newPos = historyPos + 1;
      setHistoryPos(newPos);
      setText(history[newPos]);
    }
  }, [history, historyPos]);

  // Strg+Z / Strg+Shift+Z (nicht innerhalb der Textarea — die hat nativen Undo)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "TEXTAREA") return; // native undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const revertChip = (idx: number) => {
    const c = corrections[idx];
    if (!c) return;
    const before = text.slice(0, c.offset);
    const after = text.slice(c.offset + c.length);
    const restored = before + c.originalText + after;
    setText(restored);
    pushHistory(restored);
    // Offset anderer Chips verschieben
    const delta = c.originalText.length - c.length;
    setCorrections((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((other) =>
          other.offset > c.offset ? { ...other, offset: other.offset + delta } : other,
        ),
    );
    setActiveChip(null);
  };

  const acceptChip = (idx: number) => {
    // Auto-Accepted sind sie eh — hier als "Bestätigt" markieren wir einfach den Chip weg
    setCorrections((prev) => prev.filter((_, i) => i !== idx));
    setActiveChip(null);
    // Für Lern-Logik: bestätigte Korrektur zählt als "verwendet"
    if (tenantId) {
      const c = corrections[idx];
      if (c) recordCorrection(tenantId, c.originalText, c.correctedText);
    }
  };

  const customReplace = (idx: number, userReplacement: string) => {
    const c = corrections[idx];
    if (!c || !userReplacement) return;
    const before = text.slice(0, c.offset);
    const after = text.slice(c.offset + c.length);
    const next = before + userReplacement + after;
    setText(next);
    pushHistory(next);
    // Lerne diese Korrektur für zukünftige Aufnahmen
    if (tenantId) recordCorrection(tenantId, c.originalText, userReplacement);
    // Offsets updaten
    const delta = userReplacement.length - c.length;
    setCorrections((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((other) =>
          other.offset > c.offset ? { ...other, offset: other.offset + delta } : other,
        ),
    );
    setActiveChip(null);
  };

  // Rendering des Texts mit Chips — splittet text in Fragmente um corrections herum
  const segments = useMemo(() => {
    if (corrections.length === 0) return null;
    const sorted = [...corrections].sort((a, b) => a.offset - b.offset);
    const parts: Array<
      | { type: "text"; value: string }
      | { type: "chip"; idx: number; correction: Correction }
    > = [];
    let cursor = 0;
    sorted.forEach((c, sortedIdx) => {
      if (c.offset > cursor) parts.push({ type: "text", value: text.slice(cursor, c.offset) });
      parts.push({
        type: "chip",
        // Finde originalen Index (für Aktionen)
        idx: corrections.indexOf(c),
        correction: c,
      });
      cursor = c.offset + c.length;
      // sortedIdx unused but kept for clarity
      void sortedIdx;
    });
    if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });
    return parts;
  }, [corrections, text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const duration =
    typeof durationSeconds === "number"
      ? `${String(Math.floor(durationSeconds / 60)).padStart(2, "0")}:${String(durationSeconds % 60).padStart(2, "0")}`
      : null;

  return (
    <div className="space-y-4">
      {/* Header mit Korrektur-Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          {corrections.length > 0 ? (
            <span>
              <strong>{corrections.length}</strong>{" "}
              {corrections.length === 1 ? "Korrektur" : "Korrekturen"} automatisch angewendet
              — zum Anpassen auf ein markiertes Wort klicken.
            </span>
          ) : (
            <span className="text-muted-foreground">Keine Fachvokabular-Korrekturen nötig.</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={historyPos === 0}
            aria-label="Rückgängig"
            title="Rückgängig (Strg+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={historyPos >= history.length - 1}
            aria-label="Wiederherstellen"
            title="Wiederherstellen (Strg+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chip-View (solange keine manuelle Bearbeitung erfolgt) */}
      {segments && segments.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {segments.map((p, i) => {
            if (p.type === "text") return <span key={i}>{p.value}</span>;
            const c = p.correction;
            const safe = c.confidence >= 0.9;
            const colour = safe
              ? "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
              : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200";
            return (
              <span key={i} className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setActiveChip(activeChip === p.idx ? null : p.idx)}
                  className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-semibold transition-colors ${colour}`}
                  title={`${c.originalText} → ${c.correctedText}`}
                >
                  {c.correctedText}
                </button>
                {activeChip === p.idx && (
                  <ChipPopover
                    correction={c}
                    onAccept={() => acceptChip(p.idx)}
                    onRevert={() => revertChip(p.idx)}
                    onCustom={(val) => customReplace(p.idx, val)}
                    onClose={() => setActiveChip(null)}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Freier Editor */}
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Transkript bearbeiten
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-40 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm leading-relaxed"
          spellCheck
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {wordCount} {wordCount === 1 ? "Wort" : "Wörter"} · {charCount} Zeichen
          </span>
          {duration && <span>Aufnahmedauer: {duration}</span>}
        </div>
      </div>

      {/* Kategorien-Summary */}
      {corrections.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Array.from(new Set(corrections.map((c) => c.category))).map((cat) => {
            const count = corrections.filter((c) => c.category === cat).length;
            return (
              <Badge key={cat} variant="outline" className="text-xs">
                {cat}: {count}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Aktions-Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="accent" size="lg" onClick={() => onSubmit(text)} disabled={!text.trim()}>
          <Sparkles className="mr-1 h-4 w-4" /> KI-Strukturieren →
        </Button>
        {onReRecord && (
          <Button variant="outline" size="lg" onClick={onReRecord}>
            <Mic className="mr-1 h-4 w-4" /> Nochmal aufnehmen
          </Button>
        )}
        {onCancel && (
          <Button variant="ghost" size="lg" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Chip-Popover (Tooltip mit Aktionen)
// ─────────────────────────────────────────────────────────────────────────
interface ChipPopoverProps {
  correction: Correction;
  onAccept: () => void;
  onRevert: () => void;
  onCustom: (value: string) => void;
  onClose: () => void;
}

function ChipPopover({ correction, onAccept, onRevert, onCustom, onClose }: ChipPopoverProps) {
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState(correction.correctedText);
  return (
    <div
      className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-border bg-popover p-3 text-xs shadow-lg"
      role="dialog"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-muted-foreground">Ursprünglich:</div>
          <div className="font-mono">&quot;{correction.originalText}&quot;</div>
          <div className="mt-1 text-muted-foreground">Korrigiert:</div>
          <div className="font-mono font-semibold">&quot;{correction.correctedText}&quot;</div>
          <div className="mt-1 text-muted-foreground">
            {correction.category} · {Math.round(correction.confidence * 100)}% sicher
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Schließen"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1 font-mono"
            autoFocus
          />
          <div className="flex gap-1">
            <Button variant="accent" size="sm" onClick={() => onCustom(custom)}>
              <Check className="mr-1 h-3 w-3" /> Übernehmen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Zurück
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          <Button variant="accent" size="sm" onClick={onAccept}>
            Übernehmen
          </Button>
          <Button variant="outline" size="sm" onClick={onRevert}>
            Zurücksetzen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Eigene Version…
          </Button>
        </div>
      )}
    </div>
  );
}
