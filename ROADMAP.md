# CareAI Roadmap (18 Monate)

Lebendes Dokument — zuletzt aktualisiert: 2026-04-17.

---

## Q2 2026 (Apr–Jun) — Pilot + Fundament

**Ziel:** 3 produktive Pilot-Einrichtungen in Wien, Whisper live, erste echte MDK-Prüfung überstanden.

- **Pilot-Rollout** mit 3 Wiener Pflegeheimen (je 60–120 Bewohner)
- **Whisper/Claude Voice-Integration** — Migration vom Mock zum produktiven Transkript
- **ELGA Phase 1** — Lesezugriff auf e-Medikation und e-Befund
- **Feedback-Loop** — wöchentliche Reviews mit PDLs der Pilot-Häuser
- **aws Preseed** abgeschlossen, Disbursement Tranche 1
- **GmbH-Gründung** + erste Festanstellung (Head of Sales AT)
- **DSFA** (Datenschutz-Folgenabschätzung) formal abgenommen

**Output-Metriken:**
- Time-to-Document: −45 % gegenüber Papier/Legacy
- MDK-Prüfungs-Readiness-Score > 92 %
- NPS der Pflegekräfte > 35

---

## Q3 2026 (Jul–Sep) — Skalierung AT + Clinical Kick-off

**Ziel:** 10+ Einrichtungen in Österreich, Clinical-Validation-Studie gestartet, Vertrieb professionalisiert.

- **Österreich-Rollout** auf mind. 10 Einrichtungen (Kooperation mit Diakonie/Caritas-Verbänden)
- **ISO 27001 Stage 1** — Zertifizierungsaudit
- **KIM-Anbindung** (Kommunikation im Medizinwesen) in Feldtest
- **Multi-Tenant Benchmark-Produkt** — anonymisierte Cross-Facility-KPIs als Upsell
- **Clinical-Validation-Studie Start** — N=150 Bewohner:innen über 3 Pilot-Heime, 12 Monate Laufzeit (Protokoll in `docs/clinical/`)
- **CE-MDR Schritt 1** — Risk-File + Clinical-Evaluation-Plan final (Templates in `docs/regulatory/`)
- **A/B-Testing-Rollout** — erste 5 Live-Experiments auf Marketing-Seiten + Onboarding
- **Sales Enablement** — Demo-Infrastruktur, Battlecards, Preis-Kalkulator
- **Public Roadmap** auf careai.at live
- **Team:** +2 Software Engineers, +1 Customer Success Lead, +1 Regulatory Affairs Manager (Teilzeit)

---

## Q4 2026 (Okt–Dez) — DACH + EU-Expansion Go-Live

**Ziel:** Eintritt in Deutschland, EU-Sprachen live, Seed-Runde, regulatorisches Upgrade.

- **Deutschland-Eintritt** — je ein Pilot in Bayern und NRW
- **EU-Expansion produktiv** — FR, IT, ES Marketing-Sites live (bereits technisch fertig, jetzt Content-Lokalisierung + SEA)
- **Marketing-Automation-Rollout** — 4 produktive Flows (Trial-Onboarding, Re-Engagement, NPS-Follow-up, Partner-Nurturing)
- **CRM-Sync live** mit HubSpot produktiv (Vertrieb AT/DE synchronisiert)
- **Seed-Runde** 2,5 M€ — Lead + 2 Co-Investoren
- **KIM-Anbindung live** (inkl. eArztbrief, eMedikationsplan)
- **DTA § 302 SGB V** — Abrechnung mit Pflegekassen (DE) produktiv
- **Clinical-Validation-Studie** — Zwischenauswertung N=75
- **Inflation-Award** / Gütesiegel-Bewerbungen (Deutscher Pflegepreis, AAL-Award)
- **Team:** +3 Engineers, +1 Compliance Officer

---

## Q1 2027 (Jan–Mär) — Compliance-Upgrade

**Ziel:** EU AI Act Hochrisiko-Zertifizierung, Enterprise-Ready, CE-Mark Einreichung.

