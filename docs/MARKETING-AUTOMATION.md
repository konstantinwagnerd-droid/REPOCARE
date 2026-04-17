# Marketing-Automation

## Zweck

Trigger-basierte Email-Flows, die Leads automatisch durch definierte Sequenzen führen — ohne manuelle Marketing-Intervention.

## Architektur

```
src/lib/marketing-automation/
├── types.ts         Flow, Trigger, Step, Condition, Lead, FlowStats
├── flows.ts         5 pre-seeded Flows
├── conditions.ts    Event-basierte Bedingungs-Auswertung
└── scheduler.ts     In-Memory Scheduler mit tick()-Loop
```

## Die 5 Flows

### 1. Demo-Anfrage Follow-up (7 Tage, 5 Emails)

| T | Template | Zweck |
|---|----------|-------|
| T0 | `demo-confirmation` | Bestätigung + Kalender-Link |
| T+1 | `demo-reminder` | Nur wenn Bestätigung nicht geöffnet |
| T+3 | `pilot-kit` | Pilot-Kit-PDF |
| T+5 | `soft-reminder` | Nach Demo — nur wenn attended |
| T+7 | `demo-recap` | Wie geht's weiter? (+ A/B auf Subject) |

### 2. Whitepaper-Download Nurture (21 Tage, 4 Emails)

T0 Delivery → T+3 Case-Study → T+10 Deep-Dive → T+21 Soft-Demo-Offer.

### 3. Trial-Signup Onboarding (14 Tage, 6 Emails)

T0 Welcome → T+1 First-Task → T+3 Voice-Guide → T+7 Mid-Check (condition: trial-activated) → T+12 Conversion-Offer → T+14 Expiry.

### 4. Stale-Lead Reactivation (14 Tage ab Inaktivität ≥ 90 Tage, 3 Emails)

T0 Soft → T+7 Value → T+14 Final.

### 5. Customer-Onboarding (30 Tage post-Signup, 8 Emails)

Welcome → Checklist → First Win → Advanced → Team-Rollout → Integrations → Review → CSM-Intro.

## Conditions

Ein Step wird nur gesendet, wenn seine optionale `condition` erfüllt ist:

| Condition | Trigger |
|-----------|---------|
| `email-opened` | Event `email-opened` mit passendem Subject-Fragment |
| `link-clicked` | Event `link-clicked` mit passendem href-Fragment |
| `demo-attended` | Event `demo-attended` (wird von Fathom-Integration gesetzt) |
| `trial-activated` | Event `trial-activated` (beim ersten Login nach Signup) |

## A/B-Test-Integration

Steps können ein `subjectExperiment` setzen. Der Scheduler delegiert die Subject-Line-Auswahl an das A/B-Framework (siehe `docs/AB-TESTING.md`). Beispiel im Demo-Flow: `demo-recap` verwendet Experiment `demo-recap-subject`.

## Scheduler-Tick

```ts
// Aufruf aus Cron (stündlich):
const sends = await marketingScheduler.tick();
```

Der Scheduler iteriert aktive Leads, prüft `delayDays` und `condition`, ruft `deliver(lead, flow, step)`, increment­iert `stepIndex`. Wenn `stepIndex >= flow.steps.length` → `completed = true`.

## Admin-UI

- `/admin/marketing-automation` — Flow-Liste mit aktiven Leads, Open-/Click-Rate
- `/admin/marketing-automation/[flow]` — Flow-Details mit Schritt-Visualisierung

## Delivery-Hook

`marketingScheduler.deliver` ist aktuell ein No-Op, der nur `email-sent`-Events protokolliert. Zum Produktiv-Schalten:

```ts
import { marketingScheduler } from "@/lib/marketing-automation/scheduler";
import { sendTemplatedEmail } from "@/lib/email-transport";

marketingScheduler.deliver = async (lead, flow, step) => {
  await sendTemplatedEmail({
    to: lead.email,
    template: step.template,
    subject: step.subjectOverride,
    vars: { name: lead.name, flowId: flow.id },
  });
  lead.events.push({ at: new Date().toISOString(), kind: "email-sent" });
};
```

## Persistenz

- Aktuell In-Memory (Restart-Verlust).
- Migration auf Drizzle/SQLite geplant — Schema: `marketing_leads`, `marketing_events`, Indizes auf `flow_id`, `completed`.

## DSGVO

- Opt-in-Trigger ausschließlich nach explizitem Consent (Demo-Formular, Whitepaper-Download etc.).
- Opt-out-Link in jeder Email (Standard-Footer via `email-transport`).
- `marketingScheduler.recordEvent(leadId, "unsubscribed")` stoppt den Flow automatisch (siehe conditions — TBD: globaler Opt-out-Check in tick()).
- Lead-Daten bei Löschantrag: Hard-Delete aus `leadStore` + entsprechende Audit-Trail-Einträge.
