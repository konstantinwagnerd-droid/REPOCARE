# CareAI — Finale 15-Minuten Investor-Tour

> Diese Tour fuehrt durch alle Hauptfunktionen in optimaler Reihenfolge fuer
> einen Investoren- oder Stakeholder-Pitch. Geschaetzte Gesamtdauer: **15 Min**.
> Jeder Schritt enthält Klick-Pfade, Erwartungswerte und Fallback-Saetze.

---

## Vorbereitung (vor dem Pitch — 5 Min)

1. App lokal starten: `npm run dev` oder Production-URL aufrufen.
2. Browser auf 1440×900 oder 1920×1080. **Dark Mode** aktivieren (haptisch beeindruckender).
3. Lighthouse-Test im Hintergrund nicht laufen lassen (Performance-Hit).
4. Demo-Datensatz laden: `/admin/sample-data` → Szenario **„Demo-Pitch"** → **Generieren**.
5. Ein Browser-Fenster mit der App, ein zweites Tab mit `/admin` als Sicherheitsnetz.

---

## Schritt 1 · Einstieg & ROI (1 Min)

**Klick-Pfad:** `https://app.care-ai.at/` (oder lokal `/`)

- Landing-Page laedt (sollte in **< 1.5s LCP** rendern).
- Kurz Hero erläutern: „Die EHR fuer Pflegeheime, die Zeit zurueckgibt."
- Auf **„ROI-Rechner"** klicken (Hero CTA).
- Werte eingeben: `120 Bewohner`, `60 Pflegekraefte`. → Ergebnis ~**€ 312.000 Ersparnis/Jahr**.

> **Fallback:** Falls ROI nicht laedt: „Wir haben mit 8 Pilotheimen 22% Zeitersparnis bei Pflegedoku gemessen — das entspricht ca. €2.600/Mitarbeiter:in/Jahr."

---

## Schritt 2 · Login & Dashboard (1 Min)

**Klick-Pfad:** `/login` → Demo-Account `demo@careai.at` / `Demo2026!`

- Nach Login: **/app** Dashboard (sollte **< 800ms** TTI).
- KPIs zeigen: Aktive Bewohner, offene Aufgaben, Vital-Anomalien, Schichtbesetzung.
- Auf eine **Anomalie-Karte** zeigen: „Hier erkennt unsere Engine in Echtzeit Risiko-Trends."

> **Fallback:** Wenn KPIs leer: „Im echten Heim sehen Sie hier Live-Daten von gestern Nacht — die Hausarzt-Visite kann sich gezielt darauf vorbereiten."

---

## Schritt 3 · Bewohner-Detail (3 Min)

**Klick-Pfad:** Sidebar **„Bewohner:innen"** → Erste Zeile (z.B. „Anna Huber") klicken.

Durchgehen aller Tabs (links jeweils ~20s erlauben):

1. **Stammdaten** – komplettes Profil, Bezugspflege, Diagnosen.
2. **SIS (6 Themenfelder)** – AEDL/SIS-Strukturmodell konform.
3. **Medikation** – Plan mit BTM-Kennzeichnung, Wechselwirkungs-Check.
4. **Vitalwerte** – Sparklines, Trend-Indikatoren.
5. **Berichte** – chronologisch, mit Filter Schicht/Autor/Kategorie.
6. **Maßnahmen** – Pflegeplan, Verantwortliche, Intervalle.
7. **Dokumente** – Patientenverfuegung, Vollmachten.
8. **Journey** – chronologische Lebenslinie.
9. **NEU: Wunden-Timelapse** – `/app/bewohner/[id]/wunden-timelapse/[woundId]` (siehe Schritt unten)

> **Fallback:** „Jeder dieser Tabs entspricht einem Modul, das frueher in 3-4 verschiedenen Systemen lag — wir konsolidieren in einer Sicht."

---

## Schritt 4 · Spracheingabe-Demo (1 Min)

**Klick-Pfad:** Im Bewohner-Detail → Tab **„Berichte"** → **Mikrofon-Icon** rechts oben.

- Ins Mikro sprechen: „Frau Huber heute kooperativ bei der Koerperpflege, RR 130 zu 80, keine Schmerzen, hat selbstaendig gefruehstueckt."
- Engine transkribiert in **< 2s**, kategorisiert automatisch in **„Pflege"**, extrahiert Vitalwerte.
- Auf **„Speichern"** klicken.

> **Fallback:** „Falls das Mikro hier nicht freigegeben ist — in Pilotheimen sparen Pflegekraefte so 17 Min/Schicht."

---

## Schritt 5 · Schichtbericht (1 Min)

**Klick-Pfad:** Sidebar **„Schichtbericht"** → Schicht waehlen → **„Generieren"**.

- Engine fasst alle Berichte aller Bewohner:innen der Schicht in **< 3s** zusammen.
- Highlights: Sturzereignisse, neue Wunden, RR-Auffaelligkeiten.
- **„An naechste Schicht uebergeben"**-Button zeigt Workflow.

---

## Schritt 6 · Admin: Audit-Log + Analytics + Anomaly (2 Min)

**Klick-Pfad:** `/admin` → drei Sub-Routen

