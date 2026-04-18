# CareAI Information Architecture Audit

**Datum:** 2026-04-18
**Auditor:** Design/IA-Lead-Agent
**Scope:** Alle interaktiven App-Routen (admin, app, owner, gruppe, partner, lms, family, telemedizin, investors, kiosk, onboarding). Marketing-/Legal-/Help-Seiten sind nicht Teil dieses Audits.
**Gesamt-Seiten untersucht:** 195 `page.tsx`-Dateien — davon ~70 interaktive App-Seiten, der Rest Marketing & Legal (i18n: de/en/es/fr/it).

---

## 1. Zusammenfassung

### Hauptbefunde

| # | Befund | Severity |
|---|--------|----------|
| 1 | **Uneinheitliche PageHeader-Patterns** — 4+ verschiedene Title-Varianten (`font-serif text-4xl`, `text-3xl`, `text-2xl`, keine Hierarchie). | hoch |
| 2 | **KPI-Kacheln werden in JEDEM Dashboard neu handgezeichnet** — 8+ Kopien in admin/page, app/page, gruppe/page, owner/page, partner/dashboard etc. | hoch |
| 3 | **Fehlende Breadcrumbs auf Detail- und Wizard-Seiten** (`residents/[id]`, `migration/anleitung/[source]`, `ab-testing/[name]`). | mittel |
| 4 | **Tabellen sind Rohkopien** — jede Liste (residents, staff, audit, leads) re-implementiert `<table>` mit eigenem Thead/Tbody, keine Sortierung, kein Filter, kein Export, keine Pagination. | hoch |
| 5 | **Dashboards zu duenn** — admin/page (90 LOC) und admin/dsgvo/page (27 LOC) zeigen nur 4 Kacheln ohne Trend, ohne Sparkline, ohne Drilldown. Owner/page ist am besten (140 LOC mit 8 Kacheln). | hoch |
| 6 | **Inkonsistente Empty-States** — teils `<p className="text-sm text-muted-foreground">Keine Daten</p>`, teils `<EmptyState />`, oft fehlt beides. | mittel |
| 7 | **Button-Styles** sind per `variant`/`size` gut konsistent, aber Gruppen (Header-Actions) sind mal `gap-2`, mal `gap-3`. | niedrig |
| 8 | **Spacing-Patterns** — `space-y-8 p-6 lg:p-10` ist Quasi-Standard aber nicht ueberall angewendet; `/admin/billing/page.tsx` hat gar keinen Wrapper, `/owner/page.tsx` hat `space-y-6`. | mittel |
| 9 | **Detailseiten ohne klaren Header** — `/app/residents/[id]` mischt Sidebar-Cards und Main ohne Breadcrumb; `/telemedizin/raum/[id]` hat eigene Topbar. | mittel |
| 10 | **Role-Dashboards aus Mitarbeiter-Perspektive fehlen** — Pflegekraft sieht `/app` als Liste, aber keine echte "Heute"-Ansicht mit Schicht, anstehenden Vitals, kritischen Werten. | hoch |

---

## 2. Matrix — Seiten-Inventar & Klassifikation

Legende — **Typ:** DB=Dashboard · L=Liste · D=Detail · F=Form · W=Wizard · LP=Landing · S=Settings.
**Dichte:** 🟥 duenn (< 4 Info-Einheiten) · 🟨 mittel (4–8) · 🟩 dicht (> 8 mit Drilldown).

### 2.1 Admin-Layer (`src/app/admin/**`)

