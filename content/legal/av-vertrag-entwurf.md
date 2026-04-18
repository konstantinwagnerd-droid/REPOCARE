# Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO

**zwischen**

**{{EINRICHTUNG_NAME}}**, {{EINRICHTUNG_ADRESSE}}, vertreten durch {{VERTRETUNGSBERECHTIGTER}}
— nachfolgend „**Verantwortlicher**" —

**und**

**CareAI GmbH (i.G.)**, {{CAREAI_ADRESSE}}, Wien, Österreich, vertreten durch den/die Geschäftsführer/in
— nachfolgend „**Auftragsverarbeiter**" —

gemeinsam auch als „Parteien" bezeichnet.

---

## Präambel

Der Verantwortliche hat den Auftragsverarbeiter im Rahmen des Hauptvertrages vom **{{DATUM_HAUPTVERTRAG}}** mit der Erbringung von Leistungen im Bereich KI-gestützter Pflegedokumentation, Dienstplanung und Abrechnungs­vorbereitung beauftragt. Im Rahmen dieser Leistungen werden personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet. Dieser Vertrag regelt die datenschutzrechtlichen Pflichten der Parteien gemäß **Art. 28 Verordnung (EU) 2016/679 (DSGVO)** sowie — soweit anwendbar — des **deutschen Bundesdatenschutzgesetzes (BDSG)** und des **österreichischen Datenschutzgesetzes (DSG)**.

---

## § 1  Gegenstand und Dauer

1. **Gegenstand:** Verarbeitung personenbezogener Daten durch den Auftragsverarbeiter im Rahmen des Hauptvertrages (Nutzung der CareAI-Plattform zur Pflegedokumentation, Dienstplanung, Abrechnung, Sprach-KI, Berichtswesen).
2. **Dauer:** Dieser Vertrag tritt mit Unterzeichnung in Kraft und endet automatisch mit Beendigung des Hauptvertrages, frühestens jedoch nach vollständiger Rückgabe oder Löschung aller Daten gemäß § 9.

## § 2  Art und Zweck der Verarbeitung

1. **Art:** Erheben, Erfassen, Ordnen, Speichern, Anpassen, Auslesen, Abfragen, Verwenden, Offenlegen, Übermitteln, Verknüpfen, Einschränken, Löschen.
2. **Zweck:** Bereitstellung der vertraglich vereinbarten SaaS-Leistungen zur Pflegedokumentation, Dienstplanung, Medikations­management, Angehörigen-Kommunikation, Abrechnungs­vorbereitung, KI-gestützter Assistenz, Auswertung und Reporting.
3. Eine Verwendung der Daten zu **eigenen Zwecken** des Auftragsverarbeiters — insbesondere zum **Training von KI-Modellen** — ist **ausgeschlossen**.

## § 3  Art der personenbezogenen Daten

Siehe **Anlage 1**. Insbesondere können verarbeitet werden:
- Stammdaten der Bewohner / Klienten (Name, Geburtsdatum, Adresse, Kontaktdaten)
- Gesundheitsdaten (Art. 9 DSGVO): Pflegegrad, Diagnosen, Medikation, Vitalwerte, Pflegedokumentation
- Daten der Angehörigen / gesetzlichen Vertreter
- Mitarbeiterdaten (Stammdaten, Dienstplan, Qualifikation, Zeiterfassung)
- Abrechnungsdaten (Versichertennummer, Kassenzugehörigkeit, Leistungen)

## § 4  Kreis der betroffenen Personen

Siehe **Anlage 1**. Insbesondere: Bewohner / Klienten, Angehörige, gesetzliche Vertreter, Mitarbeitende, externe Dienstleister.

## § 5  Pflichten des Auftragsverarbeiters

