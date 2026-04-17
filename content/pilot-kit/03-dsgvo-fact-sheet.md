# DSGVO-Fact-Sheet — CareAI

**2 Seiten für Datenschutz-Verantwortliche, DPOs und QMBs.**

---

## Seite 1 — Rechtliche Grundlagen & Rollen

### Rollen-Zuweisung

- **Sie (die Einrichtung) sind Verantwortliche:r** nach Art. 4 Nr. 7 DSGVO.
- **CareAI GmbH ist Auftragsverarbeiter:in** nach Art. 28 DSGVO.
- Der Auftragsverarbeitungsvertrag (AVV) wird beim Onboarding abgeschlossen — Entwurf liegt bei.

### Rechtmäßigkeit der Verarbeitung

Für Pflegedokumentation gilt:
- **Art. 6 Abs. 1 lit. c DSGVO** (rechtliche Verpflichtung) — v.a. § 10 GuKG, MuG Wien §31, Heimvertragsgesetz.
- **Art. 9 Abs. 2 lit. h DSGVO** (Gesundheitsvorsorge) — Gesundheitsdaten als Sonderkategorie.
- **Art. 9 Abs. 3 DSGVO** — Verarbeitung durch Berufsgeheimnisträger:innen.

Keine separate Einwilligung des:der Bewohners:in erforderlich für die reine Dokumentationspflicht. Einwilligung nur für zusätzliche optionale Features (z.B. Familien-App-Zugang Angehörige).

---

### Technisch-organisatorische Maßnahmen (TOM) — CareAI

**Zugangskontrolle:**
- 2-Faktor-Authentifizierung für alle Admins Pflicht, für Pflegekräfte empfohlen.
- Session-Timeout nach 8h Inaktivität.
- RBAC-Modell: 5 Rollen (Admin / PDL / Pflegekraft / Hilfskraft / Azubi).

**Zugriffskontrolle:**
- Mandantentrennung strikt (keine Datenmischung zwischen Einrichtungen).
- Wohnbereichs-basierte Sichtbarkeit konfigurierbar.
- Vollständiges Audit-Log aller Lesezugriffe (DSGVO-relevant).

**Weitergabekontrolle:**
- TLS 1.3 für alle Datenübertragungen.
- Export nur an berechtigte User, mit Empfänger-Log.

**Eingabekontrolle:**
- Audit-Log jedes Schreibzugriffs mit User-ID, Zeitstempel, Vor-/Nachher-Zustand.
- 24h-Bearbeitungsfenster, danach nur Nachträge (nicht löschbar).

**Verfügbarkeitskontrolle:**
- RTO 2h / RPO 15 Min.
- Backups verschlüsselt, geografisch getrennt, wöchentlich offline-geprüft.

**Trennungsgebot:**
- Datenbank pro Mandant logisch getrennt (row-level security).
- Staging-System ohne Produktionsdaten.

**Verschlüsselung:**
- Daten-at-Rest: AES-256.
- Daten-in-Transit: TLS 1.3.
- Backup-Verschlüsselung mit separaten Schlüsseln.

---

## Seite 2 — Aufbewahrung, Betroffenenrechte, Praxis

### Aufbewahrungsfristen (Österreich)

| Datenart | Frist | Rechtsgrundlage |
|----------|-------|-----------------|
| Pflegedokumentation | **10 Jahre** nach Versorgungsende | § 10 GuKG |
| Arzneimittel-Dokumentation | 10 Jahre | AMG, KAKuG |
| Abrechnungsunterlagen | 7 Jahre | BAO |
| Dienstplan-Daten | 3 Jahre | ArbVG |
| Einwilligungen / AVV | solange Verarbeitung + 3 Jahre | DSGVO |

**CareAI automatisch:** Nach Ablauf der Frist wird dokumentiert gelöscht, Löschprotokoll im System abrufbar.

---

### Betroffenenrechte — wie CareAI unterstützt

| Recht | CareAI-Funktion |
|-------|-----------------|
| **Art. 15 Auskunft** | 1-Klick-Export aller Daten zu einer Person als PDF, inkl. Verarbeitungszwecke |
| **Art. 16 Berichtigung** | Bearbeitungsfenster + Nachträge, Historie bleibt |
| **Art. 17 Löschung** | Workflow mit Prüfung gegen Aufbewahrungsfrist, automatisiert |
| **Art. 18 Einschränkung** | Markierung "eingeschränkt", Zugriff nur mit Grund |
| **Art. 20 Datenübertragbarkeit** | Export in strukturierten offenen Formaten (JSON, CSV) |
| **Art. 21 Widerspruch** | Markierung, manuelle Prüfung durch DPO |

---

### Subunternehmer (Sub-Prozessoren)

Transparenzliste — aktuell (Stand 2026-04):
- **Hetzner Online GmbH** (Hosting, EU-Rechenzentrum Deutschland/Österreich)
- **SendGrid (Twilio)** (transaktionale E-Mails, DPA & SCCs vorhanden)
- **Stripe Payments Europe** (Zahlungsabwicklung, keine Pflegedaten)
- **OpenAI Ireland** (LLM für Voice-to-Text, mit Zero-Retention-Agreement, Opt-in)

Vollständige aktuelle Liste auf careai.at/subprocessors. Änderungen werden 30 Tage vorher angekündigt.

---

### Was passiert bei einer Data-Breach?

Siehe Runbook `dr-scenarios/03-data-breach.md`:
- Sofort-Containment durch CareAI, Sie werden in den ersten 24h informiert.
- 72h-Meldung an Datenschutzbehörde (CareAI unterstützt mit Evidenz-Paket).
- Falls Art. 34 anwendbar: gemeinsame Strategie für Benachrichtigung Betroffener.

---

### Kontakt

**CareAI Data Protection Officer:**
- 📧 dpo@careai.at
- Postanschrift: CareAI GmbH, DPO, [Adresse], Wien
- Meldungen auch anonym möglich über: careai.at/whistleblower

**Sie möchten unseren aktuellen ISO-27001-Bericht oder TOM-Report?** Unter NDA verfügbar bei dpo@careai.at.