| Route | Typ | Dichte | Komponenten | Bemerkung |
|-------|-----|--------|-------------|-----------|
| `/admin` | DB | 🟨 | 4 KPIs + KPI-Woche + Audit-Preview | 4 handgemalte Tiles, keine Trends, keine Sparklines |
| `/admin/residents` | L | 🟨 | Rohe Tabelle, kein Filter/Sort/Export | |
| `/admin/staff` | L | 🟨 | Avatar-Liste, kein Filter | |
| `/admin/audit` | L | 🟨 | Tabelle + 2 Export-Buttons | PDF+CSV vorhanden, aber kein Filter |
| `/admin/billing` | DB | 🟨 | Eigener Client, keine Shell | Wrapper fehlt |
| `/admin/dsgvo` | F | 🟥 | Client-Component mit Form | Minimaler Wrapper |
| `/admin/leads` | L | 🟨 | Kanban-ish | |
| `/admin/analytics` | DB | 🟨 | Eigene Charts | |
| `/admin/anomaly` | DB | 🟨 | | |
| `/admin/benchmarks` | DB | 🟨 | | |
| `/admin/performance` | DB | 🟨 | | |
| `/admin/settings` | S | 🟨 | | |
| `/admin/settings/theme` | S | 🟨 | Theme-Picker | |
| `/admin/tours` | L | 🟨 | | |
| `/admin/tools/*` | S | 🟥 | 4 Tool-Seiten, alle minimal | demo-reset, feature-flags, impersonation, maintenance |
| `/admin/webhooks` | L | 🟨 | | |
| `/admin/webhooks/docs` | D | 🟨 | Doku-Seite | |
| `/admin/lms` | DB | 🟨 | LMS-Overview | |
| `/admin/lms/kurse` | L | 🟨 | | |
| `/admin/lms/compliance` | L | 🟨 | | |
| `/admin/lms/reports` | DB | 🟨 | | |
| `/admin/lms/zuweisungen` | L | 🟨 | | |
| `/admin/marketing-automation` | L | 🟨 | | |
| `/admin/marketing-automation/[flow]` | D | 🟨 | | |
| `/admin/migration` | DB | 🟨 | | |
| `/admin/migration/anleitung/[source]` | W | 🟨 | | Breadcrumb fehlt |
| `/admin/ab-testing` | L | 🟨 | | |
| `/admin/ab-testing/new` | F | 🟨 | | |
| `/admin/ab-testing/[name]` | D | 🟨 | | Breadcrumb fehlt |
| `/admin/report-builder` | F | 🟨 | | |
| `/admin/reports` | L | 🟨 | | |
| `/admin/ai-training` | DB | 🟨 | | |
| `/admin/anonymizer` | F | 🟥 | | |
| `/admin/a11y-audit` | DB | 🟨 | | |
| `/admin/backup` | DB | 🟨 | | |
| `/admin/knowledge-graph` | DB | 🟨 | | |
| `/admin/notifications` | L | 🟨 | | |
| `/admin/press-release` | F | 🟨 | | |
| `/admin/dokumentation/check` | DB | 🟨 | | |
| `/admin/dashboards/[id]` | DB | 🟨 | Custom Dashboards | |
| `/admin/dienstplan-solver` | DB | 🟨 | | |
| `/admin/impersonation` | L | 🟨 | | |
| `/admin/crm-sync` | DB | 🟨 | | |
| `/admin/feature-flags` | L | 🟨 | | |
| `/admin/schedule` | DB | 🟨 | | |
| `/admin/zeiterfassung` | L | 🟨 | | |
| `/admin/whitelabel` | F | 🟨 | | |
| `/admin/sample-data` | S | 🟥 | | |

### 2.2 App-Layer (`src/app/app/**`) — Pflegekraft

| Route | Typ | Dichte | Komponenten | Bemerkung |
|-------|-----|--------|-------------|-----------|
| `/app` | DB | 🟨 | 4 KPIs + Resident-Liste + Reports + open Plans | Soll zu "Heute"-Dashboard werden |
| `/app/residents` | L | 🟨 | | |
| `/app/residents/[id]` | D | 🟩 | Sidebar + Tabs + Main | Breadcrumb fehlt |
| `/app/residents/[id]/wunden-timelapse/[woundId]` | D | 🟨 | | Breadcrumb fehlt |
| `/app/handover` | F | 🟨 | Schichtbericht | |
| `/app/notifications` | L | 🟨 | | |
| `/app/search` | L | 🟨 | | |
| `/app/voice` | F | 🟨 | Voice-Input | |
| `/app/voice-commands` | S | 🟨 | | |
| `/app/zeiterfassung` | L | 🟨 | | |

### 2.3 Owner (`src/app/owner/**`)

| Route | Typ | Dichte | Komponenten | Bemerkung |
|-------|-----|--------|-------------|-----------|
| `/owner` | DB | 🟩 | 8 Tiles + Quick-Actions | Bestes Dashboard, aber keine Sparklines |
| `/owner/audit` | L | 🟨 | | |
| `/owner/database` | F | 🟨 | SQL-Inspektor | |
| `/owner/files` | L | 🟨 | | |
| `/owner/leads` | L | 🟨 | | |
| `/owner/logins` | L | 🟨 | | |
| `/owner/residents` | L | 🟨 | | |
| `/owner/sessions` | L | 🟨 | | |
| `/owner/system` | DB | 🟨 | | |
| `/owner/tenants` | L | 🟨 | | |
| `/owner/users` | L | 🟨 | | |
| `/owner/settings` | S | 🟨 | | |

