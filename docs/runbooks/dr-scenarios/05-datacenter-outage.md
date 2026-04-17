# Szenario 5 — Komplett-Rechenzentrumsausfall

**RTO:** 6h  | **RPO:** 15 Min.
**Tabletop-Dauer:** 3h (inkl. tatsächliches Failover in Staging).

## Trigger-Signal
- Hetzner-/AWS-Region komplett offline (Netzwerk + Compute + Storage).
- Medienmeldungen über Brand, Stromausfall, physische Katastrophe.
- Multi-AZ-Alerts gleichzeitig red.
- Provider-Statuspage bestätigt Major-Incident.

## Rollen
- **IC** (CTO)
- **Tech-Lead** (SRE-Team-Lead)
- **Comms-Lead**
- **Legal/DPO** (Availability ist DSGVO-Schutzziel)
- **Finance-Lead** (Provider-Entschädigungen, Zusatzkosten genehmigen)

## Erste-Reaktions-Schritte

| Zeit | Aktion | Verantwortlich |
|------|--------|----------------|
| T+0   | Multi-Region-Health-Checks bestätigen Totalausfall | On-Call-SRE |
| T+10  | Incident als "Sev0 Major" klassifizieren | IC |
| T+15  | Statuspage: "Major Outage — Multi-Region Failover initiiert" | Comms |
| T+20  | DR-Region aktivieren (Passive → Active) | Tech-Lead |
| T+30  | DNS-TTL schon niedrig — GeoDNS-Failover auslösen | Tech-Lead |
| T+60  | Erste Health-Checks in DR-Region grün | Tech-Lead |
| T+120 | Alle Kernfeatures verifiziert, Traffic 100% in DR | Tech-Lead |

## Technische Recovery-Schritte

1. **Pre-Check DR-Region:** Letzte erfolgreiche Drill-Log, Daten-Aktualität (< 15 Min).
2. **Traffic-Umleitung:** Route 53 / Cloudflare Failover-Policy.
3. **DB-Promotion:** Streaming-Replica in DR-Region als neue Primary promoten.
4. **App-Rollout:** Kubernetes-Cluster in DR hochfahren (war warm-standby mit 20% Kapazität).
5. **Scale-Up:** HPA-Targets erhöhen, zusätzliche Nodes provisionieren.
6. **Objekt-Storage:** S3 Cross-Region-Replication war aktiv; Bucket-Redirect schalten.
7. **Smoke-Tests:** Kanari-Kunde pro Segment (Heim, Ambulant, Krankenhaus).
8. **Observability:** Metriken+Logs+Traces in DR-Region aktiv, Dashboards aktualisiert.

## Degraded-Mode-Features (wenn DR-Region überlastet)

- **Ein:** Core-Dokumentation, Login, Read-Only-Dashboards.
- **Aus (temp):** Voice-to-Text (teure Compute), Analytics-Jobs, Backfill-Imports, KI-Summaries.
- Kommuniziert auf Statuspage als "degraded performance".

## Kommunikations-Plan

- **T+0:** Statuspage.
- **T+15:** Twitter/LinkedIn: "Wir sind auf Major-Incident, arbeiten an Failover."
- **T+30:** E-Mail an alle Primärkontakte.
- **T+60:** Update: "Service teilweise wiederhergestellt via DR."
- **T+360:** "Fully restored, Post-Mortem folgt."
- **Behörden:** Bei > 24h Ausfall evtl. DSGVO-Availability-Melding (Einzelfall prüfen).

## Tabletop-Injects

| Zeit | Inject | Erwartete Reaktion |
|------|--------|-------------------|
| T+0   | "Hetzner FSN1 komplett offline, Brand gemeldet" | Failover-Entscheidung |
| T+15  | "DR-Region DB hat 12 Min Replication-Lag" | 15 Min RPO akzeptabel → Failover |
| T+30  | "DR-Region hat nur 30% Kapazität aktiv" | Scale-up, degraded mode kommunizieren |
| T+60  | "Pressesprecher von ORF ruft an" | Comms übernimmt, sachliches Statement |
| T+120 | "Ein Kunde droht, zu Konkurrenz zu wechseln" | CSM nimmt Einzelgespräch, Credit anbieten |
| T+240 | "Provider meldet: Region in 8h zurück" | Rückfahr-Plan: kontrolliert, nicht hektisch |

## Abschluss-Debrief

- War das warm-Standby wirklich warm?
- Wie lang war echter TTR vs. Ziel-RTO?
- Welche Kosten entstanden (Scale-up in DR)?
- Wann fahren wir zurück, Kriterien?
