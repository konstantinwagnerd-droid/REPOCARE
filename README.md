# CareAI — KI-gestützte Pflegedokumentation

Produktionsreife Next.js 15 Web-App für Pflegeeinrichtungen in DACH. Spracheingabe, SIS, Maßnahmenplanung, MDK-konformes Audit-Log, Angehörigen-Portal.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Sprache:** TypeScript (strict)
- **DB:** PostgreSQL + Drizzle ORM
- **Auth:** Auth.js v5 (Credentials + JWT Sessions, Role-Based Access)
- **UI:** Tailwind CSS 3 + shadcn/ui primitives (Radix)
- **Typo:** Fraunces (Serif) + Geist (Sans)
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Animations:** Framer Motion 12 (page transitions, stagger lists, pulsing mic wave)
- **Dark Mode:** next-themes (System / Light / Dark toggle)
- **Toast:** Sonner (success, error, warning, undo)
- **Command Palette:** cmdk (Cmd+K global search + navigation)
- **i18n:** 100% Deutsch (de-AT)

## Setup

```bash
pnpm install           # oder: npm install
cp .env.example .env
# DATABASE_URL und AUTH_SECRET in .env eintragen
pnpm db:push           # Schema auf Postgres pushen
pnpm db:seed           # Demo-Daten laden
pnpm dev               # http://localhost:3000
```

### `.env`

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careai"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

Für Supabase Free: Connection-String aus Supabase → Settings → Database kopieren (URI, nicht Pooler). Sonst lokal Postgres via Docker:

```bash
docker run --name careai-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

## Demo-Logins

Passwort für alle: **`Demo2026!`**

| Rolle | E-Mail | Landing |
|---|---|---|
| Administrator:in | `admin@careai.demo` | `/admin` |
| Pflegedienstleitung | `pdl@careai.demo` | `/admin` |
| Pflegekraft | `pflege@careai.demo` | `/app` |
| Pflegekraft | `pflege2@careai.demo` ... `pflege5@careai.demo` | `/app` |
| Angehörige:r | `familie@careai.demo` | `/family` |

## Demo-Script (Investor / Förderung)

1. **Marketing-Landing** (`/`) — Brand, Werte, Preise, EU AI Act / DSGVO, Impact-Storytelling.
2. **Login** als `pflege@careai.demo` / `Demo2026!`.
3. **Dashboard** (`/app`) — Heute-Übersicht, Bewohner:innen, offene Aufgaben, KPIs.
4. **Bewohner:in öffnen** — Tabs durchklicken: SIS, Maßnahmenplan, Vitalwerte (Recharts), Medikation + MAR, Wunddoku, Risiko-Scores.
5. **Spracheingabe** (`/app/voice`) — Mikro tippen, 5 Sek warten, stoppen. KI-strukturierter SIS-Vorschlag.
6. **Schichtbericht** (`/app/handover`) — „Bericht generieren“ klicken: Loader → strukturierte Übergabe.
7. **Logout → Admin-Login** als `admin@careai.demo`.
8. **Admin-Übersicht** — KPI Woche, Audit-Log.
9. **Audit-Log** (`/admin/audit`) — Revisionsfestigkeit für MDK.
10. **Dienstplan** — Wochenraster mit Schichten.
11. **Logout → Angehörigen-Login** `familie@careai.demo`.
12. **Angehörigen-Portal** (`/family`) — Wohlbefindens-Score, Tagesübersicht, Aktivitäten, Nachricht an Team.

## Was ist Mock vs. echt

| Bereich | Status |
|---|---|
| Marketing-Landing, Brand | **Echt** |
| Auth (Credentials + JWT, Middleware, RBAC) | **Echt** |
| DB Schema (16 Tabellen) + Seed (12 Bewohner, 200+ Audit) | **Echt** |
| Bewohner-Detail mit Tabs, Recharts, MAR | **Echt** (Live aus DB) |
| Admin Audit-Log, Staff, Residents, Schedule | **Echt** (Live aus DB) |
| Suche | **Echt** (Postgres ILIKE) |
| Spracheingabe (Whisper) | **Mock** (simulierter Transkript + KI-Struktur) |
| Schichtbericht-Generator | **Mock** (vorformulierter Text mit Loader) |
| E-Mail-Versand (Magic Link, Bestätigung) | **Stub** |
| Demo-Request Formular | **Stub** (log + redirect) |
| Sprach-Transcription Whisper API | **nicht verkabelt** (bereit für Anthropic/OpenAI Key) |

## Architektur

```
src/
├── app/
│   ├── (marketing)/    Public site
│   ├── (auth)/         login, signup, verify, forgot-password
│   ├── app/            Pflegekräfte-Bereich (residents, handover, voice, search)
│   ├── admin/          Admin/PDL-Bereich (staff, residents, audit, schedule, reports, settings)
│   ├── family/         Angehörigen-Portal
│   └── api/            auth + business endpoints
├── components/
│   ├── ui/             shadcn/ui primitives
│   ├── marketing/      Nav, Footer
│   └── app/            Sidebar, Topbar, VitalsChart, Command-Palette
├── db/                 schema.ts, client.ts, seed.ts
├── lib/                auth.ts, audit.ts, rbac.ts, utils.ts
└── types/              Ambient TS types
```

## Dokumentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Komponentenaufbau, Datenfluss
- [SECURITY.md](docs/SECURITY.md) — DSGVO, EU AI Act, Verschlüsselung, Audit
- [DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) — Investor-Demo Step-by-Step

## Lauffähigkeit

Nach:
```
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

→ `http://localhost:3000` öffnen.

## Weiterführend in Cursor

Suchbegriffe für Cursor:
- `schema.ts` — alle Tabellen
- `auth.ts` — NextAuth config
- `(marketing)/page.tsx` — Landing
- `residents/[id]/page.tsx` — Kern-Detail-View

## Lizenz

Proprietär — CareAI GmbH (i.G.). Demo für Förder- und Investor-Zwecke.
