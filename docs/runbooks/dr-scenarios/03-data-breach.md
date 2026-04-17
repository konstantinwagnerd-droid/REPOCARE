# Szenario 3 — Data-Breach (DSGVO Art. 33/34)

**RTO:** 72h für Meldung an Aufsichtsbehörde  | **RPO:** n/a (Vertraulichkeitsverletzung).
**Tabletop-Dauer:** 2h.

## Trigger-Signal
- Anomalie-Detection meldet ungewöhnliche Datenexporte (Volumen, Zeit, IP-Geo).
- Öffentliche Leak-Site (haveibeenpwned) findet CareAI-Kundendaten.
- Interner Whistleblower meldet Abfluss.
- Security-Researcher meldet Schwachstelle + PoC mit echten Daten.
- Kunde meldet Phishing mit CareAI-spezifischen Details.

## Rollen
- **IC** (Data Protection Officer hat hier Leitungsrolle mit CTO gemeinsam)
- **Tech-Lead** (Forensik + Containment)
- **Comms-Lead**
- **Legal/DPO** (Koordiniert 72h-Meldeprozess)
- **Customer-Success-Lead** (Kund:innen-Betreuung bei Meldung nach Art. 34)

## Erste-Reaktions-Schritte (0–4h)

| Zeit | Aktion | Verantwortlich |
|------|--------|----------------|
| T+0   | Verdachtsfall erhärten: Logs, Access-Records, Threat-Intel | Tech-Lead |
| T+30  | Bei Bestätigung: DPO aktivieren, 72h-Uhr startet | DPO |
| T+60  | Containment: betroffene Accounts sperren, Tokens invalidieren | Tech-Lead |
| T+90  | Scoping: Wessen Daten, welche Kategorien, wie viele? | Tech-Lead + DPO |
| T+120 | Risikobewertung nach Art. 32 (Eintrittswahrscheinlichkeit × Schweregrad) | DPO |
| T+180 | Entscheidung: Meldung Art. 33 erforderlich? Benachrichtigung Art. 34? | Legal + DPO |
| T+240 | Draft-Meldung an DSB vorbereitet | DPO |

## DSGVO-Meldepflicht-Check

**Art. 33 — Meldung an Aufsichtsbehörde:**
- IMMER außer kein Risiko für Rechte/Freiheiten (praktisch selten verneinbar bei Pflegedaten).
- Österreich: [Datenschutzbehörde](https://www.dsb.gv.at) via `dsb@dsb.gv.at`.
- Frist: **72h ab Kenntnis**. Verspätung nur mit Begründung.

**Art. 34 — Benachrichtigung Betroffener:**
- Wenn "voraussichtlich hohes Risiko" für Rechte/Freiheiten.
- Pflegedaten = Gesundheitsdaten = **Art. 9 Sonderkategorie** → fast immer hohes Risiko.
- Klartext, keine Paragraphen-Bombe.

## Technische Forensik-Schritte

1. **Evidence Preservation:** Logs aller relevanten Systeme einfrieren.
2. **Access-Log-Analyse:** Wer hat wann was exportiert? SQL-Audit-Trails.
3. **Scope-Bestimmung:** Welche `tenant_id`, welche Tabellen, welche Spalten?
4. **Ex-Attacker-Activity:** IOCs (IPs, User-Agents) gegen restliche Infrastruktur matchen.
5. **Vulnerability-Fix:** Einfallstor identifiziert und geschlossen bevor Meldung geht.
6. **Rotation:** Alle betroffenen API-Keys, Session-Tokens.

## Kommunikations-Plan

**Aufsichtsbehörde (T+72h):**
```
Betreff: Meldung einer Verletzung des Schutzes personenbezogener Daten gemäß Art. 33 DSGVO
– Art der Verletzung
– Kategorien und ungefähre Zahl der betroffenen Personen
– Kategorien und ungefähre Zahl der Datensätze
– Name und Kontaktdaten des DPO
– Wahrscheinliche Folgen
– Getroffene / vorgeschlagene Maßnahmen
```

**Betroffene (bei Art. 34):**
- Einfache Sprache: was ist passiert, welche Daten, was bedeutet es für dich, was tun wir, was solltest du tun.
- Keine Rechtsbelehrung im Brief, Hotline + E-Mail für Rückfragen.

**Medien:** Proaktiv statt reaktiv, wenn Leak bereits öffentlich. Mit Legal abgestimmt.

## Tabletop-Injects

| Zeit | Inject | Erwartete Reaktion |
|------|--------|-------------------|
| T+0  | "Sec-Researcher mailt PoC mit 200 Pflegeberichten" | Verifizierung, DPO aktivieren |
| T+30 | "Whistleblower-Portal: ehemaliger Mitarbeiter hat Daten kopiert" | Scope prüfen, HR einbinden |
| T+60 | "Social Media: Kunde postet 'CareAI gehackt!!!'" | Hold-Statement, Rumor-Control |
| T+90 | "Twitter: unverfügbare Pflegeberichte angeboten für 5 BTC" | Law Enforcement, Darknet-Monitoring |
| T+120 | "Datenschutzbehörde ruft proaktiv an" | DPO übernimmt, transparent bleiben |

## Abschluss-Debrief

- War 72h-Meldung realistisch machbar?
- Waren Rollen klar?
- Welche Logs hatten wir, welche fehlten?
