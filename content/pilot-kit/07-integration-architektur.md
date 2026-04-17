# Integrations-Architektur — CareAI

**Wie CareAI sich in Ihre bestehende Tool-Landschaft einfügt.**

---

## Übersicht

CareAI ist kein geschlossenes System. Es fügt sich ein, spricht mit anderem, und ist so offen wie möglich, so sicher wie nötig.

```
            ┌─────────────────────────────────────────┐
            │         PFLEGE-EINRICHTUNG              │
            │                                         │
            │  ┌───────────┐      ┌───────────────┐   │
            │  │ Tablets/  │      │ Arbeits-PCs    │   │
            │  │ Smartphones│      │ (Verwaltung)   │   │
            │  └─────┬─────┘      └────────┬───────┘   │
            │        │                     │            │
            │        └─────────┬───────────┘            │
            │                  │                        │
            │           ┌──────▼───────┐                │
            │           │   CareAI     │  Web + Mobile  │
            │           │   Frontend   │                │
            │           └──────┬───────┘                │
            └──────────────────┼────────────────────────┘
                               │  TLS 1.3
                               ▼
            ┌──────────────────────────────────────────┐
            │     CareAI CLOUD (Hetzner, EU)           │
            │                                          │
            │  ┌────────────┐  ┌────────────────────┐  │
            │  │  API /     │  │  Voice Processing  │  │
            │  │  Business  │──┤  (EU-Hosted LLM)  │  │
            │  │  Logic     │  └────────────────────┘  │
            │  └─────┬──────┘                          │
            │        │                                 │
            │  ┌─────▼──────┐    ┌──────────────────┐  │
            │  │ PostgreSQL │    │ Object Storage   │  │
            │  │ (Mandant-  │    │ (Dokumente,      │  │
            │  │  isoliert) │    │  Audios)         │  │
            │  └────────────┘    └──────────────────┘  │
            │                                          │
            │  ┌──────────────────────────────────┐    │
            │  │      Integrations-Layer          │    │
            │  │   (REST + HL7/FHIR + SFTP)       │    │
            │  └─────────┬────────────────────────┘    │
            └────────────┼─────────────────────────────┘
                         │
            ┌────────────┼────────────────┐
            ▼            ▼                ▼
      ┌─────────┐  ┌───────────┐   ┌──────────────┐
      │ Apotheke│  │ Arzt-     │   │ Abrechnungs- │
      │ ERP     │  │ Netzwerk  │   │ systeme      │
      │ (HL7)   │  │ (eGK/ELGA)│   │ (DATEV,      │
      └─────────┘  └───────────┘   │  BuchhPro)   │
                                   └──────────────┘
            ┌──────────────────────────────────┐
            │   Alt-Pflegesoftware             │
            │   (Vivendi, MediFox, Connext)    │
            │   → Migration zu CareAI          │
            └──────────────────────────────────┘
```

---

## Tool-Landschaft im Detail

### Eingehende Schnittstellen (Daten zu CareAI)

**Alt-System-Migration (einmalig):**
- Konnektoren für Vivendi, MediFox-Dan, Connext, Senso, TOPSoz, MEDIFOX.
- Format: direkte DB-Connector oder CSV/Excel-Export.
- Mapping-Tool mit Vorschau, Rollback möglich.

**Laufende Importe:**
- Stammdaten aus HR-System (CSV-SFTP täglich).
- Dienstplan-Import aus Personal-Planern (z.B. Papershift).

### Ausgehende Schnittstellen (Daten aus CareAI)

**Arzneimittel & Apotheken:**
- HL7 v2.x und FHIR R4.
- Standard: BezugsApotheken, partizipierende Kassa-Apotheken.

**Arzt / Krankenhaus:**
- ELGA-Anbindung (Österreich) für Entlassungsberichte.
- e-Medikation Interface.
- Secure-Mail (Kim in Deutschland / e-Health Austria).

**Abrechnung:**
- DATEV-Export (CSV + ASCII).
- Buchungs-Export BuchhaltungsPro, BMD, RZL.
- Kasse-Schnittstellen (SOKA, ÖGK).

**QM & Controlling:**
- CSV / Excel für Microsoft Power BI.
- REST-API für eigene Dashboards.
- Webhook-Support für Echtzeit-Events.

---

### Identity & Single-Sign-On

- **SAML 2.0** für Enterprise (Azure AD, Okta, Keycloak).
- **OAuth2 / OIDC** für moderne IdPs.
- **Fallback:** Passwort + 2FA direkt in CareAI.

Aktive Integrationen Pilotkunden: Microsoft Entra ID (Azure AD), Google Workspace, LDAP.

---

## Sicherheit der Integrationen

**Immer:**
- TLS 1.3, gültige Zertifikate (Let's Encrypt / dedizierte CA bei Enterprise).
- API-Keys rotieren alle 90 Tage, Notification 14 Tage vor Ablauf.
- Alle Schnittstellen im Audit-Log.

**Bei HL7/FHIR:**
- Mutual TLS (mTLS) wo angebracht.
- IP-Whitelist.
- Rate-Limiting.

**Bei SFTP:**
- SSH-Key-Auth, keine Passwörter.
- Chroot-Jail pro Kunde.
- Jeden Upload signiert (GPG).

---

## Performance

- Echtzeit-APIs: < 300ms p95.
- Batch-Imports: bis 100.000 Datensätze / 5 Min.
- Events via Webhook: < 2s End-to-End.

---

## Kosten & Setup

| Integration | Setup | Monatliche Kosten |
|-------------|-------|-------------------|
| Alt-System-Migration | einmalig, im Onboarding inkl. (bis 200 Betten) | 0 |
| DATEV-Export | inkludiert in jedem Tarif | 0 |
| HL7/FHIR-Gateway | ab Tarif „Plus" | inkl. |
| Enterprise-APIs / SAML | Tarif „Enterprise" | inkl. |
| Custom-Integration (nicht-Standard) | Scoping-Angebot | ab EUR 150/Monat |

---

## Kontakt für Integrations-Fragen

- 📧 integrations@careai.at
- Response-Zeit: < 24h werktags
- Erstes Scoping-Call binnen 5 Werktagen, kostenlos, unverbindlich.
