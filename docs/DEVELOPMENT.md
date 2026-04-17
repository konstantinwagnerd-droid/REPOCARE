# CareAI — Development Deep Dive

Diese Seite ist dein Onboarding-Guide, wenn du neu im Team bist. Nimm dir
30 Minuten — danach weisst du, wo du was findest.

## Tech-Stack (Kurzform)

| Layer | Technologie |
|-------|-------------|
| Frontend | Next.js 15 App Router, React 19, TypeScript strict, Tailwind 4 |
| Backend | Next.js Route Handlers, Edge wo moeglich, Node wenn noetig |
| DB | Postgres 16 (prod), pglite (dev/e2e) via Drizzle ORM |
| Auth | NextAuth v5 (credentials + magic link + SSO optional) |
| LLM | Provider-agnostischer Client (`src/lib/llm/`) — Anthropic/OpenAI/Mock |
| Storage | S3-kompatibel (MinIO, Cloudflare R2) mit clientseitiger Verschluesselung |
| Tests | Vitest (Unit), Playwright (E2E), axe-core (A11y) |
| Monitoring | Prometheus + Grafana + Loki (Addon, siehe `docker/grafana/`) |

## Projekt-Struktur

```
careai-app/
├── src/
│   ├── app/                 # Next App Router — Routen, Layouts, Route Handlers
│   │   ├── (public)/        # Marketing-Site
│   │   ├── (app)/           # authentifizierte App
│   │   ├── (admin)/         # Admin-Bereich (role=admin)
│   │   └── api/             # HTTP-API (siehe public/openapi.yaml)
│   ├── components/          # UI-Bausteine (shadcn-inspiriert)
│   ├── features/            # fachliche Module (care, voice, exports, …)
│   │   └── <feature>/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── queries/     # Drizzle-Queries + Zod-Schemas
│   │       └── types.ts
│   ├── lib/                 # Querschnitts-Utilities
│   │   ├── auth/            # NextAuth-Konfig, RBAC-Helpers
│   │   ├── db/              # Drizzle-Schema + Connection
│   │   ├── llm/             # Provider-agnostischer LLM-Client
│   │   ├── metrics.ts       # Prometheus-Counter/Histograms
│   │   ├── audit.ts         # Audit-Log-Schreiber
│   │   └── rate-limit.ts
│   └── middleware.ts        # Auth + Tenant-Context + Locale
├── drizzle/                 # Migrationen
├── e2e/                     # Playwright
├── tests/                   # Vitest (Integration)
├── mobile/                  # React-Native (Pflege-App)
├── mobile-family/           # React-Native (Angehoerigen-App)
├── emails/                  # React-Email Templates
├── content/                 # i18n, Marketing-MDX
├── docker/                  # docker-compose + Addons (grafana, loki, prometheus)
├── docs/                    # Alle Docs (du bist hier)
├── public/                  # Statische Assets + openapi.yaml + api-docs.html
└── scripts/                 # CLI-Tooling (seed, backup, anonymize)
```

## Wichtige Datei-Konventionen

- **Route Handler** `src/app/api/<path>/route.ts` — immer mit Zod-Validation, RBAC-Check, Audit-Trigger.
- **Server Components** sind Default. „use client“ nur wenn State/Effects wirklich noetig.
- **Drizzle-Schemas** leben in `src/lib/db/schema/<entity>.ts` und werden in
  `src/lib/db/schema/index.ts` re-exportiert.
- **Zod-Schemas** leben bei der Feature-Query, nicht global.

## RBAC-Strategie

Vier Rollen im System:

| Rolle | Scope | Beispiele |
|-------|-------|-----------|
| `super_admin` | cross-tenant | Impersonation, Feature-Flags, Support |
| `admin` | ein Tenant | Nutzer anlegen, Exporte, Billing |
| `pflege` | ein Tenant | Berichte schreiben, Voice-Input, Handover |
| `angehoerige` | ein Tenant + assigned residents | Read-Only-Sicht |

Durchgesetzt in 3 Schichten:

1. **Middleware** — denied, wenn nicht eingeloggt / Tenant-Mismatch.
2. **Route Handler** — `requireRole("admin")` am Anfang.
3. **DB-Layer** — jede Query filtert auf `tenantId` via `withTenant()`-Wrapper.

