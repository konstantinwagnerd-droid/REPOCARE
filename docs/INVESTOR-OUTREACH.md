# Investor Outreach — System & Playbook

15 Email-Templates + 5 Meta-Assets für strukturierte Investor-Ansprache von CareAI.

## Template-Übersicht

### Cold (5)
| # | Datei | Zielgruppe | Länge | Sprache |
|---|-------|------------|-------|---------|
| 01 | `01-seed-stage-angel.md` | Angels mit HealthTech-DNA | 150 | DE |
| 02 | `02-seed-stage-vc.md` | Seed-VCs mit HealthTech-Thesis | 180 | DE/EN hybrid |
| 03 | `03-strategic-healthtech.md` | Strategen (Fresenius, B. Braun, AOK) | 170 | DE |
| 04 | `04-impact-fund.md` | Impact-Fonds SFDR Art. 9 | 170 | EN |
| 05 | `05-family-office-austria.md` | Family-Offices AT | 160 | DE (formell-AT) |

### Follow-up (5)
| # | Datei | Trigger |
|---|-------|---------|
| 06 | `06-post-intro-followup.md` | Warmer Intro durch Dritte |
| 07 | `07-after-first-call-materials.md` | Innerhalb 3h nach Erstgespräch |
| 08 | `08-product-update-nudge.md` | 14-21 Tage Ghosting |
| 09 | `09-competitive-intel.md` | Dataroom-Open ohne Reply |
| 10 | `10-urgency-round-filling.md` | 10-14 Tage vor Soft-Close |

### Nurture (5)
| # | Datei | Frequenz |
|---|-------|----------|
| 11 | `11-monthly-update-q1.md` | Monatlich, Monate 1-3 |
| 12 | `12-monthly-update-q2.md` | Monatlich, Monate 4-6 |
| 13 | `13-milestone-announcement.md` | Ad-hoc, max 3×/Jahr |
| 14 | `14-partnership-news.md` | Ad-hoc, max 6×/Jahr |
| 15 | `15-team-growth.md` | Key-Hires, max 4×/Jahr |

## Template-Struktur (einheitlich)

Jede Email folgt demselben Aufbau:
- **Subject-Lines A/B/C** (max 55 Zeichen, für Mailtool-A/B-Tests)
- **Preview-Text** (max 90 Zeichen)
- **Body mit Platzhaltern** (`{firstName}`, `{fund}`, `{introducer}`, `{utmToken}`)
- **Signature-Block** (einheitlich)
- **2-3 Hot-Take-Varianten** als alternative Framings
- **Timing-Guidance** pro Template

## Meta-Assets

### `meta/investor-icp.md`
5 Investor-Cluster (HealthTech-Seed-VCs, Branchen-Angels, Impact-Fonds, Strategen, Family-Offices AT). Target-Tickets, Entscheidungs-Zeiten, Hot-Buttons pro Cluster. Disqualifikations-Fragen und Dealflow-Prioritäten.

### `meta/positioning-cheatsheet.md`
5 Framings je nach Investor-Typ (B2B-SaaS-Moat, System-Infrastruktur, KI-native-vs-Legacy, Compliance-First, Regional-Anchor). Mit Beweis-Slides und Framing-Don'ts.

### `meta/objection-handling.md`
10 häufigste Investor-Fragen mit strukturierten Antworten (Kurz + Tiefer + Beweis).

### `meta/dataroom-checklist.md`
11 Dataroom-Ordner-Struktur mit Access-Staging (auf Anfrage / nach NDA / vor Term-Sheet / Legal-DD). Hygiene-Regeln und Red-Flags.

### `meta/signals-playbook.md`
Email-Opens + Link-Clicks + Dataroom-Events interpretieren. Strong Positive / Soft Positive / Negative / Täuschend-Positive-Klassifikation mit konkreten Actions.

---

## Sequence-Logic

