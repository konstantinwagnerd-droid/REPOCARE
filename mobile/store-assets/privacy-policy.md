# Datenschutzerklärung — CareAI Pflegekraft App (iOS/Android)

**Stand:** 2026-04-17
**Verantwortlich:** CareAI GmbH, [Anschrift], Wien, Österreich
**DSB-Kontakt:** dsb@careai.at

Diese Erklärung gilt **für die mobile App** und ergänzt die allgemeine [Datenschutzerklärung](https://careai.at/rechtliches/datenschutz).

## 1. Daten, die wir verarbeiten

### 1.1 Account-Daten
- Name, berufliche E-Mail, Rolle, Einrichtungs-Zuordnung
- **Rechtsgrundlage:** Art. 6(1)(b) DSGVO (Vertrag)

### 1.2 Nutzungsdaten
- Gerätetyp, OS-Version, App-Version, IP-Adresse (gekürzt), Crash-Logs
- **Rechtsgrundlage:** Art. 6(1)(f) DSGVO (berechtigtes Interesse: App-Stabilität)
- **Speicherdauer:** 90 Tage

### 1.3 Audio-Daten (bei Sprachdiktat)
- Aufnahmen werden auf Server verarbeitet, danach **gelöscht** (max. 24h Retention, nur für Qualitätssicherung bei expliziter Opt-in)
- **Rechtsgrundlage:** Art. 6(1)(b) DSGVO (Vertragserfüllung)

### 1.4 Gesundheitsdaten (Bewohner-bezogen, pseudonymisiert)
- Strukturierte Pflegedokumentation, SIS-Einträge, Tagesberichte
- **Rechtsgrundlage:** Art. 9(2)(h) DSGVO iVm § 2 GuKG / § 22 BDSG

### 1.5 Keine Werbung, keine Tracker
- Wir nutzen **keine Werbe-IDs**, **keine Third-Party-Tracker**, **keine Analyse-SDKs mit Drittlandtransfer** (kein Google Analytics, kein Facebook SDK).

## 2. Berechtigungen (Permissions)

| Permission | Zweck | Pflicht? |
|-------------|-------|----------|
| Mikrofon | Sprachdiktat | optional |
| Kamera | Wund-Dokumentation | optional |
| Push-Notifications | Alerts, Übergaben | optional |
| Face/Touch ID / Biometric | Login | optional |
| Netzwerk | App-Funktion | ja |
| Speicher (lokal) | Offline-Cache | ja |

Alle Permissions werden kontextuell angefragt, nicht beim ersten Start.

## 3. Datenübermittlung

- **Hosting:** AT-Rechenzentrum (ISO 27001). Optional DE-Region (ebenfalls ISO 27001).
- **Keine Drittland-Übermittlung** in USA ohne DPA + SCCs.
- **LLM-Provider (GPT/Claude):** nur für explizit freigegebene Features, **kein Training auf Kundendaten**, EU-Region bevorzugt, DPA unterschrieben.
- **Auftragsverarbeiter** gemäß Art. 28 DSGVO, vollständig gelistet im **Verzeichnis der Verarbeitungstätigkeiten** (auf Anfrage).

## 4. Betroffenenrechte

- **Auskunft** (Art. 15)
- **Berichtigung** (Art. 16)
- **Löschung** (Art. 17, unter Beachtung Berufsrechts-Aufbewahrungspflichten für Pflegedokumentation: **AT 10 Jahre, DE 10-30 Jahre**)
- **Einschränkung** (Art. 18)
- **Widerspruch** (Art. 21)
- **Datenportabilität** (Art. 20)
- **Beschwerde** bei Aufsichtsbehörde (AT: DSB, DE: BfDI / LfD, CH: EDÖB)

Kontakt: **dsb@careai.at**

## 5. Sicherheit

- TLS 1.3
- Verschlüsselung at-Rest (AES-256)
- Pseudonymisierung wo möglich
- MFA für privilegierte Rollen
- Penetration-Tests jährlich
- ISO 27001 / ISO 27799 Alignment
- Incident-Response-Playbook dokumentiert

## 6. Kinder

Die App ist **nicht für Kinder** gedacht. Mindestalter: 18 Jahre (berufliche Nutzung).

## 7. Änderungen

Änderungen dieser Erklärung werden in der App angekündigt (Login-Banner). Eine ältere Version ist über den DSB abrufbar.

## 8. Kontakt

**CareAI GmbH**
[Anschrift], Wien, Österreich
dsb@careai.at
Support: support@careai.at