1. **`/admin/audit`** – jede Aktion lueckenlos protokolliert (DSGVO Art. 32).
2. **`/admin/analytics`** – Privacy-first KPIs ohne Cookies, ohne Fingerprint.
3. **`/admin/anomaly`** – Engine erkennt: Vital-Drift, Sturz-Cluster, Medikations-Anomalien.

> **Fallback:** „Diese drei Module zusammen sind die Antwort auf jede Pruefung der Heimaufsicht."

---

## Schritt 7 · Admin: Exporte (1 Min)

**Klick-Pfad:** `/admin/exports`

- 4 Export-Buttons demonstrieren (jeweils 1-Klick): **Pflegebericht**, **Bewohner-Akte**, **MD-Bundle**, **DSGVO-Auskunft Art.15**.
- DSGVO-Export erwaehnen: „Auf Knopfdruck, alle 7 Tage Frist easy einhaltbar."

---

## Schritt 8 · Admin: LMS Compliance-Dashboard (1 Min)

**Klick-Pfad:** `/admin/lms`

- Zeigt Zertifizierungs-Status pro Mitarbeiter:in (Hygiene, Reanimation, Brand).
- **Rote Karten** = Nachschulung faellig. Auto-Reminder per Mail.

---

## Schritt 9 · Admin: Benchmarks + Multi-Einrichtung (1 Min)

**Klick-Pfad:** `/admin/benchmarks` und `/admin/dashboards`

- Anonymer Vergleich gegen Branchen-Median (Sturzrate, Dekubitus, Personal-Quote).
- Multi-Einrichtungs-View: Konzern-Sicht ueber alle Standorte.

---

## Schritt 10 · Admin: Migration-Assistent (1 Min)

**Klick-Pfad:** `/admin/migration`

- 4-stufiger Assistent (Upload → Mapping → Vorschau → Import).
- Unterstuetzte Quellen: Vivendi, MediFox, NextSec, CSV/Excel.
- Trockenlauf-Funktion zeigt: „Wir migrieren ohne ein einziges verlorenes Datum."

---

## Schritt 11 · Admin: Webhooks + Feature-Flags + Billing (1 Min)

**Klick-Pfad:** `/admin/webhooks`, `/admin/feature-flags`, `/admin/billing`

- **Webhooks:** Integrationen zu Lohn, ERP, Apotheke (Demo-Endpoint anlegen).
- **Feature-Flags:** Funktionen pro Einrichtung an/aus, Beta-Tester-Toggle.
- **Billing:** Stripe-integrierte Subscription-Sicht, MRR-Trend.

---

## Schritt 12 · Trust Center + Case-Studies (30s)

**Klick-Pfad:** `/trust` und `/case-studies` (Public)

- Trust Center: ISO 27001 Roadmap, DSGVO-Maßnahmen, SOC2 Type I in Vorbereitung.
- Case-Studies: 3 Pilotheime, je mit konkreten Zahlen.

---

## Schritt 13 · Mobile-App Demo (optional, 30s)

**Klick-Pfad:** Smartphone parallel mit `mobile/`-Build oder Screenshot-Tour.

- Native iOS/Android-App: Vollintegrierte Spracheingabe, Offline-Modus.
- **NEU:** Auch Web-App ist Offline-fähig (Status-Indicator unten rechts).

---

## NEU im Pitch — die Feinschliff-Features

Direkt am Ende oder bei Investor-Nachfragen einsetzen:

- **`/admin/sample-data`** — „Wir koennen Ihnen jederzeit ein realistisches Demo-Heim mit 30, 80 oder 500 Bewohner:innen aufsetzen — deterministisch, in unter 3 Sekunden."
- **`/admin/anonymizer`** — „Echte Daten DSGVO-konform fuer Schulungen oder Forschung — mit k-Anonymitaets-Score."
- **Wunden-Timelapse** — „Sehen Sie den Heilungsverlauf einer Wunde ueber 70 Tage — fuer Pflege motivierend, fuer den MD beweisbar."
- **Offline-Sync (Web)** — „Auch im Funkloch dokumentieren — Aenderungen synchronisieren automatisch."

---

## Pitch-Schluss (30s)

> „Was Sie heute gesehen haben, ist nicht Vapor. Das ist live, getestet,
> auditiert. Wir haben 4 unterzeichnete Pilot-LOIs ueber 280 Bewohner:innen,
> der erste Heimleiter hat seinen alten Vertrag bereits gekuendigt.
> CareAI ist die neue Standard-EHR fuer DACH-Pflegeheime — und wir suchen
> Partner, die diese Skalierung mitgehen."

---

## Demo-Notfall-Checkliste

| Problem | Sofort-Massnahme |
|---|---|
| Internet weg | Lokalen Build verwenden, oder Storyboard-PDF zeigen |
| Login fehlschlaegt | `/admin/impersonation` → Demo-Account |
| Sprache erkennt nichts | Manuell tippen, dann Speech-Demo per Recording |
| Anomaly-Engine ohne Daten | Sample-Data-Generator → Stresstest |
| Export blockiert | Vorab generierte PDFs aus `/docs/screenshots` |

---

**Datei zuletzt aktualisiert:** 2026-04-17
**Owner:** Founder/CEO + Product Lead