1. **Weisungsgebundenheit:** Verarbeitung ausschließlich auf dokumentierte Weisung des Verantwortlichen (Art. 28 Abs. 3 lit. a DSGVO). Der Hauptvertrag inkl. dieses AVV stellt die Grund-Weisung dar.
2. **Vertraulichkeit:** Verpflichtung aller mit der Verarbeitung betrauten Personen auf Vertraulichkeit nach Art. 28 Abs. 3 lit. b i.V.m. Art. 29 DSGVO sowie — soweit einschlägig — auf das Datengeheimnis nach § 6 öDSG.
3. **Technische und organisatorische Maßnahmen (TOM):** siehe **Anlage 2** (Art. 32 DSGVO).
4. **Unterstützung:** Unterstützung des Verantwortlichen bei der Erfüllung der Betroffenenrechte (Art. 12–23 DSGVO), Sicherheit der Verarbeitung (Art. 32), Meldung von Datenschutz­verletzungen (Art. 33 / 34), DSFA (Art. 35) und Konsultation der Aufsichtsbehörde (Art. 36).
5. **Löschung / Rückgabe** nach Wahl des Verantwortlichen gemäß § 9.
6. **Nachweispflichten:** Der Auftragsverarbeiter stellt dem Verantwortlichen alle zur Nachweis­erbringung erforderlichen Informationen zur Verfügung (Art. 28 Abs. 3 lit. h DSGVO).
7. **Datenschutzbeauftragter:** Der Auftragsverarbeiter hat einen Datenschutzbeauftragten benannt (Name und Kontakt in Anlage 3, bzw. wird binnen 30 Tagen nach Gründung benannt).
8. **EU-Verarbeitung:** Verarbeitung erfolgt ausschließlich innerhalb der EU / des EWR. Eine Übermittlung in Drittländer erfolgt nur nach vorheriger schriftlicher Weisung und nur bei Vorliegen geeigneter Garantien (Art. 46 DSGVO).

## § 6  Technische und organisatorische Maßnahmen (Art. 32 DSGVO)

Der Auftragsverarbeiter ergreift die in **Anlage 2** beschriebenen TOM. Die Angemessenheit der TOM wird jährlich überprüft. Der Verantwortliche kann auf begründetes Verlangen eine aktualisierte Fassung erhalten.

Wesentliche Maßnahmen (Auszug, Detail in Anlage 2):
- Hosting in Hetzner Online GmbH, Rechenzentrum Falkenstein (DE), ISO 27001
- Verschlüsselung In-Transit (TLS 1.3), At-Rest (AES-256)
- Rollenbasierte Zugriffskontrolle (RBAC), 2-Faktor-Authentifizierung für Admins
- Impersonation-Log, Audit-Trail für privilegierten Zugriff
- Backups täglich inkrementell / wöchentlich voll, 35 Tage rollierend
- Incident-Response-Plan mit 72h-Meldeweg

## § 7  Unter-Auftragsverhältnisse

1. Der Verantwortliche erteilt hiermit **allgemeine schriftliche Genehmigung** zum Einsatz von Unter-Auftragsverarbeitern (Art. 28 Abs. 2 DSGVO).
2. Die aktuelle Liste ergibt sich aus **Anlage 3** und unter **careai.health/datenschutz/subprocessors**.
3. Der Auftragsverarbeiter informiert den Verantwortlichen **mindestens 30 Tage im Voraus** über beabsichtigte Änderungen (Hinzufügen, Ersetzen). Der Verantwortliche kann gegen eine beabsichtigte Änderung aus berechtigtem Grund widersprechen; in diesem Fall sind die Parteien zu einer einvernehmlichen Lösung verpflichtet, andernfalls steht dem Verantwortlichen ein Sonderkündigungsrecht zu.
4. Der Auftragsverarbeiter verpflichtet Unter-Auftragsverarbeiter schriftlich auf gleichwertige Pflichten (Art. 28 Abs. 4 DSGVO).

## § 8  Rechte der betroffenen Personen

1. Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Bearbeitung von Anfragen betroffener Personen (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Art. 15–22 DSGVO).
2. Direkt an den Auftragsverarbeiter gerichtete Anfragen werden **unverzüglich, spätestens binnen 3 Werktagen**, an den Verantwortlichen weitergeleitet.
3. Self-Service-Tools (In-App-Export, Löschfunktion) werden als Unterstützung bereitgestellt.

## § 9  Löschung oder Rückgabe nach Auftragsende

1. Nach Beendigung der Verarbeitung stellt der Auftragsverarbeiter dem Verantwortlichen **alle personenbezogenen Daten** in strukturiertem, maschinenlesbarem Format (JSON / CSV) binnen **30 Tagen** zur Verfügung.
2. Nach bestätigter Übergabe werden alle Daten einschließlich Kopien **auditierbar gelöscht** (DIN 66398); Backups laufen gemäß rollierender Vorhaltung (max. 35 Tage) aus und werden ebenfalls gelöscht.
3. **Löschprotokoll** wird dem Verantwortlichen schriftlich übermittelt.
4. Gesetzliche Aufbewahrungspflichten des Auftragsverarbeiters bleiben unberührt (die Daten werden in diesem Fall gesperrt und zweckgebunden aufbewahrt).

