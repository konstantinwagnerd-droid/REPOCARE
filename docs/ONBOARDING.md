# Onboarding-Flow

Tenant-Onboarding-Wizard fuer neue CareAI-Einrichtungen.

## Route

`/onboarding` — via Route-Group `(onboarding)`, eigener Layout ohne Marketing-Nav.

## Schritte

1. **Willkommen** — Einrichtungs-Daten (Name, Adresse, Traeger-Typ, Anzahl Bewohner)
2. **Branding** — Logo-Upload + Primaerfarbe (Presets + Color-Picker)
3. **Team** — E-Mail-Einladungen mit Rollen (Admin, PDL, DGKP, Pflegehilfe)
4. **Bewohner** — CSV-Import (optional, mit Template-Download)
5. **Integrationen** — FHIR, GDT, KIM, DTA, DATEV, BMD als Checkboxen
6. **Los geht's** — Check-Animation + Redirect zum Dashboard

## UI-Elemente

- **Progress-Bar** oben — visuell und als `<ol>` semantisch
- **Back / Next** — Back disabled auf Schritt 1
- **"Spaeter abschliessen"** im Header-Link oben rechts
- **Framer-Motion** — AnimatePresence fuer Slide zwischen Schritten

## Implementation

- `src/app/(onboarding)/layout.tsx` — Layout mit Logo + Skip-Link
- `src/app/(onboarding)/onboarding/page.tsx` — Server Component Wrapper
- `src/app/(onboarding)/onboarding/wizard.tsx` — Client Component mit State

## State

Lokaler `useState` — persistiert noch NICHT in DB. Bei "Los geht's" sollte POST an `/api/onboarding/complete` erfolgen (Enterprise-Agent).

## Theme-Customizer

Nach Onboarding kann Tenant das Theme unter `/admin/settings/theme` feinjustieren. DB-Schema:
`tenants.theme_json JSONB` — Patch: `src/db/patches/002-theme.sql`.

## A11y

- Form-Labels vorhanden
- Progress-Nav ist semantisches `<ol>` mit `aria-label`
- Animation respektiert `prefers-reduced-motion` (Framer-Motion-Default)
