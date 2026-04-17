# Disaster-Recovery-Drill — CareAI

**Frequenz:** Vierteljährlich (Q1/Q2/Q3/Q4), jeweils 3h Tabletop + 2h technisches Recovery.
**Owner:** CTO + Head of SRE.
**Teilnehmer:** Incident-Commander (IC), Tech-Lead, Comms-Lead, Legal/DPO, Produkt-Lead.
**Ziel:** Belastbarkeit der Recovery-Prozesse, RTO/RPO-Validierung, Muscle-Memory des Teams.

## Übersicht der 5 Szenarien

| # | Szenario | RTO-Ziel | RPO-Ziel | Häufigkeit realistisch |
|---|----------|----------|----------|------------------------|
| 1 | Datenbank-Ausfall (PG-Primary down) | 2h | 15 Min | 1–2x/Jahr |
| 2 | Ransomware-Angriff auf Volumes | 24h | 4h | seltene Ausnahme |
| 3 | Data-Breach (DSGVO Art. 33/34) | 72h Meldung | n/a | kritisch, 1–3x je 100 Kund:innen |
| 4 | Sabotage durch internen User | 4h | 1h | selten, aber hohe Impact |
| 5 | Komplett-Rechenzentrumsausfall | 6h | 15 Min | einmalig pro Dekade |

## Gemeinsame Erste-Reaktions-Checkliste (alle Szenarien)

1. **T+0 (Minute 0):** Alert-Empfänger bestätigt im PagerDuty; automatischer Post in `#incident-war-room`.
2. **T+5:** Incident-Commander übernimmt (benannt via On-Call-Rotation).
3. **T+10:** Severity-Klassifikation (Sev1–Sev4), initialer Status in Statuspage.
4. **T+15:** Comms-Lead aktiviert, Legal/DPO benachrichtigt bei personenbezogenen Daten.
5. **T+30:** Erste externe Kommunikation (falls Kund:innen betroffen).
6. **Laufend:** Timeline in Incident-Doc, alle 30 Min Update im War-Room.

## Post-Mortem-Template (Blameless)

```markdown
# Post-Mortem: [Incident-Name]
**Datum:** YYYY-MM-DD
**Dauer:** XX Min  | **Severity:** SevN
**Incident-Commander:** Name

## Zusammenfassung
Drei Sätze. Was ist passiert, was war der Impact, wie wurde es gelöst.

## Impact
- Betroffene Kund:innen: X
- Betroffene Datensätze: Y
- Service-Ausfall: Z Min
- Finanzieller Impact: EUR

## Timeline
| Zeit | Ereignis | Aktion |
|------|----------|--------|
| T+0  | …        | …      |

## Root Cause
Kausalkette (5 Whys).

## Was lief gut
- …

## Was lief schlecht
- …

## Action Items
| # | Item | Owner | Due | Status |
|---|------|-------|-----|--------|
| 1 | …   | …     | …   | …      |

## Unterschrift
IC: ______   CTO: ______   DPO (bei DSGVO): ______
```

## Kadenz

- **Q1 / Q3:** Volles Tabletop + technisches Failover (Szenario 1 oder 5)
- **Q2 / Q4:** Tabletop-only (Szenario 2, 3 oder 4)
- Nach jedem Drill: Retro innerhalb 5 Werktagen, Action-Items ins Quartals-OKR.

Siehe `dr-scenarios/` für Szenario-spezifische Tabletop-Scripts.