## § 10  Prüf- und Kontrollrechte

1. Der Verantwortliche ist berechtigt, die Einhaltung dieses Vertrages **nach vorheriger Ankündigung mit angemessener Frist (mindestens 14 Tage)** während der üblichen Geschäftszeiten zu kontrollieren.
2. Der Auftragsverarbeiter stellt auf Anforderung zur Verfügung:
   - aktuelle TOM-Beschreibung
   - Zertifikate (ISO 27001 des Hosting-Partners, SOC 2 soweit verfügbar)
   - Ergebnisse letzter Penetrationstests (zusammenfassend, ohne Offenlegung von Findings)
3. Vor-Ort-Kontrollen in Hetzner-Rechenzentren erfolgen nach den dortigen Besucherregeln und sind auf Antrag möglich.
4. Alternativ erkennt der Verantwortliche ein **unabhängiges Auditor-Zertifikat** (z.B. ISAE 3402, ISO 27001 für CareAI-Systeme sobald vorliegend) als Nachweis an.

## § 11  Meldung von Datenschutzverletzungen (Art. 33 / 34 DSGVO)

1. Bei Verletzung des Schutzes personenbezogener Daten informiert der Auftragsverarbeiter den Verantwortlichen **unverzüglich, spätestens binnen 24 Stunden** nach Kenntnis.
2. Meldung enthält:
   - Beschreibung der Art der Verletzung
   - betroffene Datenkategorien und Personengruppen (soweit feststellbar)
   - wahrscheinliche Folgen
   - ergriffene / vorgeschlagene Maßnahmen
3. Der Auftragsverarbeiter unterstützt den Verantwortlichen bei dessen Meldung an die Aufsichtsbehörde (72-Stunden-Frist nach Art. 33 DSGVO) und ggf. an Betroffene (Art. 34).

## § 12  Haftung

1. Es gilt die Haftungsregelung des Hauptvertrages, jedoch unberührt bleibt die Haftung nach **Art. 82 DSGVO**.
2. Die Parteien stellen sich im Innenverhältnis im jeweiligen Anteil ihrer Verantwortlichkeit frei (Art. 82 Abs. 5 DSGVO).

## § 13  Schlussbestimmungen

1. **Schriftform:** Änderungen und Ergänzungen bedürfen der Textform.
2. **Kollision:** Bei Widersprüchen zwischen Hauptvertrag und diesem AVV gehen die Regelungen dieses AVV vor.
3. **Salvatorische Klausel:** Unwirksamkeit einzelner Bestimmungen berührt die Gültigkeit der übrigen nicht.
4. **Anwendbares Recht:** Österreichisches Recht (für AT-Verantwortliche) bzw. deutsches Recht (für DE-Verantwortliche). Gerichtsstand: Sitz des Verantwortlichen.

---

**Ort, Datum:** {{ORT}}, {{DATUM}}

Für den **Verantwortlichen**

_________________________________
{{VERTRETUNGSBERECHTIGTER}} — {{EINRICHTUNG_NAME}}

Für den **Auftragsverarbeiter**

_________________________________
Geschäftsführung — CareAI GmbH (i.G.)

---

## Anlage 1 — Kategorien der Daten und betroffenen Personen

### 1.1 Datenkategorien

| Kategorie | Beispiele | Art. 9 DSGVO? |
|---|---|---|
| Stammdaten Bewohner | Name, Geburtsdatum, Adresse | nein |
| Gesundheitsdaten | Diagnosen, Medikation, Pflegegrad, Vitalwerte, Wunddokumentation | **ja** |
| Sozialdaten | Betreuungsverfügung, Vollmacht, Angehörige | nein |
| Abrechnungsdaten | Kassen-ID, Versichertennummer, Leistungsnachweise | nein |
| Mitarbeiterdaten | Stammdaten, Qualifikation, Dienstplan, Zeiterfassung | nein |
| Kommunikation | Angehörigen-Chat, Bot-Eingaben, E-Mails | ggf. ja |
| Technische Daten | IP, Session-Token, Audit-Logs | nein |
| Voice-Daten | Sprachaufnahmen (nicht persistent), Transkripte (opt-in) | **ja** |