### 2.4 Gruppe (`src/app/gruppe/**`)

| Route | Typ | Dichte | Komponenten | Bemerkung |
|-------|-----|--------|-------------|-----------|
| `/gruppe` | DB | 🟨 | | |
| `/gruppe/compliance` | DB | 🟨 | | |
| `/gruppe/einrichtungen` | L | 🟨 | | |
| `/gruppe/einstellungen` | S | 🟨 | | |
| `/gruppe/finanzen` | DB | 🟨 | | |
| `/gruppe/kpi-vergleich` | DB | 🟨 | | |

### 2.5 Partner, LMS, Family, Telemedizin, Investors, Kiosk

| Route | Typ | Dichte | Bemerkung |
|-------|-----|--------|-----------|
| `/partner/(portal)/dashboard` | DB | 🟨 | |
| `/partner/(portal)/leads` | L | 🟨 | |
| `/partner/(portal)/provisionen` | DB | 🟨 | |
| `/partner/(portal)/rechner` | F | 🟨 | |
| `/partner/(portal)/ressourcen` | L | 🟨 | |
| `/partner/(portal)/schulungen` | L | 🟨 | |
| `/partner/(portal)/support` | F | 🟨 | |
| `/partner/(portal)/co-marketing` | L | 🟨 | |
| `/lms` | LP | 🟨 | |
| `/lms/dashboard` | DB | 🟨 | |
| `/lms/kalender` | L | 🟨 | |
| `/lms/katalog` | L | 🟨 | |
| `/lms/kurs/[id]` | D | 🟨 | |
| `/lms/zertifikate` | L | 🟨 | |
| `/family` | DB | 🟨 | |
| `/family/messages` | L | 🟨 | |
| `/telemedizin` | DB | 🟨 | |
| `/telemedizin/historie` | L | 🟨 | |
| `/telemedizin/raum/[id]` | D | 🟩 | Eigene Topbar |
| `/telemedizin/rezepte` | L | 🟨 | |
| `/telemedizin/termin-vereinbaren` | F | 🟨 | |
| `/investors/**` | LP/DB | 🟩 | Eigener i18n-Baum |
| `/kiosk/**` | DB | 🟨 | Tablet-Modus |
| `/onboarding/**` | W | 🟨 | |

---

## 3. Identifizierte Inkonsistenzen (Detail)

### 3.1 Heading-Hierarchie
- `h1`: `font-serif text-4xl font-semibold tracking-tight` (admin, app) vs. `font-serif text-3xl` (owner) vs. `font-serif text-2xl` (einige Detail-Seiten).
- `h2`: mal `font-serif text-xl`, mal `text-xs uppercase tracking-wider`.
- **Loesung:** `PageHeader` + `PageSection` (siehe `components/admin/page-shell.tsx`).

### 3.2 Spacing
- Container: `space-y-8 p-6 lg:p-10` (Mehrheit) vs. `space-y-6 p-6 lg:p-10` (owner) vs. kein Wrapper (billing).
- **Loesung:** `PageContainer`.

### 3.3 KPI-Kacheln
- 8 Varianten gefunden (Admin-`Tone`-Kachel, Owner-`Tile`, Partner-eigene Card, Gruppe-eigene Card, ...).
- Kein Trend, keine Sparkline, keine Drilldown-Links (ausser Owner).
- **Loesung:** `StatCard` mit `trend`, `sparkline`, `href`, `tone`.

### 3.4 Tabellen
- Jede Liste re-implementiert `<table class="w-full text-sm"><thead class="bg-muted/40">...`.
- Kein Sort, kein Filter, keine Pagination, kein Export (ausser Audit-Seite).
- **Loesung:** `DataTable<T>` in `components/ui/data-table.tsx`.

### 3.5 Breadcrumbs
- Fehlen auf ALLEN Detail- und Wizard-Seiten. Nur Investors hat rudimentaere Links.
- **Loesung:** `Breadcrumbs` + `PageHeader breadcrumbs={...}`.

### 3.6 Page-Titles / Subtitles
- Subtitle wechselt zwischen `mt-1 text-muted-foreground` und `text-sm` ohne Regel.
- **Loesung:** `PageHeader subtitle="..."` standardisiert `mt-1 text-sm md:text-base`.