Tests in `src/lib/auth/rbac.test.ts` sichern alle 4 Rollen x 4 kritische Routen.

## Audit-Log-Flow

Jede sicherheits- oder datenschutzrelevante Aktion ruft `audit.log(event)` auf:

```ts
import { audit } from "@/lib/audit";
await audit.log({
  action: "care_report.create",
  actorId: session.user.id,
  tenantId: session.user.tenantId,
  targetType: "care_report",
  targetId: report.id,
  metadata: { residentId },
});
```

Der Schreiber persistiert in `audit_log` (append-only per Trigger, keine
`UPDATE`/`DELETE` erlaubt). Exporte gehen via `GET /api/exports/audit`.

## LLM-Client-Architektur

```
features/care/handover.ts
         │
         ▼
  llm.completion({ prompt, style })   ← einheitliches Interface
         │
         ▼
  src/lib/llm/client.ts               ← waehlt Provider aus ENV
         │
  ┌──────┼──────┬────────┐
  ▼      ▼      ▼        ▼
anthropic openai local  mock
```

- Provider-Auswahl ueber `LLM_PROVIDER` in `.env`.
- Kosten + Tokens gehen in `careai_llm_*` Prometheus-Metriken.
- Timeouts + Retries zentral, Streaming opt-in.
- `mock`-Provider fuer Tests und Demos — deterministische Antworten aus
  `src/lib/llm/mock-fixtures/`.

## Multi-Tenancy-Konzept

- **Shared DB, Row-Level Tenant-Scoping** ueber `tenant_id`-Spalte in jedem Fact-Table.
- Postgres Row-Level-Security (RLS) als Defense-in-Depth (Phase 2, siehe
  `docs/DATABASE-MIGRATION.md`).
- Jeder Request hat `req.auth.tenantId` aus Session oder `x-tenant-id`-Header
  (nur super_admin).
- **Storage**: S3-Keys sind `tenant/<tenantId>/...` — Cross-Tenant-Access
  technisch ausgeschlossen.

## Wo man anfaengt, wenn man…

| Ziel | Einstiegspunkt |
|------|----------------|
| … einen neuen API-Endpoint bauen will | `src/app/api/<group>/route.ts` + `public/openapi.yaml` |
| … ein neues DB-Feld brauche | `src/lib/db/schema/<entity>.ts` → `npm run db:generate` → `db:push` |
| … eine neue Rolle einfuehren will | `src/lib/auth/roles.ts` + Tests in `src/lib/auth/rbac.test.ts` |
| … eine neue Metrik exponieren will | `src/lib/metrics.ts` + Grafana-Dashboard in `docker/grafana/dashboards/` |
| … einen Background-Job schreiben will | `src/lib/jobs/` — nutzt Postgres LISTEN/NOTIFY |
| … einen Email-Template aendern will | `emails/<name>.tsx` (React-Email) |
| … das Mobile anpassen will | `mobile/` (Expo Router, teilt Typen via `src/shared/`) |

## Lokal debuggen

```bash
npm run dev                   # Next + auto-reload
LOG_LEVEL=debug npm run dev   # ausfuehrliche Logs
npm run db:studio             # Drizzle Studio — Browser-DB-GUI
npm run e2e -- --ui           # Playwright UI-Mode
```

## Performance-Budgets

- **TTFB** < 300 ms (P95)
- **LCP** < 2.5 s (P75)
- **Bundle** < 200 KB (gzipped, First Load)
- **DB-Query** < 50 ms (P95 in Route Handler)

Automatische Checks: Lighthouse-CI auf jedem PR, siehe `docs/lighthouse.json`.

## Weiterlesen

- [ARCHITECTURE.md](ARCHITECTURE.md) — High-level System
- [DATABASE-MIGRATION.md](DATABASE-MIGRATION.md) — Drizzle & Migrations
- [SECURITY.md](SECURITY.md) — Threat Model
- [MONITORING.md](MONITORING.md) — Grafana/Prometheus/Loki
- [TESTING.md](TESTING.md) — Test-Strategie
