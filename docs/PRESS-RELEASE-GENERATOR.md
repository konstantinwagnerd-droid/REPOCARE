# Press-Release-Generator

Internes Tool, mit dem CareAI innerhalb von Minuten eine versandfertige
Presseaussendung erzeugt — ohne dass jede Mitarbeiter:in PR-Regeln kennen muss.

- **Route (UI):** `/admin/press-release`
- **API:** `POST /api/press-release/generate`
- **Code:** `src/lib/press-release/` (types, templates, rules, generator)

## Templates (5)

| ID | Titel | Wann einsetzen | Standard-Headline |
|---|---|---|---|
| `milestone` | Meilenstein-PM | Zertifizierungen, Nutzer-Schwellen, Produkt-Meilensteine | „CareAI erreicht {{milestone}}" |
| `funding` | Funding-PM | Seed / Series A, FFG / aws / EXIST / ZIM | „CareAI sichert sich {{amount}} {{fundingType}}" |
| `partner` | Partner-PM | Kooperationen, Integrationen, Pilot-Kliniken | „CareAI und {{partnerName}} starten Partnerschaft" |
| `product` | Produkt-Launch-PM | Major-Release, neue Produktlinie | „CareAI launcht {{productName}}" |
| `event` | Event-PM | Messen, Kongresse, Awards | „CareAI auf {{eventName}}" |

Jedes Template definiert ein **Feld-Schema** (Key, Label, Typ, Pflicht).
Die UI generiert das Formular daraus dynamisch.

## Qualitäts-Score (0–100)

`src/lib/press-release/rules.ts` prüft:

1. Länge 250–500 Wörter
2. Mindestens ein Zitat
3. Datum im ISO-Format (YYYY-MM-DD)
4. Pressekontakt enthält E-Mail
5. „Über CareAI"-Abschnitt vorhanden
6. Headline 10–90 Zeichen
7. Keine offenen Platzhalter (`{{...}}`)

Score = Anteil bestandener Checks.

## API

```http
POST /api/press-release/generate
Content-Type: application/json

{
  "templateId": "milestone",
  "values": {
    "milestone": "1.000 Pflegekräfte im Echtbetrieb",
    "context": "…",
    "numbers": "- 1.000 aktive Pflegekräfte\n- 28 Häuser",
    "dateline": "2026-04-17",
    "location": "Wien",
    "quote": "…",
    "quoteAuthor": "Konstantin Wagner, Gründer & CEO"
  }
}
```

**Antwort:**

```json
{
  "markdown": "# CareAI erreicht …\n\n**Wien, 2026-04-17** — …",
  "quality": {
    "wordCount": 312,
    "score": 86,
    "checks": [{ "id": "length", "label": "Länge 250–500 Wörter", "pass": true }]
  }
}
```

Rollen: Nur `admin` und `pdl` dürfen die API aufrufen.

## Beispiel-Workflow

1. `/admin/press-release` öffnen
2. Template „Meilenstein-PM" wählen
3. Felder füllen — Live-Preview zeigt das Markdown rechts
4. Qualitäts-Score > 80 anstreben
5. **Kopieren** (Zwischenablage) oder **.md** herunterladen
6. Für Word-Export: `pandoc pm.md -o pm.docx`

## Erweiterungsideen

- **Mehrsprachigkeit (EN):** zweite Template-Variante mit gleichem Schema
- **Freigabe-Workflow:** Status-Feld (Draft / Review / Approved / Sent)
- **Versand:** Gmail/Outlook-Integration mit Verteiler-Liste
- **Archiv:** Verschickte PMs automatisch nach `content/presse/` speichern
