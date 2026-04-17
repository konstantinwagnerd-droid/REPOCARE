# Architecture — CareAI

## Überblick

CareAI ist eine mehrmandantenfähige SaaS mit 4 Rollen (admin, pdl, pflegekraft, angehoeriger). Die gesamte Logik läuft in Next.js Server Components gegen Postgres.

## Schichten

```
┌──────────────────────────────────────────────────────┐
│  Client (React 19 — mostly server, hydrated where needed)  │
├──────────────────────────────────────────────────────┤
│  Next.js App Router (Server Components + Actions)   │
├──────────────────────────────────────────────────────┤
│  Auth.js v5 + Middleware (Role-Based Routing)       │
├──────────────────────────────────────────────────────┤
│  Drizzle ORM (typed)                                 │
├──────────────────────────────────────────────────────┤
│  PostgreSQL 16                                       │
└──────────────────────────────────────────────────────┘
```

## Datenmodell (16 Tabellen)

- **Multi-Tenant:** `tenants` → `users`, `residents` (tenantId-scoped)
- **Pflegekern:** `residents` → `sis_assessments`, `care_plans`, `care_reports`
- **Medizin:** `vital_signs`, `medications`, `medication_administrations`, `wounds`, `wound_observations`
- **Sicherheit:** `incidents`, `risk_scores`, `audit_log`, `shifts`
- **Angehörige:** `family_messages`

## Kritische Flows

### Voice → SIS (geplant)
1. Browser nimmt Audio auf
2. POST `/api/voice/transcribe` → Whisper (oder Azure / selfhosted)
3. POST `/api/voice/structure` → LLM (Anthropic Claude / GPT-4o) mit System-Prompt für SIS
4. UI zeigt Vorschlag; Pflegekraft bestätigt oder bearbeitet
5. Persistenz: `care_reports.aiStructured` + `careReports.sisTags`
6. Audit-Log Eintrag (create)

Heute: Mock in `voice-client.tsx`.

### Role-Based Routing
- `middleware.ts` prüft `session.user.role` und leitet um: `admin`/`pdl` → `/admin`, `angehoeriger` → `/family`, `pflegekraft` → `/app`.
- Page-Level Re-Checks in Layouts sind redundant, aber defensive.

### Audit-Log
- Helper: `src/lib/audit.ts`
- Erwartung: Jede mutierende Server Action ruft `logAudit()` auf.
- Revisionsfestigkeit: keine Updates auf `audit_log`.

## Erweiterungspunkte

- **E-Mail:** `next-auth` Email Provider (Resend / SendGrid)
- **Whisper:** Server-Action in `src/app/api/voice/`
- **Push-Notifications:** Web Push für kritische Vitalwerte
- **FHIR-Export:** HL7 FHIR Export für Kliniken
