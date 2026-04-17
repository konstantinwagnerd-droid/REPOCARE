# 8-Wochen-Rollout-Fahrplan — CareAI

Realistischer, erprobter Pilotplan für Einrichtungen von 50–200 Betten.

**Voraussetzungen:**
- Interne:r Projekt-Ansprechpartner:in (meist PDL oder QMB) benannt.
- IT-Grundstruktur: WLAN in allen Wohnbereichen, 1 Tablet pro 15 Betten (oder Pflegekraft-Smartphones).
- Daten-Dump aus Altsystem zugänglich (CSV / Schnittstelle).

---

## Woche 1 — Kick-off & Stammdaten

**Montag**
- Kick-off-Workshop (3h vor Ort): CareAI-Team trifft Projektteam. Rollen klären, Kommunikationsweg (Shared-Slack/Teams).
- Gemeinsames Commitment-Canvas unterschreiben.

**Dienstag–Donnerstag**
- Stammdaten-Export aus Altsystem vorbereiten (wir helfen).
- Einrichtungs-Setup in CareAI: Wohnbereiche, Zimmer, Dienstarten, Rollen.

**Freitag**
- Sanity-Check: 2 Test-Bewohner:innen durchlaufen, funktioniert?

**Ergebnis Wo 1:** Basis-Setup steht, 2 Test-Bewohner fiktiv angelegt.

---

## Woche 2 — Daten-Migration

**Montag–Mittwoch**
- Vollständiger Daten-Import aus Altsystem.
- QS-Check: Stichproben 10% der Bewohner:innen manuell verifizieren.
- Offene Felder: was fehlt im Altsystem, muss manuell ergänzt werden (meist: aktuelle Maßnahmenpläne).

**Donnerstag–Freitag**
- Freigabe-Runde mit PDL: Daten vollständig & korrekt?
- Go/No-Go für Woche 3.

**Ergebnis Wo 2:** Alle Bewohner:innen im System, Datenqualität ≥ 98%.

---

## Woche 3 — Schulung Pilot-Team 1

**Team-Auswahl:** 3 motivierte Pflegekräfte aus einem Wohnbereich. Die Champions.

**Montag (4h Schulung):**
- Grundlagen: Login, Dashboard, Bewohner-Profil.
- Dokumentation: klassisch tippen + Spracheingabe üben.
- Hausaufgabe: 1 Schicht nur mit CareAI dokumentieren (parallel zu Alt).

**Mittwoch (2h Follow-up):**
- Fragen, Feedback.
- Fortgeschrittenes: Maßnahmenplan, SIS, Wund-Doku.

**Freitag (1h Retro):**
- Was war gut, was nervt, was fehlt?
- Kleine Anpassungen am Setup.

**Ergebnis Wo 3:** 3 Champions arbeiten live.

---

## Woche 4 — Schulung Team 2 + 3

- Parallel zwei weitere Wohnbereiche (6 Pflegekräfte + 2 PDLs).
- Gleiche Struktur wie Wo 3, aber Champions aus Wo 3 unterstützen als Peer-Trainer.
- PDL-Spezial-Schulung: Dashboards, Anomalie-Erkennung, Berichte.

**Ergebnis Wo 4:** 11+ geschulte User, 3 Wohnbereiche live.

---

## Woche 5 — Parallel-Betrieb Phase 1

- Pilot-Team führt Doku in BEIDEN Systemen (CareAI + Altsystem).
- Sicherheit: falls CareAI-Problem, bleibt Altsystem als Fallback.
- Täglicher 15-Min-Standup "wo hakt's?" mit CareAI-CSM.

**Ergebnis Wo 5:** 5 Werktage Parallelbetrieb, Fehlerlog auf Zero.

---

## Woche 6 — Parallel-Betrieb Phase 2 + Integrations-Check

- Parallel weiter, aber: Champions dokumentieren nur noch in CareAI.
- Integrations-Test: Export zu Apotheke, Arzt-Schnittstelle, Abrechnung.
- QS-Team prüft: MD-Prüfungs-Readiness eines zufälligen Bewohners.

**Ergebnis Wo 6:** Vertrauen aufgebaut, Integrationen laufen.

---

## Woche 7 — Vollumstieg Wohnbereich-weise

- **Montag:** Wohnbereich 1 stellt vollständig um. Altsystem nur read-only.
- **Mittwoch:** Wohnbereich 2.
- **Freitag:** Wohnbereich 3.

Täglich 30-Min-Support-Call vor Ort mit CareAI-CSM.

**Ergebnis Wo 7:** 100% Pflegedoku in CareAI. Altsystem im Archiv-Modus.

---

## Woche 8 — Stabilisierung & Hand-off

**Montag–Mittwoch**
- Feintuning: Dashboards nach Wünschen anpassen, Reports automatisieren.
- Zweitschulung für Nachtdienst + Hilfskräfte.

**Donnerstag**
- **Go-Live-Zeremonie** (kein Scherz): Team-Meeting, was haben wir erreicht, Dank an Champions.

**Freitag**
- Hand-off vom CSM an Support (ab hier Ticket-basiert).
- 30-Tage-Post-Launch-Call in Kalender.

**Ergebnis Wo 8:** Einrichtung selbstständig, CareAI etabliert.

---

## KPIs über den Rollout

| KPI | Ziel Wo 8 |
|-----|-----------|
| Geschulte User | 100% der aktiven Pflegekräfte |
| Tickets in Support | < 2 pro Tag |
| Datendichte (Einträge/Bewohner/Woche) | gleiche wie Altsystem |
| Zeit pro Bericht (PDL-Schätzung) | –60% |
| Zufriedenheit (Team-Umfrage) | ≥ 4 von 5 |

---

## Was, wenn's schiefgeht?

- **Wo 2 Datenqualität < 90%:** Extra-Woche für Cleanup, Rollout-Plan +1 Woche.
- **Wo 5 Champions frustriert:** Retro, CSM 1h vor Ort, Ursache fixen.
- **Wo 7 massive Bugs:** Rollback eines Wohnbereichs zu Altsystem, CareAI fixt, neu starten.

**Kein Rollout ohne Ausweg.**
