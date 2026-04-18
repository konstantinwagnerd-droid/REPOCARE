# Voice-Transkript-Editor mit Pflege-Fachvokabular-Autokorrektur

Zwischenschritt zwischen Whisper-Transkription und Claude-Strukturierung.
Ziel: häufige Whisper-Fehler bei Pflege-Fachtermini automatisch korrigieren,
bevor die Doku in die SIS/Pflegeplanung wandert.

## Pipeline

```
Mikrofon → Whisper (transcribe) → TranscriptEditor → Claude (structure) → SIS
                                        ↑
                                        Dictionary-Autokorrektur
                                        + Tenant-Auto-Learn
```

Bis zum Editor-Schritt konnte ein fehlerhaft transkribiertes „Deka Bitus"
(Dekubitus), „Braten-Skala" (Braden-Skala) oder „Panto-Prasol" (Pantoprazol)
unbemerkt in der Dokumentation landen. Der Editor stoppt den Flow für eine
kurze visuelle Bestätigung und bietet die Korrekturen als anklickbare Chips
im Text.

## Komponenten

| Pfad | Zweck |
|---|---|
| `src/lib/voice/pflege-vocabulary.ts` | Statisches Dictionary (80+ Einträge, 7 Kategorien) |
| `src/lib/voice/correct-transcript.ts` | Matching-/Ersetzungs-Engine mit Offsets |
| `src/lib/voice/vocab-learner.ts` | Tenant-Auto-Learn via localStorage |
| `src/components/voice/transcript-editor.tsx` | UI mit Chips, Undo/Redo, Tooltip-Popover |
| `src/app/api/voice/correct/route.ts` | Server-side Korrektur (für Testbarkeit/Logging) |
| `src/app/api/voice/vocabulary/route.ts` | Optionaler Server-Sync für Mandanten-Vokabular |
| `src/db/schema.ts` (`tenantVocabulary`) | DB-Persistenz (optional, DDL in `api/setup/route.ts`) |

## Dictionary erweitern

Jeder Eintrag:

```ts
{
  pattern: /\bpanto[- ]?prasol\b/gi, // Regex — muss Wortgrenzen \b enthalten
  correct: "Pantoprazol",            // kanonische Form
  category: "medikament",            // medikament | diagnose | assessment | anatomie | fem | gesetz | standard
  confidence: 0.95,                  // 0.70–1.00
}
```

Richtlinien:

- **Wortgrenzen** (`\b`) sind Pflicht — sonst matcht `panto` auch innerhalb längerer Wörter.
- **Case-Insensitive** (`gi`-Flag) — Pflegekräfte diktieren mal groß, mal klein.
- **Leerzeichen/Bindestriche** optional (`[- ]?`) — Whisper zerteilt Fachworte häufig.
- **Confidence**:
  - `≥ 0.90` → grüner Chip, auto-angewendet ohne Warnung
  - `0.70–0.89` → gelber Chip, bittet um manuelle Bestätigung

## Auto-Learn (Mandanten-Vokabular)

Wenn der User im Editor ein Wort manuell korrigiert (oder eine Chip-Korrektur
bestätigt), wird das Paar `(original, korrigiert)` in `localStorage` unter
dem Key `careai.voice.learned.<tenantId>` gespeichert.

Nach **3 gleichen manuellen Korrekturen** wird die Regel automatisch in
zukünftigen Aufnahmen angewendet (via `loadLearnedRules(tenantId)` → an
`applyCorrections(..., extraRules)` übergeben).

- Daten bleiben **client-seitig** im Browser. Optional Server-Sync über
  `/api/voice/vocabulary` → Tabelle `tenant_vocabulary`.
- Bei "Vokabular zurücksetzen": `clearLearned(tenantId)`.

## Privacy

- Das Vokabular wird **nicht an OpenAI/Whisper** gesendet. Es wirkt rein
  **post-processing** nach der Transkription.
- Mandanten-gelernte Einträge sind mandanten-lokal gespeichert und werden
  nur innerhalb eines Tenants geladen.
- Keine personenbezogenen Daten im Dictionary — nur Fachtermini.

## Quellen

- **Medikamente**: Gelbe Liste / Rote Liste (Wirkstoffe + gängige Handelsnamen DE/AT)
- **Diagnosen**: ICD-10-GM (BfArM), gängige geriatrische Diagnosen
- **Assessments**: DNQP-Expertenstandards, Standard-Skalen (Braden, Norton, MMSE, MoCA, PAINAD, …)
- **Taxonomien**: NANDA-I 2021–2023, NIC/NOC (University of Iowa), ICD/ICF (WHO)
- **FEM/Gesetze**: HeimAufG (AT), BtMG, SGB V/XI (DE), Werdenfelser Weg

## Tests

```
npx vitest run tests/lib/voice/
```

Der Test deckt die im Spec genannten Beispiele ab (Dekubitus, Braden-Skala,
Werdenfelser Weg, Offset-Konsistenz, Case-Preservation, Multi-Match, negative
Fälle ohne False-Positives).

## Bekannte Edge-Cases / Follow-ups

- **Phonetische Ambiguität**: „Morphium" vs. „Morphin" → nicht unterschieden.
- **Dosierungs-Ziffern** („drei mal täglich" vs. „3×"): out of scope, evtl. Claude's Job.
- **Kontext-sensitive Mehrdeutigkeiten**: z.B. "Valium" könnte auch Eigenname sein — aktuell kein Kontext-Modell.
- **DB-Sync**: `/api/voice/vocabulary` ist heute noch Acknowledge-only; UPSERT in `tenant_vocabulary` kann nachgezogen werden.
