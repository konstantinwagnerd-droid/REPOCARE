# CE-MDR-Submission — CareAI Phase 2 (2027)

Übersicht zur CE-Kennzeichnung von CareAI als Medizinprodukt nach **MDR 2017/745 Klasse IIa** ab der KI-prädiktiven Phase (Dekubitus-Früherkennung, Sturzrisiko-Vorhersage, Mangelernährungs-Alert).

## Regulatorischer Rahmen

| Rechtsakt | Rolle | Anwendbar ab |
|-----------|-------|---------------|
| **MDR 2017/745** | Medizinprodukt-Regulierung | CE-Klasse IIa |
| **EU AI Act** (VO 2024/1689) | Hochrisiko-KI (Annex III, Nr. 5b Medizin) | 08/2027 volle Anwendung |
| **ISO 13485:2016** | QMS Medizinprodukte | Harmonisiert unter MDR |
| **ISO 14971:2019** | Risikomanagement | Harmonisiert |
| **IEC 62304:2006+A1:2015** | Software-Lebenszyklus | Klasse B für IIa |
| **IEC 62366-1:2015** | Usability-Engineering | Pflicht unter MDR |
| **IEC 82304-1:2016** | Health-Software (Standalone) | Empfohlen |
| **ISO 27001 / 27701 / 27799** | InfoSec + Gesundheitsdaten | Empfohlen |

## Produkt-Scope Phase 2

**Intended Use (Kurz):** Software zur klinischen Entscheidungsunterstützung für Pflegefachpersonen in stationärer Langzeitpflege. Prädiktive Risikoerkennung (Dekubitus, Sturz, Delir, Mangelernährung) auf Basis strukturierter SIS-Daten und Tagesberichte. **Nicht** zur Diagnose. **Nicht** zur direkten Therapiesteuerung.

**Klassifizierung:** **Klasse IIa** nach MDR Annex VIII **Rule 11** (Software, die Informationen zur Entscheidungsfindung für diagnostische/therapeutische Zwecke liefert, Risiko von Personenschaden bei falscher Info ≥ mittel).

**AI Act Kategorie:** **Hochrisiko** (Annex III §5b — Gesundheit/Medizin). Konformitätsbewertung integriert mit MDR-Notified-Body möglich (AI Act Art. 43(3)).

## Benannte Stelle (Notified Body)

Empfehlung: **TÜV Süd Product Service (NB 0123)** oder **DEKRA Certification (NB 0124)** — beide DACH, MDR-akkreditiert, AI-Act-ready.

## Zeitrahmen (18 Monate)

```
M0      M3       M6          M9        M12        M15        M18
│───────│────────│───────────│─────────│──────────│──────────│
QMS     CER      TechFile    Audit1    Audit2     DoC        CE-Mark
(ISO    Risk     Usability   Stage1    Stage2     issued     affixed
13485)  Eval                                      
```

## Dokumenten-Index

| # | Dokument | Pflicht nach |
|---|-----------|---------------|
| 01 | Intended Use / Zweckbestimmung | MDR Annex II §1.1 |
| 02 | Klassifizierungs-Rationale | MDR Annex VIII |
| 03 | Risk-Management-File | ISO 14971 + MDR Annex I §3 |
| 04 | Clinical-Evaluation-Report | MDR Art. 61 + Annex XIV |
| 05 | Technical Documentation | MDR Annex II+III |
| 06 | QMS nach ISO 13485 | MDR Art. 10(9) |
| 07 | Declaration of Conformity | MDR Art. 19 |
| 08 | Labeling / IFU | MDR Annex I §23 |
| 09 | EUDAMED-Registrierung | MDR Art. 29 |
| 10 | AI-Act Hochrisiko-Compliance | VO 2024/1689 Art. 9-14 |
| 11 | Notified-Body-Auswahl | MDR Art. 42 |
| 12 | Submission-Timeline | — |

## Budget-Rahmen (Phase 2)

| Posten | Spanne |
|--------|--------|
| Notified-Body-Zertifizierung | €45.000 – €80.000 |
| Klinische Validierung (3 Heime, 6 Mon.) | €60.000 – €90.000 |
| QMS-Implementierung (ISO 13485) | €25.000 – €40.000 |
| Regulatory-Consultant (extern) | €30.000 – €50.000 |
| Interne FTE (0.5 Reg. + 0.5 QM, 18 Mon.) | €120.000 |
| **Gesamt** | **€280.000 – €380.000** |

## Ownership

- **Regulatory Affairs Lead:** N.N. (ab Q3/2026 einzustellen)
- **Quality Manager:** N.N.
- **Clinical Lead:** N.N.
- **Verantwortliche Person nach MDR Art. 15 (PRRC):** intern oder extern (Interim-Lösung möglich)
