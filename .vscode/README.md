# VS Code / Cursor Workspace — CareAI

Diese Konfiguration sorgt dafür, dass das Projekt sofort produktiv nutzbar ist.

## Beim ersten Öffnen

1. VS Code zeigt einen Hinweis "Empfohlene Erweiterungen installieren?" → **Ja** klicken
2. Wartet bis der TypeScript-Server fertig geladen hat (Status-Leiste unten links)
3. **Cmd/Strg + Shift + B** → "CareAI · Komplett-Setup" auswählen → installiert, baut Schema, seeded, startet Dev-Server

## Tasks (Strg/Cmd + Shift + P → "Run Task")

| Task | Zweck |
|---|---|
| CareAI · 1. Install | `npm install` |
| CareAI · 2. DB Push (Schema) | Schema in `local.db/` anlegen |
| CareAI · 3. DB Seed (Demo-Daten) | 12 Bewohner + 220 Audit-Einträge |
| CareAI · 4. Dev-Server starten | `npm run dev` auf :3000 |
| CareAI · Build | Production-Build (mit Fehler-Reporting in Problems-Panel) |
| CareAI · Lint | ESLint-Check |
| CareAI · TypeCheck | `tsc --noEmit` |
| CareAI · Drizzle Studio öffnen | DB-GUI auf :4983 |
| CareAI · Komplett-Setup | Sequenz: Install → Push → Seed → Dev |

## Debug (F5)

| Konfiguration | Wann nutzen |
|---|---|
| Next.js: dev server (Node) | Standard-Run mit Terminal-Output |
| Next.js: dev server (debug Server) | Breakpoints in Server-Components / API-Routes |
| Next.js: debug Client (Chrome) | Breakpoints im Browser (Source-Maps aktiv) |
| Next.js: full stack | Server + Chrome gleichzeitig — beste Variante |
| Drizzle: db:seed / push / studio | Einzeln debugbar |

## Snippets (in `.tsx`/`.ts` tippen + Tab)

| Prefix | Was es generiert |
|---|---|
| `rsc` | React Server Component skeleton |
| `rcc` | "use client" Component mit useState |
| `sa`  | Server Action mit Auth-Check + Zod |
| `api` | API Route Handler mit Auth |
| `dq`  | Drizzle Query |
| `card` | shadcn Card Skeleton |
| `lucide` | Lucide Icon Import |

## Empfohlene Erweiterungen (`.vscode/extensions.json`)

- **Prettier + ESLint + Tailwind** — Formatter & Linter
- **Pretty TS Errors + Error Lens** — TypeScript-Fehler lesbar machen
- **Code Spell Checker (DE/EN)** — Pflege-Begriffe sind als Wörterbuch hinterlegt
- **Drizzle VSCode** — Schema-Highlighting + Migrations-Helper
- **GitLens** — Inline Git-Blame
- **Material Icon Theme** — schönere Datei-Icons
- **REST Client** — `.http`-Files für API-Tests (siehe `docs/api-tests.http`)
- **Playwright** — für E2E-Tests + Screenshots

## Cursor

Wenn du Cursor statt VS Code nutzt: alle Configs gelten 1:1, plus:
- **Cmd+L** für Cursor Chat (kennt die ganze Codebase)
- **Cmd+K** in Datei für gezielte Edits
- Empfehlung: in Cursor "Codebase Index" einmal laufen lassen (Settings → Codebase → Index Codebase)

## Theme-Anpassung

Die Status-Leiste unten ist Brand-konform Petrol-Teal eingefärbt — so erkennst du sofort, dass du im CareAI-Projekt bist.

## Was die Configs außerdem machen

- **Format on Save** — jeder Save formatiert via Prettier
- **ESLint auto-fix** beim Save
- **Imports auto-organize** beim Save
- **File Nesting** — `package.json` gruppiert lock-Files, `*.tsx` zeigt zugehörige `.test.tsx`
- **Search excludes** — `node_modules`, `.next`, `local.db` aus Suche raus
- **Tailwind Class-Detection** für `cva()`, `cn()`, `clsx()` Helper
- **UTF-8 + LF** überall (Windows-Crashes durch CRLF vermeiden)
