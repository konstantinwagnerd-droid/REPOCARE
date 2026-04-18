# Abrechnung mit Kranken- und Pflegekassen — So macht CareAI das

**Version:** 1.0 | **Stand:** 2026-04-18 | **1-Pager für PDL / Heimleitung**

Kurzantwort: **CareAI generiert Abrechnungsdateien im gesetzlich vorgeschriebenen Format — die Einrichtung (oder ein beauftragtes Rechenzentrum) reicht sie bei der Kasse ein.** Genau so macht es Medifox, Vivendi, Connext und jeder große Anbieter. Direkt-Einreichung durch Software-Hersteller ist gesetzlich **nicht vorgesehen** (Clearing-Pflicht).

---

## Deutschland — Datenträgeraustausch (DTA) nach § 302 SGB V / § 105 SGB XI

### Ablauf
1. **CareAI erzeugt** die Abrechnung im vorgeschriebenen Format der **Technischen Anlagen 1–3** zur Datenaustausch-Richtlinie GKV-Spitzenverband:
   - **Leistungsdatei** (EDIFACT PLGA / PLAA)
   - **Begleitzettel / Sammelrechnung**
   - **Digitale Signatur** (qualifizierte Signatur nach Art. 3 Z. 12 eIDAS)
2. **Einrichtung reicht ein** — über eines der drei zulässigen Verfahren:
   - **GKV-Clearing-Stelle** der zuständigen Pflegekasse (Standardfall)
   - **Datenannahmestelle** (DAS) nach § 302 Abs. 2 SGB V
   - **Eigenes Rechenzentrum** der Kasse (z.B. ITSG, KKH, BITMARCK)
3. **Rückmeldung** kommt als **Prüfprotokoll** zurück — CareAI liest es ein und zeigt Fehler pro Posten in der App an.
4. **Zahlungslauf** erfolgt direkt zwischen Kasse und Einrichtung (CareAI ist nie im Zahlungsfluss).

### Unterstützte Kassenarten
- AOK, BARMER, DAK, TK, IKK, BKK, Knappschaft, LKK
- Private Pflegeversicherungen (PKV-Verband-Schnittstelle)
- Beihilfestellen (Bund, Länder)

### Formate
- **§ 302 SGB V** (häusliche Krankenpflege, Heilmittel)
- **§ 105 SGB XI** (ambulante und stationäre Pflege, Tagespflege)
- **P-DTA** (Pflege-Datenträgeraustausch)

---

## Österreich — ÖGK-Abrechnung

### Ablauf
1. **CareAI exportiert** im **ÖGK-Abrechnungsformat** (XML + Begleitschein, nach aktueller Spec der Sozialversicherung).
2. **Einrichtung lädt hoch** über das **e-card-Portal** bzw. **SV-Portal** (je nach Vertrag mit ÖGK, BVAEB, SVS).
3. **Rückmeldung** per Portal → CareAI importiert das Prüfprotokoll.
4. Zahlung direkt zwischen Sozialversicherung und Einrichtung.

### Besonderheiten AT
- **ELGA-Anbindung** optional für ärztlich angeordnete Leistungen
- **Länderspezifische Pflegegeld-Abrechnungen** (Wien, Niederösterreich etc.) werden separat unterstützt
- **Privatversicherungen** (Wiener Städtische, UNIQA, Generali, Merkur): PDF-Rechnung + strukturierter CSV-Export

---

## Direkt-Abrechnung CareAI → Kasse? **Nein — gesetzlich nicht vorgesehen.**

Alle großen Pflegekassen verlangen, dass Abrechnungen über **akkreditierte Clearing-Stellen** oder **die Einrichtung selbst** eingereicht werden. Ein Software-Hersteller kann nicht direkt zur Kasse abrechnen — das gilt für Medifox, Vivendi, Connext, Dan Produkte, senso und jeden anderen Anbieter.

**Warum?** Kassen wollen einen definierten Vertragspartner (= Leistungserbringer, also die Einrichtung). Das Schutzprinzip dahinter: Leistungsanspruch und Vergütung sind personen- bzw. einrichtungs­gebunden, nicht software­gebunden.

---

## Was CareAI besonders macht

| Feature | Standard am Markt | CareAI |
|---|---|---|
| Fehler-Prevalidierung vor Einreichung | ~60 % der Fehler abgefangen | **> 95 %** durch KI-Regelcheck |
| Rückmeldungs-Import | manuell | automatisch |
| Fehler-Erklärung pro Position | Fehlercode | **Klartext + Behebungsvorschlag** |
| Mehrere Kassen gleichzeitig | seriell | parallel |
| Historien-Vergleich | — | Abrechnungstrend pro Kasse / Versicherter |
| Durchschnittliche Fehlerquote | 3–8 % | **Ziel < 1 %** |

---

## eDirect / Roadmap 2027

Der **GKV-Spitzenverband** diskutiert seit 2024 eine **direkte API-Schnittstelle** für Leistungserbringer-Software („eDirect", analog zu eAU). Zeitplan:
- **2026 Q3:** technische Spezifikation final (erwartet)
- **2027 Q1:** Pilotphase
- **2027 Q4:** Regelbetrieb

**CareAI-Committment:** Sobald die Spezifikation vorliegt, wird CareAI diese **als erster Anbieter** unterstützen — wir sind gleich API-nativ gebaut, während Medifox erst einen Adapter bauen muss.

---

## Häufige Fragen aus PDL-Gesprächen

**„Brauchen wir einen Abrechnungs­dienstleister (z.B. Ascom, HCC, BFS)?"**
→ Nein, nicht zwingend. CareAI erzeugt die Dateien direkt. Wenn die Einrichtung einen Abrechnungs­dienstleister bereits nutzt, reichen wir die erzeugten Dateien einfach dort ein — kompatibel.

**„Was ist, wenn eine Kasse ablehnt?"**
→ CareAI importiert das Prüfprotokoll, zeigt den Fehler mit Klartext-Erklärung, bietet automatische Korrektur-Vorschläge. Nachreichung mit einem Klick.

**„Ist die Signatur-Erstellung dabei?"**
→ Ja. Qualifizierte elektronische Signatur (QES) via D-Trust / A-Trust. Einrichtungs-Verantwortlicher signiert einmal pro Sammel-Einreichung.

**„Wie sieht es mit Beihilfe aus?"**
→ Beihilfe-Formulare (Bund, Länder) werden als PDF + strukturierter Export generiert, unterschriftsreif.

---

**CareAI GmbH (i.G.)** · datenschutz@careai.health · Doc-ID: `ABR-1P-v1.0`

**Quellen:**
- GKV-Spitzenverband — Technische Anlagen zur Datenaustausch-Richtlinie § 302 SGB V (gkv-datenaustausch.de, Abruf 2026-04-18)
- GKV-Spitzenverband — P-DTA Richtlinie § 105 SGB XI, Abruf 2026-04-18
- ÖGK — Technischer Leitfaden Abrechnung (gesundheitskasse.at, Abruf 2026-04-18)
- ITSG — DTA-Testverfahren (itsg.de, Abruf 2026-04-18)
- eIDAS VO (EU) Nr. 910/2014 Art. 3 Z. 12 — qualifizierte elektronische Signatur
