# Signals Playbook — Email-Opens & Link-Clicks interpretieren

Daten-basierte Follow-up-Entscheidungen statt Bauchgefühl.

---

## Tracking-Setup

- **Email-Provider:** Apollo, Mixmax, oder SalesLoft (mit Pixel-Tracking — DSGVO-konform via Legitime-Interest-Basis + Privacy-Hinweis im Footer)
- **Dataroom:** DocSend / Ansarada mit Viewer-Events
- **Call-to-Action-Links:** UTM-Parameter per Investor (`utm_source=invest&utm_medium=email&utm_campaign=seed&utm_content={investor-slug}`)
- **CRM:** Affinity oder Attio mit Event-Syncing

---

## Signal-Klassifikation

### Strong Positive (sofortige Action)

| Signal | Bedeutung | Action |
|--------|-----------|--------|
| **Deck im Dataroom > 5 Min** | Liest Details, nicht nur Cover | Follow-up 09 (Comp Intel) innerhalb 48h |
| **Wiederholter Open (3+×)** | Teilt intern, fragt Kolleg:innen | Angebot Team-Meeting |
| **Financials-Ordner geöffnet** | DD-Mode aktiv | Direct-Call-Outreach |
| **Reply "interessant, lass uns sprechen"** | Soft-commitment | Slot innerhalb 48h |
| **Unit-Economics-Seite > 2 Min** | Prüft die Economics ernst | Sende Cohort-Analyse proaktiv |

### Soft Positive (wachsam beobachten)

| Signal | Bedeutung | Action |
|--------|-----------|--------|
| **Einmaliger Open nach > 3 Tagen** | Interesse vorhanden, Priorität niedrig | Weiter monatlichen Nurture |
| **Deck geöffnet, weniger 60 Sek** | Schnell überflogen | Follow-up mit visuellerem Asset (Video 3-Min) |
| **Team-Seite > 30 Sek** | Bewertet Founder-Qualität | Team-Update (Mail 15) einsteuern |

### Negative / No Signal

| Signal | Bedeutung | Action |
|--------|-----------|--------|
| **No Open binnen 7 Tagen** | Spam-Filter / Uninteresse | 1× Resend mit neuem Subject, dann Archiv |
| **Open + No Click** | Oberflächliches Scannen | Neuer Angle (Hot-Take-Variante) |
| **Unsubscribe / Bounce** | Hard-no oder Change-of-Job | Aus Pipeline entfernen, ggf. neue Email suchen |

### Täuschend positive (Vorsicht)

| Signal | Warum täuschend | Korrigieren |
|--------|----------------|-------------|
| **"Spannend, bleiben wir in Kontakt"** | Soft-pass in höflich | Kurze Frage „Was würde mich Ihnen interessant machen?" |
| **Dataroom-Access-Request ohne Call-Follow-up** | Neugier, kein Ernst | Erst NDA unterschreiben, dann Access |
| **Lange Emails ohne konkrete Frage** | Stalling | Direct: „Möchten Sie ins Partner-Meeting?" |

---

## Automatisierungs-Ansatz

### Tier 1 — High-Intent-Trigger (manuell)
- Dataroom-Access > 5 Min Financials-Ordner → Slack-Alert @founder → direct outreach
- Deck-Open 3× innerhalb 7 Tagen → Telegram-Notification → direct outreach

### Tier 2 — Medium-Intent (halb-auto)
- Deck-Open 1× → nach 48h automatisch Follow-up-Template 08 queued, aber vor Versand Founder-Review
- Dataroom-Access 1× ohne Financials → Follow-up 09 geplant

### Tier 3 — Nurture (auto)
- Monthly Update versendet sich via Template an alle "Active" + "Lead" Stages
- Bei 3× No-Open → automatisch auf "Dormant" setzen, quartalsweise Check-up

---

## Metrics-Dashboard

Wöchentlicher Blick auf:

- **Email-Open-Rate** (Ziel: > 45% bei warmen Leads, > 28% bei Cold)
- **Click-Through-Rate** (Ziel: > 12% bei warmen)
- **Reply-Rate** (Ziel: > 15% bei warmen, > 4% bei Cold)
- **Dataroom-Engagement-Score** (Gewichtete Metrik: Öffnungen × Dauer × Ordner-Tiefe)

---

## Ethik-Hinweis

Tracking ist legitimes Interesse (Art. 6 Abs. 1 lit. f DSGVO) bei B2B-Investor-Outreach, solange:
- **Transparenz:** Email-Footer erklärt Tracking-Verwendung
- **Opt-Out:** Unsubscribe + Tracking-Opt-Out Link in jeder Mail
- **Minimale Daten:** Keine Personenprofil-Erstellung, nur Event-Counts
- **Löschung:** Nach 90 Tagen Inaktivität auto-Löschung

Nicht für Consumer-Outreach nutzbar. Für Investor-B2B okay.

---

## Don'ts

- **Don't:** Tracking als Basis für Aggressive-Follow-up nutzen ("Sie haben mein Deck 4× geöffnet!") — Creepy-Factor killt Beziehung.
- **Don't:** Signale überinterpretieren — ein Open ist nur ein Open.
- **Don't:** Tracking-Metriken ohne Kontext im Weekly-Team-Meeting präsentieren — falsche Erwartungen entstehen.