### Cold Pipeline
```
Mail 01/02/03/04/05 (Day 0)
     ↓ (no reply in 5 days)
LinkedIn-Touch (Day 6)
     ↓ (no engagement)
Mail 08 Product Update Nudge (Day 14)
     ↓ (no engagement)
Monthly Nurture (11/12)
     ↓ (3 monthly no-opens)
Archive → quarterly re-activation
```

### Warm Pipeline
```
Intro → Mail 06 (Day 0)
     ↓ (erster Call)
Mail 07 Materials (Day 1)
     ↓ (kein Fortschritt in 7 Tagen)
Mail 09 Competitive Intel (Day 8)
     ↓ (kein Fortschritt in 14 Tagen)
Monthly Nurture (11/12)
     ↓ (Round-Close in Sicht)
Mail 10 Urgency (Day T-14 vor Soft-Close)
```

---

## Automatisierungs-Ansatz

### Stufe 1 — Manuell (aktuell)
- Template-Auswahl und Personalisierung durch Founder
- CRM (Attio) trackt Stages, Interactions, Signals
- Send via Google Workspace (Founder-Email)

### Stufe 2 — Halb-automatisch (geplant ab Seed-Close)
- Mailtool (Apollo/Mixmax) für Cold-Sequences
- Monthly Nurture automatisch aus Template + aktuellen KPIs generiert
- Individual-Replies weiterhin manuell

### Stufe 3 — Assistiert (Series-A-Prep)
- KI-Assistent fasst Dataroom-Signale + CRM-History + Template-Pool zusammen
- Generiert Draft-Follow-ups, die Founder nur noch freigibt
- Signal-basierte Prioritäts-Queue

---

## CRM-Integration-Stub

```typescript
// Zukünftige Integration, aktuell Platzhalter

interface InvestorRecord {
  id: string;
  firstName: string;
  lastName: string;
  fund: string;
  cluster: "seed-vc" | "angel" | "impact" | "strategic" | "family-office";
  stage: "cold" | "warm" | "engaged" | "dd" | "committed" | "passed" | "dormant";
  lastInteraction: string; // ISO date
  lastTemplate: string; // e.g. "06-post-intro-followup"
  signals: {
    emailOpens: number;
    dataroomAccesses: number;
    dataroomMinutes: number;
    lastActivityAt: string;
  };
  notes: string;
}
```

---

## Compliance

### CAN-SPAM (US-Investor:innen)
- Absender-Adresse echt (kein No-Reply)
- Physische Adresse im Footer
- Ein-Klick-Unsubscribe in jeder Mail

### DSGVO (EU-Investor:innen)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. f (berechtigtes Interesse bei B2B-Outreach)
- Tracking-Hinweis im Footer: „Diese E-Mail enthält Öffnungs-Tracking zu Zwecken des berechtigten Kontakts. Widerspruch: {{unsubscribeLink}}"
- Datenminimierung: Nur Funktions-Mail + Name + Firma, kein Profiling
- Löschung: Nach 90 Tagen Inaktivität oder auf Antrag

### Versand-Hygiene
- Nicht > 50 Cold-Mails pro Tag aus einer Absender-Domain (Spam-Risiko)
- Warm-up-Sequence für neue Absender-Domains
- DMARC, DKIM, SPF für alle Sending-Domains konfigurieren

---

## Metrics

Wöchentlich tracken:

| Metrik | Ziel Cold | Ziel Warm |
|--------|-----------|-----------|
| Open Rate | > 28% | > 45% |
| Reply Rate | > 4% | > 15% |
| Meeting Booked (vom Open) | > 8% | > 30% |
| Meeting → Second Meeting | n/a | > 50% |
| Second Meeting → Term-Sheet | n/a | > 25% |

---

## Update-Zyklus

- **Monatlich:** Metriken reviewen, Templates mit schlechter Performance überarbeiten
- **Quartalsweise:** Neue Hot-Take-Varianten einführen, Meta-Dokumente aktualisieren
- **Pre-Round:** Alle Templates mit aktuellen Zahlen updaten (besonders Milestones und Monthly-Updates)
