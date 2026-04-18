# Mobile-Responsive Audit — CareAI (2026-04-18)

**Scope:** Mobile-first review for 10"/8" Android tablets im Pflegealltag (800×1280 hochkant, fettige Finger, alte Browser). Audit wurde statisch gegen den Quellcode durchgeführt (Next.js 15, Tailwind 3).

**Viewports geprüft:**
- iPhone SE 375×667 (sehr kleines Tablet / Phablet Fallback)
- iPad mini 768×1024 (typisches Pflege-Tablet 10")
- Desktop 1440×900 (PDL-Büro / Arztzimmer)

**Legende:** ✅ okay  ⚠ Kritisch  ⛔ Broken

---

## Matrix Route × Viewport

| Route | 375 (Phone) | 768 (Tablet) | 1440 (Desktop) | Top-Befunde |
|---|---|---|---|---|
| `/` (Marketing) | ✅ | ✅ | ✅ | Section-Paddings okay; keine H-Scrolls gefunden |
| `/login` | ✅ | ✅ | ✅ | Input `h-12` bereits groß, Labels okay |
| `/app` (Dashboard) | ⚠ | ⚠ | ✅ | Keine mobile Nav, Topbar 6 Buttons überläuft, `p-6` zu viel auf 375; Wochenplan `grid-cols-7` crasht auf 375 |
| `/app/residents` | ⚠ | ✅ | ✅ | Tabellen via `overflow-x-auto`, aber kein Card-Fallback. Filter-Bar wraps aber `px-6` zu viel |
| `/app/residents/[id]` | ⚠ | ⚠ | ✅ | Tabs + KPI-Grid, PageContainer `p-6 lg:p-10` — Mobile zu viel Padding |
| `/app/voice` | ⚠ | ✅ | ✅ | Mic-Button groß (gut), Transcript-Bereich aber `max-w-prose` nicht klar responsiv |
| `/app/handover` | ⚠ | ✅ | ✅ | Textarea voll Breite, Kopierenbutton ok, keine mobile Topbar |
| `/admin` | ⚠ | ⚠ | ✅ | Sidebar versteckt auf <lg (=1024), kein Ersatz → Admin nicht bedienbar auf 768×1024 (iPad mini hochkant)! |
| `/admin/staff` | ⛔ | ⚠ | ✅ | `DataTable` 4 Spalten + Filter + Export, auf 375 H-Scroll, auf 768 knapp |
| `/admin/audit` | ⛔ | ⚠ | ✅ | Logs-Tabelle ≥5 Spalten, braucht Card-View unter md |
| `/admin/settings` | ⚠ | ✅ | ✅ | Form-Felder ok, Sidebar fehlt (s. oben) |
| `/owner` | ⚠ | ⚠ | ✅ | Owner-Cockpit, mehr KPIs+Charts, `lg:grid-cols-*` — bis lg einspaltig, aber `p-10` nervt |
| `/app/vorlagen` | ✅ | ✅ | ✅ | Karten-Grid — responsive Standard |
| `/app/vorlagen/[slug]` | ⚠ | ✅ | ✅ | Langer Prose-Content, Table-of-Contents als Sidebar fehlt auf mobile |

---

## Häufigste Issues (Cluster)

### 1. ⛔ Mobile-Navigation komplett fehlend (KRITISCH)
`src/components/app/sidebar.tsx` Zeile 68: `<aside className="hidden w-64 ... lg:flex">` — Sidebar erscheint **erst ab 1024px**. Auf 8"/10"-Tablets im Hochformat (meist 768×1024 oder 800×1280) hat der Nutzer **keine Navigation sichtbar**. Admin-Layout ist auf 768 unbenutzbar.

**Fix:** `MobileBottomNav` für `/app/*` (4 Haupttabs) + Sheet-Menü für volles Nav. Siehe Commit `feat(mobile): bottom-tab-nav`.

### 2. ⚠ Topbar überläuft auf <600px
`src/components/app/topbar.tsx` hat 6 Icon-Buttons + Avatar + Facility-Label auf einer Zeile mit `px-6`. Auf 375 rechnet das ~ 44*6 + 100 + 44 + 44 = ~450px Inhalt + 48px Padding → overflow.

**Fix:** Verstecke seltene Controls unter `sm:`, reduziere `px-6 → px-4`, verwende flexgap smaller.

### 3. ⚠ PageContainer Padding zu groß auf Mobile
`page-shell.tsx:269`: `space-y-8 p-6 lg:p-10` → auf 375 bleibt nach 24px beidseitig noch ~327px Inhalt, Cards schrumpfen. Sollte `p-4 md:p-6 lg:p-10` sein.

### 4. ⚠ Tabellen ohne Card-Fallback
`DataTable` wraps in `overflow-x-auto`, aber Pflegekraft auf Tablet soll nicht horizontal scrollen. Brauchen `<ResponsiveTable>` oder `hidden md:table + md:hidden cards`-Pattern.

### 5. ⚠ Button `size="sm"` = h-10 (40px) unter 44px
`src/components/ui/button.tsx:21`. Global CSS-Rule (`globals.css:58`) erzwingt 44px — gut als Fallback, aber explizite `h-10` sollte korrigiert werden, um Layout nicht zu zerschießen.

### 6. ⚠ Wochenplan `grid-cols-7` auf 375
`src/app/app/page.tsx:232`: 7 Spalten auf 375px = 42px pro Box, `text-lg` passt nicht. Stacken auf <sm.

### 7. ⚠ `raw <img>` in 3 Dateien
`WhitelabelEditor.tsx` (2×), `WoundTimelapseClient.tsx`. Durch `<Image>` ersetzen für CLS + LCP.

### 8. ✅ Was bereits gut ist
- `next/font` mit `display: swap` für Geist + Fraunces
- `next/image` mit avif/webp + deviceSizes
- Skip-Link vorhanden
- `lang="de-AT"` am `<html>`
- Global Touch-Target-Rule 44px für alle `<button>`
- Focus-Ring via `:focus-visible`
- Manifest + Apple-Web-App
- Keine `console.log` in Produktion
- `optimizePackageImports` für lucide/recharts/framer-motion

---

## Dark-Mode-Befunde

Tokens in `globals.css` sind konsistent (HSL-basiert). Probleme:
- **StatCard** `bg-emerald-50/50`, `bg-rose-50/50` etc. haben Dark-Mode-Pendants (`dark:bg-*-950/20`) — ✅
- **Notification-Zeile** `/app/page.tsx:209`: `bg-rose-100 text-rose-700` — kein Dark-Mode-Fallback ⚠
- **QuickAction** `bg-background` als Icon-BG — ok
- **Charts (recharts)**: meist voreingestellt mit weißem Hintergrund → prüfen bei Einbindung

---

## Nächste Schritte (Reihenfolge)

1. MobileBottomNav + Sheet-Hamburger → `/app` und `/admin`
2. Topbar Responsive-Fix (Buttons ausblenden < sm)
3. PageContainer `p-4 md:p-6 lg:p-10`
4. `ResponsiveTable`-Komponente + Einbau in `/admin/staff`, `/admin/audit`
5. Dashboard Wochenplan: `grid-cols-3 sm:grid-cols-7`
6. Raw `<img>` → `<Image>`
7. Button `sm` → h-11 mit `sm:h-10` Desktop-Override (oder h-11 global)
8. Dark-Mode Notification-Rose
