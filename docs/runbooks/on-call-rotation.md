# On-Call-Rotation — CareAI

**Ziel:** 24/7-Verfügbarkeit ohne Burnout. Rotationen sind fair, vergütet, predictable.
**Tool:** PagerDuty (primär) + Telegram-Fallback + Opsgenie-Mirror als Backup.

## Rotations-Plan

### Primäres Team (4 SRE)
- **Woche 1:** SRE-A primär, SRE-B sekundär.
- **Woche 2:** SRE-B primär, SRE-C sekundär.
- **Woche 3:** SRE-C primär, SRE-D sekundär.
- **Woche 4:** SRE-D primär, SRE-A sekundär.

Jeder SRE hat also **1 Woche Primary + 1 Woche Secondary pro Monat + 2 Wochen Freiraum**.

### Sekundäre Eskalation
- **IC-Pool:** CTO + Head of Engineering. Rotation Monat für Monat.
- **Domänen-Experten on-demand:** DB-Expert:in, Frontend-Lead, Mobile-Lead, Security-Lead.

## Schichten innerhalb der Woche

- **Business-Hours (Mo–Fr 08:00–18:00):** normale Erreichbarkeit via Slack; Pager muted.
- **After-Hours (Mo–Fr 18:00–08:00, Wochenende, Feiertage):** Pager aktiv.
- **Deep-Night (23:00–06:00):** nur Sev1/Sev2 weckt, Sev3/Sev4 parkt bis 07:00.

## Eskalations-Tree

```
Alert → Primary On-Call (PagerDuty)
        ├─ ACK in 5 Min? ja → weitermachen
        └─ keine ACK → T+5: Secondary On-Call
                       ├─ ACK? ja → weitermachen
                       └─ keine ACK → T+10: IC-Pool (CTO)
                                       └─ T+15: Emergency-All-Hands Telegram
```

Parallel bei Sev1:
- T+0 Telegram-Broadcast `@careai-sev1-broadcast`
- T+0 automatischer SMS-Fallback (Twilio) an Primary-Telefon

## Wake-up-Policy

- **Sev1 (Service down, Data Breach Verdacht):** weckt sofort, auch 3 Uhr morgens.
- **Sev2 (degraded, kein Workaround):** weckt bis 23:00, danach bis 06:00.
- **Sev3 (Workaround möglich):** Business-Hours only.
- **Sev4 (Kosmetik):** nicht On-Call-relevant, normaler Backlog.

**Rule of Thumb:** "Weckt das einen Kunden auf?" → dann weckt es auch uns.

## Schlaf-Vergütung

Inspiriert von österreichischer Rufbereitschafts-Regelung + Best Practice Tech-Unternehmen:

| Situation | Vergütung |
|-----------|-----------|
| Rufbereitschaft-Pauschale (pro Woche) | EUR 300 brutto |
| Pro aktiven Incident ausserhalb Dienstzeit | EUR 100 pauschal |
| Incident > 2h zwischen 23:00–06:00 | +EUR 150 "Schlaf-kaputt-Bonus" |
| Kompensations-Urlaub für Nacht-Incident | 1 ganzer Tag frei, binnen 2 Wochen einlösbar |
| Monatliche Vergütung Primary-Primary (worst case) | mind. EUR 600 garantiert |

**Prinzip:** Keine:r macht On-Call umsonst. Keiner verliert echten Schlaf ohne Ausgleich.

## Handover-Ritual

Jeden Montag 10:00, 15 Min:
- Outgoing On-Call übergibt offene Tickets, laufende Themen, Sonder-Beobachtungspunkte.
- Incoming bestätigt Zugriffe (PagerDuty, VPN, 1Password, Sudo).
- Kurzer "No-Fire-Check": was ist aktuell fragil?

## Pager-Hygiene

- **Alert-Budget:** max. 2 Pager-Alerts pro Nacht pro Primary. Mehr = Retro + Alert-Quality-Fix.
- **Actionable-Kriterium:** jeder Alert muss zu "ich muss JETZT was tun" führen, sonst → Dashboard.
- **Monatliches Alert-Review:** welche Alerts feuern, wie oft, welche Noise?

## Emergency-Kontakte (offline ausgedruckt im Office)

| Rolle | Name | Telefon | Backup |
|-------|------|---------|--------|
| CEO | Konstantin | +43 XXX | … |
| CTO | … | … | … |
| DPO | … | … | … |
| Legal (extern) | Kanzlei XYZ | … | … |
| IR-Firma | … | 24/7-Line | … |
| Datenschutzbehörde | DSB Österreich | +43 1 52 152 0 | dsb@dsb.gv.at |

## Onboarding neuer On-Call

Vor erster aktiver Rotation:
- [ ] Zugänge: PagerDuty, Slack War-Room, VPN, 1Password, Sudo auf Prod-Hosts.
- [ ] Shadow 2 Wochen: schaut einfach nur zu, bekommt jeden Alert parallel aber darf nicht allein handeln.
- [ ] 1 Tabletop gespielt.
- [ ] 1 Runbook selbst durchlaufen (z.B. DB-Failover in Staging).
- [ ] Buddy zugeordnet für erste 4 Wochen.
