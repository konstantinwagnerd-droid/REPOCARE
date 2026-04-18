# medatixx (medatixx.de)

**Stand:** 2026-04-18
**Quellen:** medatixx.de
**Marktposition:** Arztpraxen-PVS, ~40% Marktanteil DE Hausarzt
**Relevanz für CareAI:** Features übertragbar — Medikamentenverwaltung, AMTS, ePA, e-Rezept

## Hauptmodule (übertragbar)

- **Medikationsplan (BMP):** bundeseinheitlicher Medikationsplan nach § 31a SGB V, QR-Code
- **AMTS-Check:** Arzneimittel-Therapie-Sicherheit mit ifap/MMI-Datenbank
  - Interaktionsprüfung
  - Doppelverordnungen
  - Kontraindikationen (Allergien, Schwangerschaft)
  - Dosierungs-Check
- **e-Rezept:** gematik-zertifiziert, TI-Konnektor
- **ePA:** Lese- + Schreibzugriff
- **KIM** (Kommunikation Medizin) — Arztbrief-Versand
- **TI-Messenger** (2024+)

## Integrationen

- **KBV-Zulassung** für PVS
- **LDT / HL7 / FHIR** Laborbefunde
- **eDMP** (Disease Management Programm)

## CareAI-relevante Gaps

CareAI fehlt **AMTS-Check** komplett. Kritisches Pflegeheim-Feature — 30% der Bewohner haben > 5 Medikamente (Polypharmazie). Interaktionsprüfung via MMI/ifap API oder OpenSource ABDA-Datenbank.
