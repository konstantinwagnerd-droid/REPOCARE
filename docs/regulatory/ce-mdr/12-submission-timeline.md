# 12 — Submission-Timeline (18 Monate bis CE-Mark)

**Dokument-ID:** CAI-REG-012
**Version:** 1.0 — Draft
**Zeithorizont:** Start Q3/2026 → CE-Mark Q4/2027

## 1. Gesamt-Roadmap

```
2026 Q3    Q4    2027 Q1    Q2    Q3    Q4
  │       │       │       │       │       │
  QMS-    Risk-   Clinical Study- Stage-2 CE-Mark
  Setup   Mgmt    Study    Durch-  Audit   issued
          + CER   Start    führung + DoC
```

## 2. Meilenstein-Plan (M0-M18)

| Monat | Meilenstein | Owner | Deliverable |
|-------|-------------|-------|--------------|
| M0 — Q3/26 | Regulatory Kick-off | CEO + Reg.-Consultant | Projekt-Charter, Budget-Freigabe |
| M1 | QMS-Grundgerüst (ISO 13485) | QM-Lead | QMH + SOPs 01-04 |
| M2 | SOP-Set vollständig | QM-Lead | SOPs 05-21 |
| M3 | Risk-Mgmt-File Erstfassung | Clinical Lead + QM | CAI-REG-003 |
| M4 | Intended Use + Klassifizierung | Reg.-Lead | CAI-REG-001, CAI-REG-002 |
| M5 | Technical Documentation v1 | Eng.-Lead + QM | CAI-REG-005 |
| M6 — Q4/26 | NB-Vertrag + Clinical-Study-Protocol | CEO + Clinical Lead | Vertrag + CIP |
| M7 | Ethik-Einreichung + Genehmigung | Clinical Lead | Ethik-Votum |
| M8 | Clinical Study Start (3 Heime) | Clinical Lead | Recruitment |
| M9 — Q1/27 | Interim-Analyse | Biostatistik | Interim-Report |
| M10 | Cybersecurity-Audit (extern) | Eng.-Lead | Pentest-Report |
| M11 | Usability-Summative-Evaluation (IEC 62366) | UX-Lead + Clinical | UE-File |
| M12 — Q2/27 | Clinical Study Abschluss | Clinical Lead | Study-Report |
| M13 | CER Final (inkl. eigener Daten) | Clinical Lead | CAI-REG-004 |
| M14 | AI-Act-Compliance-Dossier | Reg.-Lead + Data-Science | CAI-REG-010 |
| M15 — Q3/27 | TD-Einreichung an NB | Reg.-Lead | TD-Paket |
| M16 | Stage-1-Audit (QMS) | NB | Audit-Report |
| M17 | Stage-2-Audit (TD + QMS) + CAPA | NB + QM | Audit-Report + CAPA |
| M18 — Q4/27 | Zertifikat + DoC + CE-Mark | Reg.-Lead | Zertifikat, DoC, EUDAMED-Eintrag |

## 3. Kritischer Pfad

```
Clinical Study (M8-M12)
  → CER Final (M13)
    → TD-Einreichung (M15)
      → Audits (M16-M17)
        → Zertifikat (M18)
```

**Puffer:** 4-6 Wochen an M12/M17 — Klinik-Studien können sich verzögern (Recruitment), NB-Feedback-Zyklen sind nicht immer planbar.

## 4. Parallel-Strang: Infrastruktur & Entwicklung

| Zeitraum | Strang |
|----------|--------|
| M0-M6 | Dev-Team: KI-Pipeline stabilisieren, Retrain-Infrastruktur |
| M6-M12 | Dev: Logging-/Audit-Infrastruktur für AI-Act-Compliance |
| M9-M15 | Dev: Usability-Refinements aus Formative-Evals |
| M12-M18 | Dev: Feature-Freeze für Zertifizierungs-Version, nur Bug-Fixes |

## 5. Code-Freeze-Strategie

- **M15 (Q3/27):** Major-Feature-Freeze für die zu zertifizierende Version.
- Ab da nur **genehmigte Change-Requests**, dokumentiert in Change-Log.
- Separater Git-Branch `release/ce-2027` für die Zertifizierungs-Version.
- Dev auf `main` läuft parallel für Phase 3 weiter, aber CE-Mark bezieht sich auf gelabelte Version.

## 6. Abhängigkeiten

| Abhängigkeit | Risiko | Mitigation |
|--------------|---------|------------|
| Ethik-Votum | Verzögerung | Paralleles Beantragen in Wien + 2 DE-Städten |
| Klinische Study-Recruitment | Drop-out | 3 Standorte, überrekrutieren (+20%) |
| NB-Kapazität | Wartezeit | Frühe Slot-Reservierung Q4/26 |
| AI-Act-Implementierungs-Guidelines | offen | frühzeitige Engagement mit BASG/BfArM |
| Clinical Study positive Ergebnisse | Akzeptanz-Risiko | Interim-Analyse M9 + Backup-Plan (Erweiterung / Rescope) |

## 7. Budget-Rhythmus

| Quartal | Ausgabe (€) |
|---------|-------------|
| Q3/26 | 40.000 (Setup, QMS-Aufbau) |
| Q4/26 | 60.000 (Consultant, Study-Start) |
| Q1/27 | 80.000 (Study-Durchführung, Pentest) |
| Q2/27 | 70.000 (Study-Abschluss, CER, Usability) |
| Q3/27 | 60.000 (NB Stage-1) |
| Q4/27 | 50.000 (NB Stage-2, DoC, Go-live) |
| **Summe** | **€360.000** |

## 8. Kommunikations-Plan

- **Wöchentlich:** Regulatory-Standup (30 Min, Cross-funktional)
- **Monatlich:** Steering-Committee-Update (CEO, CTO, Reg., QM, Clinical)
- **Quarterly:** Board-Update zum CE-Mark-Fortschritt
- **Ad-hoc:** bei Blocker / Scope-Änderung

## 9. Success-Metrics

- [ ] 0 Major-Findings in Audits
- [ ] Clinical-Study-Endpoints erreicht (Primary ≥ 85% Sensitivity)
- [ ] Zertifikat ausgestellt bis Q4/27
- [ ] CE-Mark innerhalb Budget ± 10%
- [ ] EUDAMED-Eintrag binnen 30 Tagen nach Zertifikat
