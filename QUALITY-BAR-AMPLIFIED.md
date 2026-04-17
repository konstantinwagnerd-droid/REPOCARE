# Quality Bar — VERSCHÄRFT

Diese Datei wurde nachträglich vom Auftraggeber hinzugefügt. Build-Agent und Polish-Agent: **alle Punkte hier sind verbindlich** und überschreiben weniger strenge Vorgaben.

## Design — Premium Niveau (Linear, Stripe, Vercel als Benchmark)

### Typografie (KEINE Kompromisse)
- **Headlines:** Fraunces variable (Serif, ital, weight 200-900) via next/font/google
- **Body:** Geist Sans variable
- **Mono (für IDs, Logs):** Geist Mono
- Klare Skala: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 72 px
- Line-height für Body 1.6, für Headlines 1.1
- Tracking (letter-spacing) für große Headlines: -0.02em

### Farben (über Hauptpalette hinaus)
- Primary: Petrol/Teal `#0F766E` mit 50-950 Tailwind-Skala
- Accent (CTA): Warm Orange `#F97316` mit 50-950
- Success: `#10B981`, Warning: `#F59E0B`, Danger: `#EF4444`, Info: `#3B82F6`
- Neutral: warmer Stone-Tone (Tailwind `stone`) statt kalter `gray`
- **Dark Mode komplett implementieren** (next-themes) — Schichtdienst Spätschicht
- Semantische Tokens via CSS-Variablen (HSL)

### Komponenten-Polish
- Buttons: 3 Sizes (sm/md/lg), 4 Variants (primary/secondary/ghost/destructive), hover/active/focus/disabled States
- Cards: `border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm hover:shadow-md transition`
- Inputs: floating labels ODER klare top-labels, error states inline mit Icon, hint text klein
- Badges für Status (Pflegegrad, Risiko-Level, Schicht)
- Alle interaktiven Elemente: focus-visible Ring 2px in Primary
- Skeleton-Loader für ALLE Listen / Detail-Views
- Empty-States mit Illustration (Lucide-Icon groß + Text + CTA)
- Error-States freundlich (kein "Error 500", sondern "Da hat etwas nicht geklappt — versuch es nochmal")
- Toast-System (sonner) für alle Aktionen

## Animations — Framer Motion

### Pflicht-Animations
- **Page Transitions:** Fade + Slide (200ms ease-out) zwischen Routen
- **Stagger** für Listen (Bewohner-Cards, Maßnahmen): 50ms delay pro Item
- **Layout-Animationen** (`layoutId`) für Detail-Übergänge (Bewohner-Karte → Bewohner-Detail)
- **Mikro-Interaktionen:**
  - Button Hover: subtle scale 1.02 + shadow lift
  - Card Hover: border-color shift + 1px lift
  - Toggle/Switch: smooth spring
  - Number Counter (Dashboard-KPIs): count-up Animation beim Mount
- **Spracheingabe-Demo:** Mikrofon mit pulsierender Audio-Welle (3 konzentrische Ringe, scale + opacity loop)
- **Loading:** Brand-konformer Spinner (Petrol-Teal Ring) statt generic
- **Success-Feedback:** Checkmark-SVG mit draw-Animation (stroke-dasharray)

### Performance
- `will-change` nur bei aktiven Animationen
- `prefers-reduced-motion` respektieren — alle Animationen reduzierbar/abschaltbar
- Keine Animation > 400ms (Core Web Vitals)

## UX — "leicht zu bedienen"

### Pflichten
- **Command Palette (Cmd+K)** mit cmdk — globale Suche + Aktionen
- **Keyboard Shortcuts** für Power-User (PDL nutzt täglich):
  - `g d` → Dashboard
  - `g b` → Bewohner-Liste
  - `n` → Neuer Bericht
  - `/` → Suche fokussieren
  - `?` → Shortcut-Übersicht
- **Breadcrumbs** auf jeder tieferen Seite
- **Globale Suche** (Header) mit Live-Vorschlägen (debounced 200ms)
- **Sticky Headers** für lange Listen
- **Infinite Scroll** ODER Pagination — konsistent
- **Filter-Chips** (entfernbar) statt versteckter Dropdowns
- **Inline-Edit** wo sinnvoll (Bewohner-Notizen)
- **Optimistic Updates** mit Rollback bei Fehler
- **Undo Toast** für destruktive Aktionen (10s Fenster)
- **Auto-Save** für lange Formulare (Pflegebericht)
- **Mobile-Bottom-Nav** für App-Bereich (Tablets im Querformat behalten Sidebar)

### Pflege-spezifische UX
- **Schichtwechsel-Banner** oben falls in den letzten 30 Min Schichtwechsel
- **Heute-Filter** als Default überall
- **Quick-Actions** auf jeder Bewohner-Card: "Vital eintragen", "Bericht", "Maßnahme abhaken"
- **Voice-First Toggle** im Header (großer Mikrofon-Button immer sichtbar)
- **Notfall-Button** (rot, oben rechts) — bei Klick: Sturz/Verletzung melden
- **Read/Unread**-State für Berichte des Teams

