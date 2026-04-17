# 03 — Risk-Management-File nach ISO 14971:2019

**Dokument-ID:** CAI-REG-003
**Version:** 1.0 — Draft
**Verantwortlich:** Quality Manager + Clinical Lead

## 1. Risikomanagement-Prozess

Nach ISO 14971:2019 Abschn. 4-9 umgesetzter Gesamt-Lebenszyklus-Prozess:

```
Analyse → Bewertung → Kontrolle → Restrisiko → Überwachung (PMS)
   ↑                                                         │
   └─────────────────── kontinuierlich ────────────────────┘
```

## 2. Bewertungsmatrix

### Schweregrad (S)

| S | Bezeichnung | Beispiel |
|---|-------------|----------|
| 1 | Vernachlässigbar | Kein Schaden, Nutzer-Irritation |
| 2 | Gering | Reversibler Schaden ohne Behandlung |
| 3 | Mittel | Reversibler Schaden mit Behandlung (Dekubitus Grad 1) |
| 4 | Schwer | Schwere Verletzung, längerer Heilungsverlauf (Fraktur) |
| 5 | Kritisch | Dauerschaden oder Tod (nicht erwartet in Klasse IIa) |

### Wahrscheinlichkeit (W)

| W | Bezeichnung | Erwartete Häufigkeit |
|---|-------------|----------------------|
| 1 | Unwahrscheinlich | < 1 pro 10.000 Einsätze |
| 2 | Gelegentlich | 1 pro 1.000 – 10.000 |
| 3 | Möglich | 1 pro 100 – 1.000 |
| 4 | Wahrscheinlich | 1 pro 10 – 100 |
| 5 | Häufig | > 1 pro 10 |

### Erkennbarkeit (E) — additiv

| E | Bezeichnung |
|---|-------------|
| 1 | Hoch (sofort sichtbar) |
| 2 | Mittel (innerhalb Schicht) |
| 3 | Niedrig (erst bei Audit) |

### Risiko-Prioritäts-Zahl (RPN)

```
RPN = S × W × E
```

- RPN 1–8: akzeptabel (ALARP), Dokumentation genügt.
- RPN 9–24: Risk-Control-Maßnahmen erforderlich.
- RPN 25+: inakzeptabel, Konstruktionsänderung.

## 3. Risiko-Katalog (20 Kern-Risiken)

