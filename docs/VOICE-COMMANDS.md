# CareAI Voice Commands

Sprachbefehle fuer die CareAI-Pflegesoftware. Vollstaendig client-seitig (Web-Speech-API), keine Audio-Daten an Server.

## Trigger

- **Alt+V** druecken — Mikrofon-Overlay oeffnet sich, Modus laeuft bis Spracherkennung fertig.
- **Leertaste 500 ms halten** — alternativer Trigger, nur wenn Fokus nicht in einem Eingabefeld ist.
- **ESC** oder **X-Button** — bricht ab.

Feedback: kurzer Beep beim Start/Ende (WebAudio-Oscillator), TTS-Bestaetigung via Web-Speech-Synthesis.

## Architektur

```
components/voice-commands/
  VoiceCommandProvider.tsx   Context + Hotkey-Binding + SpeechRecognition
  VoiceCommandOverlay.tsx    Fullscreen-Overlay mit Live-Transkript
  VoiceCommandTutorial.tsx   Modal mit allen Commands, nach Kategorien
lib/voice-commands/
  types.ts        Types (VoiceIntent, MatchResult, …)
  intents.ts      30+ Intent-Definitionen (Regex-basiert)
  matcher.ts      Normalisierung + first-match wins + Dice-similarity fallback
  feedback.ts     TTS + Beep
  registry.ts     listIntents, byCategory
  bus.ts          Event-Bus fuer Action-Payloads (z.B. voice:new-report)
```

## Commands — Kategorien

| Kategorie | Beispiele |
|---|---|
| Navigation | &ldquo;Dashboard&rdquo;, &ldquo;Bewohner&rdquo;, &ldquo;Einstellungen&rdquo;, &ldquo;Uebergabe&rdquo;, &ldquo;Dienstplan&rdquo; |
| Bewohner-Suche | &ldquo;Frau Mueller oeffnen&rdquo;, &ldquo;Herr Gruber anzeigen&rdquo; |
| Pflegebericht | &ldquo;Neuer Bericht fuer Frau Mueller&rdquo;, &ldquo;Bericht abschliessen&rdquo;, &ldquo;Signieren&rdquo; |
| Vitalwerte | &ldquo;Puls 82&rdquo;, &ldquo;Blutdruck 130 ueber 80&rdquo;, &ldquo;Gewicht 67,5 Kilo&rdquo;, &ldquo;Temperatur 37,2&rdquo;, &ldquo;Sauerstoff 96&rdquo; |
| Medikation | &ldquo;Paracetamol gegeben&rdquo;, &ldquo;Ramipril verweigert&rdquo; |
| Massnahmen | &ldquo;Mobilisation erledigt&rdquo;, &ldquo;Naechste Massnahme&rdquo; |
| Notfall | &ldquo;Notfall&rdquo;, &ldquo;Sturz bei Frau Mueller&rdquo;, &ldquo;Arzt rufen&rdquo; |
| Shortcuts | &ldquo;Schichtbericht&rdquo;, &ldquo;Suche&rdquo;, &ldquo;Speichern&rdquo;, &ldquo;Abbrechen&rdquo;, &ldquo;Drucken&rdquo;, &ldquo;Export&rdquo;, &ldquo;Was kann ich sagen&rdquo; |

Vollstaendige Liste im Tutorial unter `/app/voice-commands`.

## Integration neuer Commands

1. In `lib/voice-commands/intents.ts` neues `VoiceIntent`-Objekt hinzufuegen.
2. Eine oder mehrere Regex-`patterns` definieren.
3. `action(ctx)` implementieren — Rueckgabe `{ matched: true, speak, navigate?, event? }`.

```ts
{
  id: "custom.foo",
  category: "shortcut",
  description: "Foo machen",
  examples: ["foo"],
  patterns: [/^foo$/i],
  action: () => ({ matched: true, speak: "Foo", event: { type: "foo" } }),
}
```

## Consumer-Seite — Events empfangen

```tsx
import { onVoiceEvent } from "@/lib/voice-commands/bus";

useEffect(() => onVoiceEvent((e) => {
  if (e.type === "voice:vital") {
    // öffne Vitals-Modal mit e.payload
  }
}), []);
```

## Privacy

- **Keine Server-Kommunikation** — SpeechRecognition verwendet Browser-API, bei Chrome ggf. Google Cloud (Browser-intern).
- **Log lokal** — letzte 50 Utterances nur im React-State, kein IndexedDB, keine API-Calls.
- **Per-Kategorie deaktivierbar** in Einstellungen (localStorage: `careai.voice.disabledCategories`).

## Browser-Unterstuetzung

| Browser | Status |
|---|---|
| Chrome Desktop | voll |
| Edge | voll |
| Safari 14.5+ | voll |
| Firefox | nur TTS, kein Recognition |
| Chrome Android | voll |
| Safari iOS | voll |

Bei Non-Support: Warnhinweis auf Settings-Seite, Feature-Flag bleibt aktivierbar fuer Tutorials.

## Roadmap

- Pro-Tenant konfigurierbare Commands (Aliase, z.B. &ldquo;Frau Mueller&rdquo; -> bestimmte Bewohner-ID)
- Wake-Word-Support (&ldquo;Hey CareAI&rdquo;) via picovoice oder serverseitig
- LLM-basiertes Intent-Fallback bei nicht-erkannten Utterances (opt-in)
- Mehrsprachigkeit (DE/EN/FR)
