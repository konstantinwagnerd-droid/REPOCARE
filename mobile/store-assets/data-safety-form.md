# Google Play — Data Safety Form (CareAI Pflegekraft)

Vorausgefülltes Template für die Data-Safety-Sektion im Play-Console-Dashboard.

## 1. Data Collection

**Sammelt oder teilt Ihre App Nutzerdaten?** → **Ja**

## 2. Datentypen (Data Collected)

### 2.1 Personal Info

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| Name | Ja | Nein | Nein | Required | Account-Funktionalität |
| E-Mail-Adresse | Ja | Nein | Nein | Required | Account, Kommunikation |
| User-ID | Ja | Nein | Nein | Required | Account-Identifikation |

### 2.2 Health & Fitness

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| Health Info (Bewohner-Daten via Fachperson) | Ja | Nein | Nein | Required | App-Funktionalität (Pflegedokumentation) |

Hinweis: Gesundheitsdaten beziehen sich auf **betreute Bewohner:innen**, nicht auf den App-Nutzer selbst. Nutzer:innen dokumentieren im beruflichen Kontext. Rechtsgrundlage DSGVO Art. 9(2)(h).

### 2.3 Audio

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| Voice / Sound Recordings | Ja | Nein | **Ja** (verarbeitet + gelöscht innerhalb 24h) | Optional | App-Funktionalität (Sprachdiktat) |

### 2.4 Photos

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| Photos | Ja (nur wenn Wund-Doku genutzt) | Nein | Nein | Optional | App-Funktionalität |

### 2.5 App Activity

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| App Interactions | Ja | Nein | Nein | Required | Audit-Trail + App-Funktionalität |
| Crash Logs | Ja | Nein | Nein | Optional | Analytics (interne Stabilität) |
| Diagnostics | Ja | Nein | Nein | Optional | Analytics (interne Stabilität) |

### 2.6 Device / Other IDs

| Datentyp | Collected | Shared | Processed ephemeral | Required/Optional | Purpose |
|----------|-----------|--------|---------------------|--------------------|---------|
| Device or Other IDs | Ja | Nein | Nein | Required | Geräte-Zuordnung, Fraud Prevention |

## 3. Data NOT Collected

- Keine Location-Daten
- Keine Kontakte
- Keine Kalender-Daten
- Keine Werbe-IDs (ADID)
- Keine Financial Info
- Keine Web-Browsing-History
- Keine Messages (SMS/E-Mails des Geräts)
- Keine Sensitiven Info außer Health (Bewohner-bezogen, pseudonymisiert verarbeitet)

## 4. Data Sharing

**Shared with third parties?** → **Nein**

Begründung: CareAI verarbeitet Daten ausschließlich in eigenen Systemen und mit Auftragsverarbeitern (nicht "sharing" i.S.d. Google-Definition). Subprocessor-Liste auf Anfrage.

## 5. Security Practices

**Data is encrypted in transit?** → **Ja** (TLS 1.3)
**Users can request that data be deleted?** → **Ja** (über dsb@careai.at + In-App-Funktion geplant)

## 6. Committed to following Play Families Policy?

**Nein** — App ist **nicht für Kinder** gedacht.

## 7. Ziel-Audience

- Adults only (berufliche Nutzung, Min. 18 Jahre)

## 8. Data Deletion

- **Account-Löschung:** Request via dsb@careai.at → Bearbeitung binnen 30 Tagen.
- **Pflegedokumentation:** unterliegt Aufbewahrungspflichten (AT 10 J / DE 10-30 J). Nach Ablauf sicher gelöscht.
- **Self-service Deletion in App:** geplant Q3/2027.

## 9. Additional Disclosures

Im Play-Store wird **CareAI Enterprise-Kontext** klargestellt (Invite-Code, keine Eigen-Registrierung), um Missverständnisse durch Consumer zu vermeiden.

## 10. Responsible Contact

**Data Protection Officer:** dsb@careai.at
**Security Contact:** security@careai.at
**Support:** support@careai.at
