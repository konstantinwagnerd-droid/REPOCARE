# Internationalisierungs-Expansion: FR / IT / ES

## Scope

Ergänzung zum bestehenden `/` (DE) und `/en` um drei EU-Sprachen:

| Locale | URL-Präfix | Zielmarkt |
|--------|-----------|-----------|
| `fr-FR` | `/fr` | Frankreich (EHPAD, USLD) |
| `it-IT` | `/it` | Italien (RSA, Case di Riposo) |
| `es-ES` | `/es` | Spanien (Residencias) |

## Seiten pro Locale (je 7)

| Logische Seite | DE | EN | FR | IT | ES |
|---|---|---|---|---|---|
| Home | `/` | `/en` | `/fr` | `/it` | `/es` |
| Trust | `/trust` | `/en/trust` | `/fr/confiance` | `/it/fiducia` | `/es/confianza` |
| ROI | `/roi-rechner` | `/en/roi-calculator` | `/fr/calculateur-roi` | `/it/calcolatore-roi` | `/es/calculadora-roi` |
| Case Studies | `/case-studies` | `/en/case-studies` | `/fr/etudes-de-cas` | `/it/casi-studio` | `/es/casos-de-estudio` |
| Blog | `/blog` | `/en/blog` | `/fr/blog` | `/it/blog` | `/es/blog` |
| About | `/ueber-uns` | `/en/about` | `/fr/a-propos` | `/it/chi-siamo` | `/es/sobre-nosotros` |
| Contact | `/kontakt` | `/en/contact` | `/fr/contact` | `/it/contatti` | `/es/contacto` |

## Blog-Content

Pro Locale 2 Übersetzungen aus dem EN-Pool:

- `eu-ai-act-care-software` → `eu-ai-act-logiciels-de-soins`, `eu-ai-act-software-assistenziale`, `eu-ai-act-software-asistencial`
- `hl7-fhir-for-care-facilities` → `hl7-fhir-pour-etablissements-de-soins`, `hl7-fhir-per-strutture-assistenziali`, `hl7-fhir-para-centros-asistenciales`

Content-Verzeichnisse: `content/blog-fr/`, `content/blog-it/`, `content/blog-es/`.

## hreflang-Strategie

Jede Seite exportiert `metadata.alternates.languages` mit allen fünf Locales:

```ts
alternates: {
  canonical: "/fr/confiance",
  languages: {
    "de-DE": "/trust",
    "en-US": "/en/trust",
    "fr-FR": "/fr/confiance",
    "it-IT": "/it/fiducia",
    "es-ES": "/es/confianza",
    "x-default": "/",
  },
}
```

Die Sitemap (`sitemap.ts`) muss in einer nachgelagerten Task alle neuen URLs und hreflang-Alternates aufnehmen (aktuell nicht angepasst — Wave 12b Scope).

## Language-Switcher

`src/components/marketing/language-switcher.tsx` wurde von einem Binary-Toggle (DE ⇆ EN) zu einem Dropdown mit allen fünf Locales umgebaut. Der Switcher mappt Pfade über eine zentrale `PAGE_MAP`.

## Übersetzungs-Workflow

1. **Erstausgabe**: maschinelle Übersetzung (Claude Opus oder DeepL Pro) aus DE- oder EN-Quelle.
2. **Review**: Native-Speaker-Review durch lokale Partner (geplant: Partner-Agentur in Paris/Mailand/Madrid).
3. **Terminologie-Konsistenz**: Glossar-Datei (TBD: `content/glossary-{locale}.json`) für Fachbegriffe wie SIS, MDK, PDL.
4. **QA**: Screenshot-Diffs (`/fr` vs. `/`) via Playwright.

## Content-Längen-Vergleich (Quickscan)

- **DE-Texte** sind im Schnitt 10-15% länger als EN (Komposita, längere Wörter).
- **IT/ES** ca. gleich lang wie EN.
- **FR** ca. 5% länger als EN (Partikel, Präpositionen).

→ Layout-Risiken: DE-Buttons-Labels können brechen, wenn FR/IT/ES-Übersetzungen substantivlastig sind. Aktuelle Seiten verwenden `flex-wrap` und sind getestet bis 24-Zeichen-Labels.

## TODO (out of scope Wave 12b)

- `sitemap.ts` um FR/IT/ES erweitern
- `robots.ts` (falls Locale-spezifische Regeln erforderlich)
- OG-Images pro Locale
- Währungs-Formatierung auf den ROI-Seiten (aktuell hart EUR — korrekt für alle drei Märkte)
- Blog-Posts weiter übersetzen (restliche EN → 3 Locales)
