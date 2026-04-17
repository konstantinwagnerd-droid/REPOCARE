# Ticket-Kategorisierung — CareAI Support

Labels und Priorisierungsmatrix. Konsistenz ist wichtiger als Perfektion.

## Label-Schema

Jedes Ticket hat **mindestens 3 Labels**: Typ, Severity, Bereich.

### Typ (genau 1)

- `type:bug` — Etwas funktioniert nicht wie dokumentiert.
- `type:feature` — Neuer Wunsch, Erweiterung.
- `type:question` — Kunde fragt, Antwort aus FAQ/Docs ableitbar.
- `type:compliance` — DSGVO, MD-Prüfung, Aufbewahrung.
- `type:onboarding` — Neue Kund:innen, Setup-Hilfe.
- `type:billing` — Rechnung, Tarif, Kündigung.
- `type:integration` — Schnittstellen, APIs, Alt-System.
- `type:incident` — aktive Störung.
- `type:feedback` — Lob, Kritik, Umfrage-Rückmeldung.

### Severity (genau 1)

Siehe `playbook.md` für SLAs. Regel: lieber höher setzen, Dispatcher kann herabstufen.

- `sev:1` — Service nicht nutzbar, Daten-Risiko, akute MD-Prüfung.
- `sev:2` — Kernfeature kaputt, Workaround möglich.
- `sev:3` — Lästig, nicht blockierend.
- `sev:4` — Question / Feature / Kosmetik.

### Bereich (1 oder 2)

- `area:auth` — Login, MFA, Sessions.
- `area:voice` — Spracheingabe.
- `area:mobile` — iOS / Android.
- `area:web` — Browser-App.
- `area:export` — PDF, CSV, MD-Paket.
- `area:sync` — Offline-Sync.
- `area:rbac` — Berechtigungen.
- `area:ki` — KI-Features (Summary, Vorschläge, Anomalie).
- `area:ops` — Infrastruktur, Uptime.
- `area:integrations` — Drittsysteme.

### Optionale Meta-Labels

- `vip` — strategisch wichtiger Kunde (Top 10 ARR).
- `churn-risk` — Kunde hat Kündigung angedeutet.
- `press-risk` — kommunikationsrelevant.
- `blocker:md-prüfung` — MD-Termin < 7 Tage.
- `first-response-missed` — SLA-Verletzung First-Response.

## Priorisierungs-Matrix (Impact × Frequency)

Wenn Severity unklar, diese Matrix nutzen:

|                       | Niedrig-Frequency (1 Ticket) | Mittel (2–5 Tickets) | Hoch (6+ Tickets) |
|-----------------------|------------------------------|----------------------|-------------------|
| **Niedriger Impact**   | Sev 4 | Sev 3 | Sev 3 |
| **Mittlerer Impact**   | Sev 3 | Sev 2 | Sev 2 |
| **Hoher Impact**       | Sev 2 | Sev 1 | Sev 1 |
| **Kritisch (Safety)**  | Sev 1 | Sev 1 | Sev 1 |

**Impact-Definition:**
- Niedrig: Einzelner Workflow-Umweg.
- Mittel: Feature-Teilfunktion nicht nutzbar, Arbeitsstunden-Verlust messbar.
- Hoch: Kernfeature aus, ganze Dienstplan-Schicht betroffen.
- Kritisch: Patientensicherheit, Medikations-Features, Alarm-Features.

## Auto-Labeling-Hinweise

- Betreff enthält "Passwort" → `area:auth`, `sev:3` default.
- Anhang mit Screenshot + Wort "crash" → `type:bug`, `sev:2` default.
- E-Mail-Domain `*.amts-*`, `*.bundes-*` → wahrscheinlich Behörde, `vip` setzen.
- Ticket > 5 Nachrichten ohne Resolution → `escalate` Flag.

## Routing-Regeln

| Trigger | Ziel |
|---------|------|
| `type:compliance` + DSGVO-Keywords | DPO-Queue |
| `type:incident` + `sev:1` | Eng-On-Call direkt (PagerDuty) |
| `area:voice` | Voice-Spezialist-Team |
| `area:integrations` | Integrations-Engineer |
| `type:billing` | Finance/Billing-Team |
| Alles andere | L1-Queue (FIFO mit Severity-Priorität) |

## Reporting-Felder (wöchentlich)

- Tickets nach Typ/Bereich
- SLA-Erfüllungsrate pro Severity
- Top-5-Bereiche nach Volumen
- NPS / CSAT pro Bereich
- Anteil First-Response-Verletzungen
- Re-Opens (Tickets, die nach Close neu aufgehen)

## Review-Kadenz

- **Täglich 09:00:** Queue-Review, Backlog-Älteste Tickets.
- **Wöchentlich Montag:** KPIs + Themen-Trends.
- **Monatlich:** Label-Hygiene, neue Kategorien prüfen.