- **EU-AI-Act-Hochrisiko-Zertifizierung Phase 2** (Notified Body Audit)
- **ISO 13485** (Medizinprodukte-QMS) — Readiness-Audit
- **CE-MDR Einreichung** — Technische Dokumentation komplett an Benannte Stelle
- **Clinical-Validation-Studie Abschluss** — N=150 Endauswertung + Publikation im Peer-Review
- **SSO / SAML / OIDC** für Enterprise-Kund:innen
- **SOC 2 Type 1** Start
- **Multi-Einrichtungs-Konzern-Dashboard** als Premium-Tier
- **API-Marketplace** für Drittanbieter (LIMS, Apotheken, Therapeut:innen)

---

## Q2 2027 (Apr–Jun) — Schweiz + ambulant

**Ziel:** CH-Launch, ambulante Segmente erschließen.

- **Schweiz-Launch** — Kooperation mit Spitex-Verbänden
- **ambulant-mobile App** — optimiert für Sozialstationen, GPS-Tracking, Tourenplanung
- **FHIR R5 Upgrade** auf Server-Seite
- **Wundverlauf-Zeitraffer v2** mit automatischer Flächenmessung (Computer Vision)
- **Öffentliche Developer-Dokumentation**

---

## Q3 2027 (Jul–Sep) — Series A Readiness + CE-Mark Erteilung

**Ziel:** 100+ Einrichtungen im Portfolio, CE-Mark erteilt, Series-A-Reife.

- **CE-Mark erteilt** (ca. 18 Monate nach Start Wave 12c) → Verkauf als Medizinprodukt Klasse IIa möglich
- **100+ aktive Einrichtungen** DACH-weit
- **ARR 2,5–4 M€**
- **Series A** Vorbereitung (Data-Room-Refresh, Metriken-Dashboards, Investorenliste)
- **Telemedizin** produktiv mit mind. 3 Partner-Praxen
- **KI-Modell-Feintuning** auf anonymisierten Pflege-Korpus

---

## CE-Mark-Timeline (18 Monate, Wave 12c → Q3 2027)

| Phase | Zeitraum | Inhalt |
|---|---|---|
| 0 | 2026-04 (Wave 12c) | Risk-File + Clinical-Evaluation-Plan als Templates aufgesetzt (`docs/regulatory/`) |
| 1 | 2026 Q3 | Clinical-Validation-Studie Start (N=150, 3 Heime) |
| 2 | 2026 Q4 | Zwischenauswertung N=75, Technical File v1 |
| 3 | 2027 Q1 | Studien-Abschluss + Einreichung bei Benannter Stelle |
| 4 | 2027 Q2 | Audit durch Benannte Stelle + Nachbesserungen |
| 5 | 2027 Q3 | **CE-Mark erteilt** → Markteinführung als Medizinprodukt Klasse IIa |

---

## Technische Schulden (rolling)

Nicht quartalsgebunden, wird parallel abgebaut:

- Mobile-Apps von Expo Alpha → Beta-Releases via TestFlight/Google Play
- Unused-Imports-Audit (aktuell einige `_unused`-Warnings im Lint)
- Knowledge-Graph von Stub → produktiv
- Integration Stubs (ELGA, DTA, KIM) schrittweise verproben
- Incident-Post-Mortem-Template tiefer integrieren
- i18n-Vorbereitung (derzeit nur `de-AT`, später `de-DE`, `de-CH`, evtl. EN für Export)

---

## Grundsätze

- **Human-in-the-Loop bleibt immer aktiv** — wir bauen keine Voll-Automatisierung in klinischen Entscheidungen.
- **Datenhaltung in der EU** — ausschließlich EU-Regionen bei Hyperscalern (Frankfurt, Wien).
- **Open-Source-freundlich** — wo möglich, Beiträge zurückgeben; proprietär bleibt der Pflege-Kontext.
- **Keine Dark Patterns** — wir verkaufen Entlastung, nicht Sucht.
