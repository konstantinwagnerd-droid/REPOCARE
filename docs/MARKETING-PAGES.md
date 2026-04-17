# Marketing-Seiten (Uebersicht)

Alle in `src/app/(marketing)/`.

| Route | Datei | Zweck |
|-------|-------|-------|
| `/` | `page.tsx` | Homepage (Hero, Features, Pricing, FAQ + neue Sections) |
| `/trust` | `trust/page.tsx` | Trust Center — Zertifizierungen, Subprocessors, DSB |
| `/security` | `security/page.tsx` | Sicherheits-Uebersicht — Defense-in-Depth |
| `/integrations` | `integrations/page.tsx` | FHIR/GDT/KIM/ELGA/DTA + Branchen-Integrationen |
| `/roi-rechner` | `roi-rechner/page.tsx` | Interaktiver ROI-Rechner |
| `/case-studies` | `case-studies/page.tsx` | 3 Fallstudien (Wien, Graz, Muenchen) |
| `/case-studies/[slug]` | `case-studies/[slug]/page.tsx` | Case-Detail mit Vorher/Nachher |
| `/kontakt` | `kontakt/page.tsx` | Kontaktformular + Karte |
| `/demo-anfrage` | `demo-anfrage/page.tsx` | Demo-Termin mit Slot-Picker |
| `/changelog` | `changelog/page.tsx` | Release-History Timeline |
| `/status` | `status/page.tsx` | System-Status + 90-Tage-Grid + Incidents |
| `/ueber-uns` | `ueber-uns/page.tsx` | Team, Mission, Werte, Zeitstrahl |
| `/karriere` | `karriere/page.tsx` | 3 offene Positionen, Werte, pro-soziale Benefits |
| `/help` | `src/app/(help)/help/page.tsx` | Hilfe-Center mit Suche |
| `/help/[slug]` | `src/app/(help)/help/[slug]/page.tsx` | Einzelner Hilfe-Artikel mit TOC |

## Sekundaer-Navigation

`src/components/marketing/sections/secondary-nav.tsx` — wird auf allen Unterseiten unter dem Hero eingesetzt.

## Shared Sections

- `PageHero` — generic hero, optional illustration + actions
- `LogoWall` — Stadt-Wappen / Vertrauens-Claim
- `ComparisonTable` — CareAI vs. Medifox vs. Vivendi
- `TrustRow` — Compliance-Badges (DSGVO, EU AI Act, ISO 27001 i.V., Hetzner, Oekostrom)
- `StickyCta` — FAB unten rechts nach 25% Scroll

## Daten

Case Studies: `src/app/(marketing)/case-studies/data.ts` (statisch, drei Einrichtungen).

Help-Artikel: `src/app/(help)/help/articles.ts` (15 Artikel, 300–500 Worte).

## Internationalisierung

Alle Texte sind deutsch (UTF-8, ohne Umlaute-Probleme in ASCII-Faellen). `messages/` wird nicht angefasst — vom Enterprise-Agent betreut.
