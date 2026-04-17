# 05 — Technical Documentation (TD)

**Dokument-ID:** CAI-REG-005
**Version:** 1.0 — Draft
**Basis:** MDR Annex II + III

## 1. Produkt-Identifikation

| Feld | Wert |
|------|------|
| Produktname | CareAI Clinical Decision Support |
| UDI-DI (Basis) | wird vor Zertifizierung beantragt |
| SRN (Single Registration Number) | beantragt bei EUDAMED |
| Hersteller | CareAI GmbH, Wien |
| Klassifizierung | MDR Klasse IIa |
| Nomenklatur | EMDN **J0203** (Decision Support Software) |

## 2. Produkt-Beschreibung

### 2.1 Systemarchitektur (High-Level)

```
┌─────────────────────────────────────────────────────────┐
│   Clients: Web (Next.js 15), Mobile (Expo/RN 52)       │
└──────────────┬──────────────────────┬──────────────────┘
               │ HTTPS/TLS 1.3         │
┌──────────────▼──────────────────────▼──────────────────┐
│   Next.js 15 App Router + Server Actions (Edge/Node)   │
│   + API-Routes (/api/*) — OpenAPI 3.1 spezifiziert     │
└──────────────┬──────────────────────────────────────────┘
               │
         ┌─────┴──────┬──────────────┬─────────────┐
         ▼            ▼              ▼             ▼
    PostgreSQL    LLM-Gateway    S3-Storage    Audit-Log
    (Primary      (Claude/       (Minio/AWS    (append-only,
    + Read-       GPT-4o,        S3, KMS-enc)  hash-chained)
    Replicas)     vLLM-lokal)
```

### 2.2 Software-Komponenten

| Komponente | Zweck | Sicherheitsklasse IEC 62304 |
|-------------|-------|-----------------------------|
| Frontend (Next.js) | UI, Formulare, Dashboards | B |
| API-Layer (Server Actions) | Business-Logic, AuthZ | B |
| Prädiktions-Engine | Risiko-Scoring | B |
| ASR-Integration (Whisper) | Sprache → Text | A |
| LLM-Gateway | Text-Strukturierung | B |
| Audit-Log | Nachverfolgbarkeit | B |
| Notification-Service | Alerts | B |

## 3. SOUP-Liste (Software of Unknown Provenance)

Vollständige Auflistung in `SOUP-Register.xlsx`. Auszug:

| # | SOUP | Version | Zweck | Risiko-Klasse |
|---|------|---------|-------|----------------|
| 1 | Next.js | 15.x | Web-Framework | B |
| 2 | React | 19.x | UI-Library | B |
| 3 | PostgreSQL | 16.x | DB | B |
| 4 | Drizzle ORM | 0.3x | SQL-Mapper | B |
| 5 | Node.js | 22 LTS | Runtime | B |
| 6 | OpenAI SDK | latest | LLM-API | B |
| 7 | Anthropic SDK | latest | LLM-API | B |
| 8 | @react-pdf/renderer | 4.x | PDF-Export | A |
| 9 | Tailwind CSS | 4.x | Styling | A |
| 10 | Zod | 3.x | Schema-Validation | B |
| 11 | whisper.cpp | latest | ASR (Fallback) | A |
| 12 | Better-Auth | 1.x | AuthN | B |

Pro SOUP: CVE-Monitoring via Snyk/Dependabot, monatliches Review, dokumentierte Einsatz-Rationale.

## 4. Cybersecurity-Plan (IEC 81001-5-1, MDCG 2019-16)

### 4.1 Threat-Model

STRIDE-Analyse pro Komponente dokumentiert (separates Dokument `CAI-SEC-TM-001`).

### 4.2 Security Controls

- **AuthN:** Better-Auth + MFA für Admins, WebAuthn-Option
- **AuthZ:** RBAC (5 Rollen), Row-Level-Security in PostgreSQL
- **Transport:** TLS 1.3, HSTS, CSP strict-dynamic
- **Data-at-Rest:** AES-256 via KMS, DB-Volume-Encryption
- **Secrets:** Vault / AWS Secrets Manager, kein Secret im Code
- **Audit:** append-only Audit-Log mit Hash-Chain, 10 Jahre Retention
- **Penetration-Testing:** jährlich (letzter: siehe `docs/PENTEST-CHECKLIST.md`)
- **Vulnerability-Management:** Snyk + Dependabot, SLA Critical < 7d, High < 30d
- **Incident-Response:** dokumentierter Playbook, MTTR-Ziele
- **Backup:** täglich, 3-2-1-Regel, jährlicher Restore-Test (Drill dokumentiert)

### 4.3 Coordinated Vulnerability Disclosure (CVD)

security@careai.at, PGP-Key publiziert, Response < 48h, security.txt gemäß RFC 9116.

## 5. Usability-Engineering (IEC 62366-1)

Usability-Engineering-File enthält:

- Use-Specification (Nutzergruppen, Use-Environment, Core-Use-Cases)
- User-Interface-Specification
- Use-related Risk Analysis (verknüpft mit Risk-Management)
- Formative Evaluation (min. 3 Iterationen, min. 5 Nutzer je Gruppe)
- Summative Evaluation (Usability-Validation, min. 15 Nutzer je Gruppe)
- Dokumentation aller Use-Errors + Abhilfemaßnahmen

## 6. Software Lifecycle Processes (IEC 62304)

**Sicherheitsklasse:** B (zugewiesen durch Risk-Mgmt).

Umgesetzte Prozesse:

| Prozess | Artefakt |
|---------|----------|
| Planung | Software-Development-Plan |
| Anforderungsanalyse | Software Requirements Specification (SRS) |
| Architektur-Design | Software Architecture Document |
| Detail-Design (nur Klasse C) | — (nicht zwingend B) |
| Implementation | Git-History + Code-Reviews (PR-Template enforced) |
| Integration + Testing | CI-Pipeline (GitHub Actions), Coverage ≥ 80% |
| System-Testing | E2E-Suite (Playwright) + manuelle Test-Protokolle |
| Release | Release-Checklist, signierte Artefakte |
| Problem-Resolution | Bug-Tracker (Linear), CAPA-Kopplung |
| Configuration-Management | Git, Semantic Versioning, Release-Notes |
| Maintenance-Process | dokumentiert, jährliches Review |

## 7. Design-History-File (DHF)

Gesamt-Repository aller Design-Artefakte versioniert in Git + zusätzlich archiviert im QMS-System (jede Freigabe als PDF mit Signatur).

## 8. Verifikation & Validierung

- **Unit-Tests:** Vitest, Coverage ≥ 80% für Klasse-B-Module
- **Integration-Tests:** PGlite-basierte DB-Tests
- **E2E-Tests:** Playwright, smoke + regression
- **Load-Tests:** siehe `docs/LOAD-TESTING.md`
- **Pentest:** jährlich extern
- **Usability-Validation:** siehe §5

## 9. Labeling — Referenz

Siehe Dokument 08 (Labeling / IFU).

## 10. Post-Market-Surveillance

Siehe Dokument 04 (CER / PMCF).

## 11. Änderungsverfolgung

Alle wesentlichen Änderungen an TD werden über ECR/ECO-Prozess (Engineering Change Request/Order) kontrolliert, Benannte Stelle wird gemäß MDR Art. 56 informiert.