### 3.7 Empty-States
- Es existiert `components/ui/empty-state.tsx`, wird aber nur in ~15% der Seiten benutzt. Rest: inline `<p>`-Fallbacks oder gar nichts.

---

## 4. Design-Standards (neu — implementiert in dieser Runde)

### 4.1 Komponenten
- `src/components/admin/page-shell.tsx` — `PageHeader`, `PageSection`, `PageGrid`, `StatCard`, `Breadcrumbs`, `PageContainer`, `QuickAction`.
- `src/components/app/page-shell.tsx` — Re-export derselben Komponenten fuer Pflegekraft-Bereich.
- `src/components/ui/data-table.tsx` — generische Tabelle mit Sort, Filter, Pagination, Export, Bulk-Actions, Empty-State.

### 4.2 Regeln
1. **Jede Seite** startet mit `<PageContainer>` → `<PageHeader>` → mindestens eine `<PageSection>`.
2. **KPI-Bloecke** verwenden `<PageGrid columns={4}>` mit `<StatCard>`. Handgemalte Tiles sind verboten.
3. **Listen** verwenden `<DataTable>`. Keine eigenen `<table>` ausser bei sehr spezifischen Formen (z.B. Pivot).
4. **Detail-Seiten** haben `breadcrumbs` im PageHeader.
5. **Empty-States** immer via `<EmptyState>` — niemals inline `<p>Keine Daten</p>`.

### 4.3 Informations-Dichte
- Dashboards: mindestens **4 KPIs + 2 Sections + Quick-Actions**.
- Rollen-Dashboards: **Heute-Block**, **Woche-Block**, **Benachrichtigungen/Todos**.
- Sparklines fuer alle KPIs, die Zeitreihen-Sinn ergeben.

---

## 5. Top-20 Dashboards fuer Enrichment (Phase 3)

Pro Rolle 4–5 Dashboards mit echten Daten, KPIs, Quick-Actions.

**Pflegekraft (`/app/*`)** — 4
1. `/app` — Heute-Dashboard (Schicht, KPIs, Bewohner, offene Aufgaben, Dienstplan-Woche)
2. `/app/handover` — Schichtuebergabe (bleibt Form, kriegt Context-Sidebar)
3. `/app/notifications` — Benachrichtigungen mit Filter
4. `/app/zeiterfassung` — Stempel-UI + Woche

**PDL / Admin (`/admin/*`)** — 5
5. `/admin` — Einrichtung heute, QI, Personal, MDK-Termine
6. `/admin/residents` — DataTable + Kpi-Header
7. `/admin/staff` — DataTable + Kpi-Header
8. `/admin/audit` — DataTable mit Filter
9. `/admin/dsgvo` — DataTable + Header

**Owner (`/owner/*`)** — 4
10. `/owner` — Cockpit mit Sparklines (verfeinern)
11. `/owner/tenants` — DataTable
12. `/owner/users` — DataTable
13. `/owner/leads` — DataTable

**Gruppe (`/gruppe/*`)** — 3
14. `/gruppe` — Multi-Site Dashboard
15. `/gruppe/einrichtungen` — DataTable
16. `/gruppe/kpi-vergleich` — Vergleich-Ansicht mit StatCard

**Partner (`/partner/(portal)/*`)** — 2
17. `/partner/(portal)/dashboard` — Partner-KPIs
18. `/partner/(portal)/leads` — DataTable

**LMS/Family** — 2
19. `/lms/dashboard` — Lern-KPIs
20. `/family` — Angehoerigen-Hub

---

## 6. Out of Scope (andere Agents)

- `src/app/admin/exports/*` (Route-Integrity-Agent)
- `src/app/app/expertenstandards/*`, `src/app/app/pflegediagnosen/*` (Competitor-Agent)
- Auth-Code (`src/app/(auth)/**`, `src/lib/auth.ts`)
- Marketing-Seiten (`src/app/(marketing)/**`)

---

## 7. Naechste Schritte

- Phase 2 (Shell-Components): **ERLEDIGT** — `page-shell.tsx` + `data-table.tsx`.
- Phase 3 (Dashboards): zu migrieren pro Rolle.
- Phase 4 (Tabellen): via `DataTable` — `residents`, `staff`, `audit`, `leads`, `tenants`, `users`.
- Phase 5 (Detail-Seiten): Breadcrumbs + PageHeader ergaenzen.

Stand: 2026-04-18, Commit 1 (Shell-Components).