### 1.2 Betroffenenkategorien

Bewohner / Klienten · Angehörige / gesetzliche Vertreter · Pflegepersonal · Ärzte / Therapeuten (soweit dokumentiert) · Verwaltungs­mitarbeiter · externe Dienstleister.

---

## Anlage 2 — Technische und organisatorische Maßnahmen (TOM)

Vollständige TOM-Beschreibung siehe separates Dokument **`tom-careai.md`**. Zusammenfassung nach BayLDA-Matrix:

1. **Zutrittskontrolle** — Hetzner-RZ Falkenstein: biometrische Zutrittskontrolle, Videoüberwachung 24/7, Mantrap, Brandschutz (Argon), USV + Diesel-Generator 72h.
2. **Zugangskontrolle** — 2FA / TOTP für Admins, starke Passwort-Policy, SSO-Optionen (SAML / OIDC), Account-Lockout nach 5 Fehlversuchen.
3. **Zugriffskontrolle** — RBAC mit Minimalprinzip, Impersonation-Audit-Log, Segregation of Duties, vierteljährliche Berechtigungs-Review.
4. **Trennungskontrolle** — Multi-Tenancy mit Row-Level-Security, separate Schemas je Einrichtung, separate Backup-Encryption-Keys.
5. **Pseudonymisierung** — Bewohner-IDs, Token-basierte externe Referenzen, Analytics ohne Klardaten.
6. **Verschlüsselung** — TLS 1.3 In-Transit, AES-256 At-Rest, Postgres TDE, verschlüsselte Backups, HSM-verwaltete Master-Keys.
7. **Integrität** — Hash-Chains für Pflegedokumentation, unveränderbare Audit-Logs (append-only), Signaturen bei PDF-Export.
8. **Verfügbarkeit / Belastbarkeit** — SLA 99,9%, Multi-AZ, DB-Replikation, RPO ≤ 1h, RTO ≤ 4h, jährliche DR-Tests.

---

## Anlage 3 — Unter-Auftragsverarbeiter (Stand {{DATUM}})

| Name | Anschrift | Leistung | Standort Verarbeitung |
|---|---|---|---|
| Hetzner Online GmbH | Industriestr. 25, 91710 Gunzenhausen, DE | Hosting, Backups | Falkenstein, DE |
| Anthropic PBC | 548 Market St, San Francisco, USA — EU-Endpoint | LLM-Inferenz | Frankfurt, DE |
| Supabase, Inc. | San Francisco, USA — EU-Region | Managed Postgres | Frankfurt, DE |
| Vercel, Inc. | San Francisco, USA — EU-Region | Application Hosting | Frankfurt, DE |
| Resend (Drip, Inc.) | San Francisco, USA — EU-Region | Transaktionsmail | Irland (EU) |
| Cloudflare, Inc. | San Francisco, USA | CDN, WAF, DDoS-Schutz | EU-first Routing |

Für Anbieter mit US-Muttergesellschaft liegen Standardvertrags­klauseln (SCCs, Modul „Prozessor-zu-Sub-Prozessor") gemäß Durchführungs­beschluss (EU) 2021/914 vor; darüber hinaus ist die Verarbeitung auf EU-Regionen beschränkt und — wo möglich — durch die **EU-US Data Privacy Framework** Zertifizierung abgesichert.

**Öffentliche Liste:** `https://repocare.vercel.app/datenschutz/subprocessors`

---

**Dokument-ID:** `AVV-CAREAI-v1.0-{{DATUM}}` · **Version:** 1.0 · **Stand:** 2026-04-18

**Quellen:** GDD-Muster AV-Vertrag (gdd.de, Abruf 2026-04-18) · EDSA Leitlinien 07/2020 zu den Begriffen „Verantwortlicher" und „Auftragsverarbeiter" (edpb.europa.eu, Abruf 2026-04-18) · BfDI Arbeitshilfe zu Art. 28 DSGVO (bfdi.bund.de, Abruf 2026-04-18) · DSB Österreich Musterformular Auftragsverarbeiter­vertrag (dsb.gv.at, Abruf 2026-04-18).