## Funktionalität — alles muss WIRKLICH arbeiten

### Backend / DB
- Drizzle Schema vollständig, alle Relationen, Indizes auf `tenant_id`, `resident_id`, `created_at`
- Migrations + Seed-Skript funktioniert
- Server Actions für Mutations (Auth.js Session-Check in jeder Action)
- Zod-Validation für ALLE Eingaben (Server + Client)
- Audit-Log auto-trigger bei jedem Update (Helper `logChange()`)
- Soft-Delete für Bewohner (DSGVO: Löschfristen 30 Jahre Pflege)
- Rate-Limiting auf Auth-Endpoints

### Auth — produktionsreif (nicht Mock)
- Auth.js v5 mit Credentials + bcrypt (passwort-hash in DB)
- RBAC-Middleware (`requireRole(['admin','pdl'])`)
- Session in JWT mit 4h-TTL für App, 30 Tage für "remember me"
- Multi-Tenancy: jede Query filtert auf `tenant_id` (Helper-Wrapper)
- Logout sauber, Session-Invalidierung
- 2FA-Vorbereitung (Schema-Felder, UI-Stub für Phase 2)

### Spracheingabe-Demo
- WebAudio-API zur Aufnahme (echt funktional, nicht nur UI)
- Mock-Backend-Endpoint `/api/voice/transcribe` der nach 1.5s den vorgefertigten Demo-Text zurückgibt
- Mock-Endpoint `/api/voice/structure` der den Demo-Text als SIS-strukturiertes JSON zurückgibt
- UI-Flow: Aufnahme → Transkript → "KI strukturiert..." Loader → SIS-Vorschlag-Karten → Speichern

### KI-Schichtbericht
- Endpoint `/api/handover/generate` — sammelt aus DB die letzten 24h Daten für aktive Bewohner
- Mock-Output: schön formatierter Markdown-Bericht mit Sektionen pro Bewohner
- Echte DB-Aggregation, nur die "KI" ist Template-basiert (für Demo ehrlich, später Claude API)

### Charts (Recharts)
- Vital-Werte: Linien-Chart mit Schwellenwerten als Referenz-Linien
- Risiko-Trend: Sparkline + Trend-Pfeil
- Dashboard-KPIs: animierte Counter + Mini-Sparklines
- Tooltip mit deutschem Datumsformat

### Reports / Export
- PDF-Export für Pflegebericht (jspdf oder react-pdf) — eine Funktion-Demo reicht
- CSV-Export für Audit-Log
- Druckbare Übergabe-Liste (print-styles)

## A11y — WCAG 2.2 AA strict

- alle Form-Inputs labeled
- aria-live Regions für Toast/Status-Updates
- focus-trap in Modals (radix übernimmt das)
- Skip-Link "Zum Hauptinhalt"
- Kontraste prüfen (mindestens 4.5:1)
- Touch-Targets >= 44x44px
- alt-Texte für alle Icons mit Bedeutung
- Tastatur-only nutzbar (Sidebar, Tabellen, Modals)

## Performance

- Lighthouse-Score Ziel: 95+ Performance, 100 A11y, 100 Best Practices, 100 SEO (für Marketing-Site)
- Bilder: next/image mit width/height
- Fonts: next/font, display=swap
- Bundle-Splitting: dynamic() für Recharts, Mikrofon-API
- Kein blocking JS auf Marketing-Site
- Suspense + Streaming für /app Dashboard

## Inhalte — Demo-Realismus

- Bewohner-Namen plausibel österreichisch/deutsch (Mix), Altersgruppe 65-95
- Diagnosen realistisch (Demenz, Diabetes, Hüft-TEP, Schlaganfall-Folge, Parkinson, COPD)
- Pflegeberichte in echter Pflege-Sprache (kein KI-Generic-Blubber)
- SIS-Einträge mit echten Maßnahmen ("Mobilisation 2x täglich, max. Belastung re. Bein 20 kg")
- Dienstplan mit echten Schichten (Früh 06-14, Spät 14-22, Nacht 22-06)

## Final-Checks vor Report

1. `pnpm build` läuft ohne Fehler/Warnings
2. `pnpm lint` clean
3. Demo-Login funktioniert (alle 4 Rollen)
4. Mindestens 5 Screenshots im `docs/screenshots/` Ordner für README
5. README.md hat: Quick-Start (3 Befehle), Demo-Logins, Tour-Reihenfolge, Roadmap
6. DEMO-SCRIPT.md mit 8-Minuten-Pitch-Walkthrough

## Bewertungsmaßstab

Zielbild: **Linear für Pflege**. Wenn ein:e Pflegekraft nach 5 Minuten Demo sagt "Das brauche ich morgen" — dann ist die Qualität erreicht. Wenn die aws-Jury das Projekt sieht und ohne weitere Fragen empfiehlt — dann passt es.

**Kein "fast fertig". Kein "TODO später". Kein Lorem.**