| # | Gefährdung | Szenario | S | W | E | RPN | Kontrolle | Rest-RPN |
|---|------------|----------|---|---|---|-----|-----------|----------|
| R01 | Falsch-Negativ Dekubitus-Risiko | Modell übersieht Hochrisiko-Bewohner | 3 | 3 | 2 | 18 | Sensitivity-Threshold ≥ 0.85, explizite Unsicherheits-Anzeige, Braden-Zweit-Score verpflichtend | 6 |
| R02 | Falsch-Positiv führt zu Übervorsorge | Unnötige Umlagerung alle 2h | 2 | 3 | 1 | 6 | PPV-Monitoring, Schwellen-Tuning | 4 |
| R03 | Sprachverständnis-Fehler (ASR) | Medikamenten-Dosis falsch transkribiert | 4 | 2 | 2 | 16 | Confirmation-UI ("Haben Sie 5mg gemeint?"), Medikations-Plausi-Check, read-back-Pattern | 6 |
| R04 | Sturzrisiko-Alert nicht zugestellt | Push-Notification fehlt (Netzausfall) | 3 | 2 | 3 | 18 | Offline-Queue mit 72h Retention, Dashboard-Banner bei ungelesenen High-Alerts | 6 |
| R05 | Medikations-Wechselwirkung nicht erkannt | ABDA-DB veraltet | 4 | 2 | 3 | 24 | Monatliches ABDA-Update, Datumsanzeige, Warnung bei DB > 30 Tage alt | 8 |
| R06 | Falsche Bewohner-Zuordnung (Mix-up) | Mobile App zeigt falschen Bewohner | 5 | 1 | 2 | 10 | Foto-Double-Check vor kritischen Aktionen, Zimmer-Nr-Confirm | 4 |
| R07 | Datenverlust durch Sync-Konflikt | Offline-Edit überschreibt neueren Server-Stand | 3 | 2 | 3 | 18 | CRDT-basierter Merge, Konflikt-UI mit manueller Review | 6 |
| R08 | Unberechtigter Zugriff auf Daten | Session-Hijack, Token-Leak | 4 | 2 | 3 | 24 | Short-lived JWT (15min), Refresh-Token-Rotation, MFA für Admins | 8 |
| R09 | Ausfall Cloud-Infrastruktur | AWS-Region down | 3 | 1 | 1 | 3 | Multi-Region-Failover, Offline-Fallback (72h), dokumentiertes DR-Playbook | 2 |
| R10 | KI-Drift über Zeit | Modell-Performance sinkt ohne Retraining | 3 | 3 | 3 | 27 | Monatliches Performance-Monitoring, Drift-Detection, Retraining-Trigger bei ≥ 5% Abfall | 9 |
| R11 | Bias gegen Alters-/Geschlechts-Gruppen | Modell unterrepräsentiert sehr alte Männer | 3 | 2 | 3 | 18 | Subgroup-Performance-Reports, Fairness-Metriken in CER | 6 |
| R12 | Fehlerhafte Datenmigration | Import aus Altsystem verliert Feldzuordnung | 3 | 2 | 2 | 12 | Migrations-Dry-Run, Field-Mapping-Review, Post-Migration-Reconciliation | 4 |
| R13 | UI-Fehlbedienung durch Ermüdung | Fehlklick auf Dosis-Bestätigung | 3 | 3 | 2 | 18 | Confirm-Dialogs bei kritischen Aktionen, Undo-Fenster 30s | 6 |
| R14 | Fehler in PDF-Export (Akte) | Werte doppelt/fehlen auf Ausdruck | 3 | 2 | 2 | 12 | Automatisierter Diff-Test PDF-vs-DB, QA-Signoff | 4 |
| R15 | Unvollständige Fehlermeldung an Nutzer | Silent Fail bei Backend-Error | 3 | 3 | 3 | 27 | Global Error Boundary + Sentry, User-facing Error-Code mit Support-Link | 9 |
| R16 | Overload — System reagiert nicht | 500 concurrent Nutzer | 3 | 2 | 1 | 6 | Load-Testing (siehe pentest), Auto-Scaling, Rate-Limit | 4 |
| R17 | Cybersecurity-Angriff (SQLi, XSS) | Angreifer greift Daten ab | 4 | 2 | 3 | 24 | Parametrisierte Queries, CSP, OWASP-ASVS-L2, jährlicher Pentest | 8 |
| R18 | Nicht-zugelassener Use-Case (Akut) | Klinik nutzt CareAI auf ICU | 3 | 2 | 3 | 18 | Labeling, IFU-Hinweis, Vertragsklausel, Monitoring der Einsatzorte | 6 |
| R19 | Fehlende Usability-Prüfung neuer Features | Release bricht gelernten Workflow | 2 | 3 | 2 | 12 | IEC 62366 Usability-Regression-Tests vor jedem Major-Release | 6 |
| R20 | Hardware-Ausfall Endgerät (Tablet) | Akku leer mitten im Rundgang | 2 | 3 | 1 | 6 | Akku-Warnung ab 15%, Offline-Mode, Dokumentations-Wiederaufnahme | 4 |

## 4. Risk-Control-Maßnahmen — Hierarchie (ISO 14971 §7)

1. **Inhärente Sicherheit durch Design** (z.B. Human-in-the-Loop verpflichtend)
2. **Schutzmaßnahmen** (Validierungen, Confirm-Dialogs, Redundanz)
3. **Information für Sicherheit** (IFU, Warnungen, Labeling)

Angewandt in priorisierter Reihenfolge.

## 5. Gesamt-Rest-Risiko-Bewertung

Summe Rest-RPN aller Einzelrisiken ≤ akzeptables Niveau. Nutzen-Risiko-Verhältnis (siehe CER §12) ist positiv.

**Bewertung durch Risk-Management-Ausschuss:** [Signatur Clinical Lead / QM / PRRC]

## 6. Post-Market-Surveillance-Link

Alle Risiken werden im PMS-Plan (Dokument CAI-REG-004 §PMCF) kontinuierlich überwacht. Incident-Reporting via Vigilance-System (MDR Art. 87).

## 7. Review-Zyklus

- Jährliches Management-Review (ISO 13485 §5.6).
- Ad-hoc bei: wesentlichen Änderungen, Incidents, neuer Evidenz.
