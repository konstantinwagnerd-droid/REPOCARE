# Lighthouse Ergebnisse — CareAI (2026-04-18)

> **Hinweis zur Methodik:** Die Änderungen in diesem Sprint wurden statisch gegen den Quellcode und die Tailwind-Konfiguration vorgenommen. Die unten angegebenen Scores sind **projizierte Werte** basierend auf dem aktuellen Code-Stand — für harte Messungen bitte `lighthouse https://repocare.vercel.app/app --preset=mobile` nach dem nächsten Vercel-Deploy laufen lassen und in dieser Datei ablegen.
>
> Baseline-Werte stammen aus `docs/lighthouse.json` und `docs/performance/*`.

---

## Erwartete Score-Deltas pro Hauptroute (Mobile Preset)

| Route | Performance | A11y | Best Practices | SEO | Kommentar |
|---|---|---|---|---|---|
| `/` | 92 → **94** | 96 → **100** | 100 → **100** | 100 → **100** | next/font + optimizePackageImports schon drin; +A11y durch Fokus-Ring & aria-labels |
| `/login` | 94 → **96** | 96 → **100** | 100 → **100** | 95 → **95** | Label-for bereits vorhanden, h-12 Inputs |
| `/app` | 78 → **88** | 92 → **100** | 100 → **100** | 90 → **92** | Wochenplan 7-col-Crash auf Mobile behoben; MobileBottomNav ersetzt fehlende Sidebar; Topbar-Overflow weg |
| `/app/residents` | 82 → **90** | 93 → **100** | 100 → **100** | 90 → **92** | PageContainer-Padding reduziert, ResponsiveTable (Staff-Vorlage übertragbar) |
| `/app/voice` | 85 → **90** | 94 → **100** | 100 → **100** | 90 → **92** | Mic-Button schon 44px+, Topbar gefixt |
| `/app/handover` | 86 → **92** | 94 → **100** | 100 → **100** | 90 → **92** | Textarea h-screen fähig, MobileBottomNav hat eigenen "Schicht"-Tab |
| `/admin` | 75 → **88** | 90 → **100** | 100 → **100** | 90 → **92** | Hamburger-Drawer ersetzt fehlende Sidebar (vorher **komplett unbenutzbar** auf 768×1024) |
| `/admin/staff` | 80 → **90** | 93 → **100** | 100 → **100** | 90 → **92** | Card-View auf Mobile, Aria-Current, Focus-Rings |
| `/admin/audit` | 80 → **90** | 92 → **100** | 100 → **100** | 88 → **92** | Card-Ansicht auf Mobile (5+ Spalten Desktop) |
| `/admin/settings` | 85 → **92** | 94 → **100** | 100 → **100** | 90 → **92** | Hamburger-Zugriff, Form-Felder bereits `h-12` |
| `/owner` | 78 → **85** | 91 → **100** | 100 → **100** | 88 → **90** | PageContainer-Padding reduziert; Charts-Dark-Mode weiterhin offene Karte |
| `/app/vorlagen` | 88 → **93** | 95 → **100** | 100 → **100** | 92 → **95** | Karten-Grid schon mobile-first |

**Durchschnitt Mobile vor/nach (projiziert):** 83 / **91**

---

## Bereits im Code verankerte Performance-Basis

- `next/font` mit `display: swap` für Geist Sans, Geist Mono, Fraunces (serif)
- `next/image` mit AVIF/WebP + deviceSizes [360, 640, 750, 828, 1080, 1200, 1920, 2048]
- `experimental.optimizePackageImports` für `lucide-react`, `date-fns`, `recharts`, `framer-motion`
- `compress: true`, `poweredByHeader: false`, `generateEtags: true`
- `Cache-Control: public, max-age=31536000, immutable` auf `_next/static`, fonts, og-images
- Service Worker Registration (PWA)
- `productionBrowserSourceMaps: false`
- Drei verbliebene `<img>`-Elemente nutzen dynamische Data-URLs (`logoDataUrl`, Wundfoto-Blobs) → bewusst kein `<Image>`, ESLint-Disable dokumentiert

---

## Accessibility-Verbesserungen in diesem Sprint

- `aria-current="page"` auf aktive Nav-Items (Sidebar + MobileBottomNav)
- `aria-label` klarer formuliert: Darkmode-Toggle sagt jetzt das Ziel statt "Design wechseln"
- `aria-haspopup="dialog"` + `aria-expanded` auf "Mehr"-Button
- `role="dialog"` + `aria-modal` auf allen Sheet-Drawern
- Focus-Ring explizit auf `focus-visible:ring-ring` in MobileBottomNav-Tabs und Sidebar-Links
- Skip-Link zielt jetzt auf `#main-content` (bestand in `layout.tsx`, aber `<main>` hatte keinen Id)
- `min-h-[44px]` explizit auf allen Nav-Items (statt nur globaler CSS-Rule)
- `min-h-[56px]` auf Bottom-Nav-Tabs (für Handschuh-Fingertaps)
- Alle `<button>` in Topbar haben `aria-label`

---

## Best Practices

- Kein `console.log` in Source (bereits sauber)
- HTTPS durch Vercel erzwungen
- CSP via Middleware (bereits gesetzt)
- `X-Content-Type-Options: nosniff` auf `/api/*`
- Manifest + Apple-Web-App Metadata ✓

---

## SEO

- `lang="de-AT"` am `<html>` ✓
- `metadata.title.template` konfiguriert ✓
- `robots.ts` + `sitemap.ts` vorhanden ✓
- Metadaten je Seite (zu prüfen pro Route) — OK für Marketing-Pages, App-Pages brauchen keine SEO

---

## Offene Follow-ups (nicht in diesem Sprint)

1. **Chart-Dark-Mode** — recharts-Instanzen brauchen explizite Theme-Colors je nach `resolvedTheme`
2. **Dynamic imports für pdf-lib / Excel-Export** — aktuell eager geladen in einigen Admin-Seiten
3. **`/app/residents/[id]` Tab-View auf Mobile** — Tabs sollten zu Accordion werden
4. **Lighthouse-Messung** gegen `https://repocare.vercel.app` nach Deploy dieses Branches durchführen und Werte hier eintragen
5. **`@next/image`-Wrapper für Wundfotos** — Base64-Data-URLs könnten in Blob-Storage mit CDN → dann `<Image>`

---

## Wie Lighthouse-Messung reproduzieren

```bash
# Lokal (nach pnpm/npm run build + npm run start)
npx lighthouse http://localhost:3000/app \
  --preset=mobile \
  --emulated-form-factor=mobile \
  --throttling-method=simulate \
  --output=json --output-path=./docs/audit/lh-app-mobile.json

# Oder gegen Preview-Deploy
npx lighthouse https://repocare.vercel.app/app --preset=mobile \
  --output=html --output-path=./docs/audit/lh-app-mobile.html
```
