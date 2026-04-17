# 01 — Zweckbestimmung (Intended Use Statement)

**Dokument-ID:** CAI-REG-001
**Version:** 1.0 — Draft
**Datum:** 2027-Q1
**Autor:** Regulatory Affairs
**Geprüft:** Clinical Lead, Medical Advisor
**Freigegeben:** CEO / PRRC

---

## 1. Produktname

**CareAI Clinical Decision Support (CDS)** — Software as a Medical Device (SaMD) zur prädiktiven Risikoerkennung in der stationären Langzeitpflege.

## 2. Intended Use / Zweckbestimmung

CareAI ist eine Software zur **klinischen Entscheidungsunterstützung** für qualifizierte Pflegefachpersonen (DGKP, Pflegeassistenz unter Aufsicht) in stationären Pflegeeinrichtungen. Das Produkt analysiert strukturierte Pflegedokumentation (Strukturierte Informationssammlung SIS, Tagesberichte, Vitalwerte, Medikationsdaten) und erzeugt **Risiko-Hinweise** zu folgenden Bereichen:

1. **Dekubitusrisiko** (Druckgeschwür-Entstehung innerhalb 14 Tagen)
2. **Sturzrisiko** (Sturzereignis innerhalb 7 Tagen)
3. **Delir-Frühzeichen** (akute Verwirrtheit innerhalb 72 Stunden)
4. **Mangelernährungsrisiko** (MUST-Score-Veränderung)
5. **Dehydratations-Risiko** (Flüssigkeits-Bilanz-Abweichung)

Die Software **unterstützt** die klinische Entscheidungsfindung durch frühzeitige Aufmerksamkeitslenkung. Die finale Bewertung, Indikationsstellung, Maßnahmen-Anordnung und Therapieentscheidung **obliegt ausschließlich qualifiziertem Pflegepersonal bzw. der behandelnden Ärztin/dem behandelnden Arzt**.

## 3. Indikation

- Bewohner:innen **stationärer Pflegeeinrichtungen** (Pflegeheime, Langzeitpflege) mit Pflegegrad ≥ 2 (DE) bzw. Pflegestufe ≥ 2 (AT).
- Alter ≥ 18 Jahre. Primärer Use-Case: Geriatrie (≥ 65 J).
- Bewohner:in oder gesetzliche:r Vertreter:in hat in die Datenverarbeitung eingewilligt (DSGVO Art. 9(2)h).

## 4. Kontraindikationen

- **Akut-Stationäre Versorgung** (Krankenhaus, Intensivstation) — nicht validiert, nicht zugelassen.
- **Ambulante Pflege** ohne vollständige strukturierte Dokumentation — eingeschränkte Prädiktionsgüte.
- **Pädiatrie** (< 18 J).
- **Verwendung als alleinige Entscheidungsgrundlage** ohne fachliche Beurteilung.

## 5. Zielpopulation

- Primär: Bewohner:innen in DE/AT/CH-Langzeitpflege mit typischem geriatrischem Profil (Multimorbidität, Polymedikation, eingeschränkte Mobilität).
- Sekundär (nach Erweiterungs-Validierung): CH-Romandie, FR, IT-Langzeitpflege.

## 6. Anwendergruppe (Intended User)

| Rolle | Qualifikation | Zugriff |
|-------|---------------|----------|
| Pflegefachperson (DGKP) | Examiniert, Registrierungsnachweis | Lesen/Schreiben/Bestätigen |
| Pflegeassistenz (PA) | Grundausbildung + Aufsicht | Lesen/Erfassen, keine Bestätigung |
| Pflegedienstleitung (PDL) | Leitungsqualifikation | Vollzugriff + Reports |
| Ärztin/Arzt (konsiliarisch) | Approbation | Lesen + Befunde |

**Keine** Anwendung durch Laien, Angehörige, Bewohner:innen selbst.

## 7. Anwendungsumgebung

- Stationäre Pflegeeinrichtungen mit DSGVO-konformer IT-Umgebung.
- Endgeräte: mobile Tablets (iOS 16+, Android 12+), Desktop-Browser (Chrome 120+, Edge 120+, Safari 17+, Firefox 120+).
- Netzwerk: WLAN, 5G-Mobile, ggf. Offline-Modus (max. 72h) mit Sync beim Reconnect.
- Keine Anwendung in steriler Umgebung, OP-Saal oder Notfallmedizin.

## 8. Produkt-Grenzen (Limitations)

- CareAI ersetzt **keine klinische Untersuchung**, **keine ärztliche Diagnose**, **keine Labor-/Bildgebungs-Diagnostik**.
- Prädiktionsgüte abhängig von Datenvollständigkeit — bei Lücken werden explizite Warnhinweise ausgegeben.
- Die Software stellt **Hinweise**, keine Anordnungen. Alarme sind nachverfolgbar und quittierungspflichtig.
- Keine automatische Therapiesteuerung, keine direkte Ansteuerung von Aktoren/Geräten.

## 9. Abgrenzung (Was CareAI NICHT ist)

- Kein Diagnostiksystem.
- Kein autonomes KI-System (Human-in-the-Loop verpflichtend).
- Kein Life-Sustaining System (Klasse III).
- Kein Monitoring vitaler Funktionen in Echtzeit (keine Sensorik-Ankopplung Phase 2).

## 10. Nutzen (Clinical Benefit)

- **Primär:** Reduktion verhinderbarer pflegesensitiver Ereignisse (insbes. Dekubitus, Stürze) durch frühzeitige Aufmerksamkeitslenkung.
- **Sekundär:** Reduktion Dokumentationszeit um ≥ 60%, Verbesserung der Dokumentationsqualität (Vollständigkeit, Standardkonformität), höhere Mitarbeitendenzufriedenheit.
- **Evidenzbasis:** Literaturrecherche + klinische Validierungsstudie (siehe Dokument 04).

## 11. Versionierung

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0 | Draft 2027-Q1 | Erstfassung |
