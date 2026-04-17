# Customer-Support-Playbook — CareAI

**Mission:** Pflegekräfte haben kein Reservebudget für Frust. Unser Support ist schnell, empathisch, kompetent.
**Kanäle:** E-Mail (support@careai.at), In-App-Chat, Telefon-Hotline, Slack Shared Channel für Enterprise.
**Sprachen:** Deutsch (primär), Englisch (sekundär).

## Support-Tiers

### L1 — First Response & Triage
- **Wer:** Customer-Success-Specialist:innen (nicht-technisch, aber Produkt-expert:innen).
- **Aufgaben:**
  - Erste Antwort innerhalb SLA.
  - FAQ-Abgleich, Canned-Responses anwenden.
  - Troubleshooting-Guide abarbeiten.
  - Ticket kategorisieren und zuweisen.
- **Eskalation an L2:** wenn Bug reproduzierbar, unklare technische Symptome, Integration-Fehler.

### L2 — Technical Support
- **Wer:** Senior-CS + dedizierte Support-Engineer:innen.
- **Aufgaben:**
  - Bug-Reproduktion in Staging.
  - Log-Analyse, Detail-Diagnose.
  - Workarounds dokumentieren.
  - Bug-Reports mit vollem Kontext an Produkt/Eng weitergeben.
- **Eskalation an L3:** wenn Produkt-Bug bestätigt und Code-Fix nötig, oder Infrastruktur-Incident.

### L3 — Engineer On-Call
- **Wer:** Product-Engineers + SRE.
- **Aufgaben:**
  - Root-Cause-Analyse.
  - Hotfix + Deployment.
  - Post-Mortem bei Sev1.
- **Eskalation an IC/CTO:** bei Sev1-Incidents, Datenverlust-Risiko, rechtlich sensiblen Fällen.

## SLAs nach Severity

| Severity | Definition | Erst-Antwort | Update-Kadenz | Resolution-Ziel |
|----------|------------|--------------|---------------|-----------------|
| **Sev 1** | Service nicht nutzbar / Data-Breach-Verdacht / MD-Prüfung blockiert | **1h** (24/7) | alle 30 Min | 4h |
| **Sev 2** | Kernfeature kaputt, Workaround möglich | **4h** (Business-Hours) | alle 4h | 2 Werktage |
| **Sev 3** | Lästiges Problem, nicht blockierend | **24h** | täglich | 10 Werktage |
| **Sev 4** | Question, Feature-Request, Kosmetik | **72h** | nach Bedarf | nach Roadmap |

## Ticket-Lifecycle

```
Neu → Triaged → In-Progress → Waiting-For-Customer ↔ In-Progress → Resolved → Closed
                     ↓
                 Escalated (L2/L3)
```

- Ein Ticket darf max. 5 Werktage in "Waiting-For-Customer" bleiben, danach nachhaken, sonst Auto-Close mit Reopen-Möglichkeit.
- Nach "Resolved" → Kunde hat 3 Werktage zum Widerspruch, dann Auto-Close.

## Qualitätsmaßstäbe

- **First-Response-Zeit:** im SLA bei > 95% der Tickets.
- **CSAT:** Ziel > 4,5 von 5 (Post-Ticket-Umfrage).
- **Erstlösungsquote:** > 60% der L1-Tickets ohne Eskalation.
- **Backlog-Alter:** kein Ticket älter als 10 Werktage ohne Update.

## Empathie-Regeln (non-negotiable)

- **Pflegekräfte sind gestresst, nicht dumm.** Keine Ungeduld, keine "RTFM"-Haltung.
- **Keine Fachbegriffe ohne Erklärung.** "Cache leeren" → "Bitte tippen Sie unten rechts auf das Zahnrad und dann auf 'App neu laden'."
- **Immer mit dem Namen anreden.** "Hallo Frau Huber" — nicht "Sehr geehrte Damen und Herren".
- **Schuldlose Sprache.** "Das ist ein Bug bei uns, wir kümmern uns" — nicht "Sie haben vermutlich…"
- **Response innerhalb 10 Min bestätigen**, auch wenn Lösung länger dauert.

## Eskalations-Regeln

Immer eskalieren bei:
- Hinweis auf Datenschutz-Verletzung (→ DPO)
- Kunde droht mit Kündigung (→ CSM + Head-of-CS)
- Presse-/Social-Media-Risiko (→ Comms)
- MD-Prüfung akut bevorstehend (→ Sev1 unabhängig von Impact)
- Health-Safety-Impact (Medikation, Notfall-Features, Alarme) (→ Sev1)

## Tools

- **Ticketing:** Linear (integriert mit GitHub Issues für Eng).
- **Chat:** Intercom (In-App) + Slack Connect (Enterprise-Shared-Channel).
- **Knowledge-Base:** intern Notion, extern help.careai.at.
- **Call-System:** Aircall (Hotline mit Voicemail-Transkription).
- **Status:** status.careai.at (public).

## Siehe auch
- `faq.md` — 30 häufige Fragen
- `canned-responses.md` — 20 vorformulierte Antworten
- `troubleshooting-tree.md` — Diagnose-Entscheidungsbäume
- `ticket-categorization.md` — Label & Priorisierungs-Matrix
