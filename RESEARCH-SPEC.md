# CareAI — Research & Technical Specification

**Stand:** 2026-04-17
**Scope:** KI-gestützte Pflegedokumentations-SaaS für DACH (AT + DE)
**Zielgruppe:** Stationäre & ambulante Pflegeeinrichtungen
**Output-Ziel:** Produktreife Web-App, baubar von einem Entwickler

---

## A. Rechtlicher Rahmen

### A.1 Österreich

- **GuKG (Gesundheits- und Krankenpflegegesetz), § 5** — Dokumentationspflicht für alle gesetzten pflegerischen Maßnahmen. Inhalt: **Pflegeanamnese, Pflegediagnose, Pflegeplanung, Pflegemaßnahmen**. Aufbewahrungsfrist bei freiberuflicher Tätigkeit: **mindestens 10 Jahre**. Einsichtsrecht für Patient, gesetzl. Vertreter, bevollmächtigte Personen und Pflegekräfte. Kopie 1x kostenlos. (https://www.jusline.at/gesetz/gukg/paragraf/5)
- **§ 4 GuKG** — allgemeine Berufspflichten, Verschwiegenheit. (https://www.jusline.at/gesetz/gukg/paragraf/4)
- **Pflegegeldgesetz (BPGG)** — regelt Stufen 1-7 (siehe C.2).
- **Heim-VO (Wien WHG, NÖ HeimG etc.)** — Landesgesetze, Mindestanforderungen an Dokumentation in Heimen.
- **NQZ (Nationales Qualitätszertifikat)** — Bundesfreiwilliges Qualitätszertifikat für stationäre Pflege; prüft u.a. Dokumentationssysteme. (https://www.sozialministerium.gv.at)
- **ÖNORM K 1450** — nur in Einzelbereichen relevant (Qualitätsmanagement Dienstleistungen).

### A.2 Deutschland

- **SGB XI** — Pflegeversicherung, §113 (Maßstäbe und Grundsätze der Qualität), §114 (Qualitätsprüfungen durch MD). Verpflichtet Einrichtungen zu Dokumentation und Qualitätsberichten.
- **PflBG (Pflegeberufegesetz, seit 2020)** — Ausbildung, generalistisch; Dokumentation ist Ausbildungsinhalt.
- **Strukturmodell (SIS) — Entbürokratisierung** — seit 2015 bundesweit eingeführt (Ein-STEP-Projekt). Reduziert Dokumentation um bis zu 30%. Details siehe Abschnitt B.
- **MDK/MD-Prüfanleitung (QPR stationär/ambulant, ab 11/2019)** — 100+ Qualitätsindikatoren, halbjährliche Datenerhebung (Indikatorenerhebung nach §114a SGB XI).
- **Maßstäbe und Grundsätze §113 SGB XI** — Rahmen für Qualitätsprüfungen.

### A.3 EU-übergreifend

- **DSGVO Art. 9** — Gesundheitsdaten = besondere Kategorie, grundsätzlich untersagt. Ausnahmen: Art. 9 Abs. 2 lit. h (Gesundheitsvorsorge, Verarbeitung durch Berufsgeheimnisträger) + lit. a (ausdrückliche Einwilligung, schriftlich). (https://dsgvo-gesetz.de/art-9-dsgvo/)
- **EU AI Act (Verordnung 2024/1689)** — CareAI **ist kein automatisches Hochrisiko-System**, solange es als reines Dokumentationstool klassifiziert ist (reines Speichern/Strukturieren = general-purpose). **Aber:** Sobald CareAI **Risiko-Scores, Dekubitus-Frühwarnung, KI-gestützte Diagnoseunterstützung oder Triage** macht, fällt es unter Annex III (Zugang zu Gesundheitsdienstleistungen) bzw. wird bei MDR-Klasse IIa+ automatisch Hochrisiko. Umsetzungsfrist: **2. August 2027**. (https://www.johner-institut.de/blog/regulatory-affairs/ai-act-eu-ki-verordnung/)
- **MDR 2017/745 (Regel 11 Software)** — reine Dokumentations-Software ohne Entscheidungsunterstützung = **kein Medizinprodukt**. Sobald Software Daten **analysiert und Entscheidungen zu Diagnose/Therapie unterstützt** → mindestens **Klasse IIa**. (https://www.vde.com/topics-de/health/beratung/regel-11) **Strategie für CareAI:** Phase 1 als reines Dokumentationstool bauen (keine Medizinprodukt-Zertifizierung nötig), KI-Features als "Hinweise für die Pflegekraft" formulieren, nicht als Entscheidung. Phase 2+: MDR Klasse IIa anstreben, wenn prädiktive Features ausgerollt werden.
- **NIS-2 Richtlinie (seit 10/2024)** — Pflegeeinrichtungen sind "essential/important entities" in den meisten EU-Ländern → Meldepflichten, Risikomanagement, Lieferkettensicherheit. CareAI als SaaS-Lieferant muss NIS-2-konform sein.

### A.4 Relevante Zertifizierungen (Priorisierung)

| Standard | Priorität | Notwendig ab |
|---|---|---|
| **ISO 27001** | Hoch | Pilot-Start (Kundenanforderung) |
| **BSI C5 (Typ 2)** | Hoch | 50+ Einrichtungen (DE-Markt) |
| **TISAX** | Niedrig | nur bei Versicherer-Anbindung |
| **ISO 13485 + MDR IIa** | Mittel | Phase 2, wenn prädiktive KI live |
| **AVV DSGVO (Art. 28)** | Muss | ab Tag 1 mit jedem Kunden |

---

## B. SIS-Struktur (Kernstück DE + relevant für AT)

Die SIS ist das vereinfachte Dokumentationsmodell (Strukturmodell) mit **4 Elementen**: SIS → Maßnahmenplan → Berichteblatt (fokussiert auf Abweichungen) → Evaluation.

### B.1 Die 6 Themenfelder (stationär)

1. **Kognitive und kommunikative Fähigkeiten** — Orientierung, Entscheidungsfähigkeit, Sprache, Verstehen.
2. **Mobilität und Beweglichkeit** — Positionswechsel, Fortbewegung, Treppensteigen.
3. **Krankheitsbezogene Anforderungen und Belastungen** — Medikation, Wunden, Schmerz, Therapien.
4. **Selbstversorgung** — Körperpflege, Ernährung, Ankleiden, Ausscheidung.
5. **Leben in sozialen Beziehungen** — Kontakte, Aktivitäten, Tagesstruktur.
6. **Wohnen / Häuslichkeit** (stationär) bzw. **Haushaltsführung** (ambulant).

Bei ambulant werden Themenfelder 1-5 identisch genutzt, #6 wird zu "Haushaltsführung". (https://www.ppm-online.org/pflegestandards/pflegemassnahmen/strukturierte-informationssammlung-sis/)

### B.2 Risikomatrix

**Präzisierung:** In der offiziellen Ein-STEP-Dokumentation gibt es **keine nummerierten Risiken R1-R7**. Die Risikomatrix listet pro Themenfeld bewertete Standard-Risiken:

- **Dekubitus** (Braden, Norton, Waterlow)
- **Sturz**
- **Inkontinenz**
- **Schmerz**
- **Ernährung / Mangelernährung**
- **Kontraktur**
- **Weitere (individuell)** — z.B. Delir, Selbstgefährdung

Pro Risiko wird dokumentiert: **Einschätzung (plausibel/nicht plausibel)**, Assessment-Score, Maßnahmen im Maßnahmenplan. (https://www.care-professionals.de/sis-strukturierte-informationssammlung-und-risikomatrix-in-der-praxis/)

### B.3 Maßnahmenplan

Strukturierter Plan pro Bewohner mit **Tagesstruktur** (morgens/mittags/abends/nachts) — enthält wiederkehrende Maßnahmen (Mobilisation, Prophylaxen, Medikation, Kontakte). Änderungen/Abweichungen werden **nur im Berichteblatt** festgehalten (Fokussierung-auf-Abweichungen-Prinzip).

### B.4 Berichteblatt / Pflegebericht

Früher: tägliche Freitexteinträge pro Bewohner. Heute (SIS): **nur Abweichungen vom Maßnahmenplan** (signifikante Ereignisse, Veränderungen, Besonderheiten). Freitext + strukturierte Zeitstempel + Signatur (Initialen + User-ID + Timestamp).

---

## C. Pflegegrade & Einstufung

### C.1 Deutschland — Pflegegrade 1-5 (NBA)

Ermittlung über das **Neue Begutachtungs-Assessment (NBA)** mit 6 gewichteten Modulen:

| Modul | Inhalt | Gewicht |
|---|---|---|
| 1 | Mobilität | 10% |
| 2 | Kognitive/kommunikative Fähigkeiten | 15% (höherer Wert aus M2/M3) |
| 3 | Verhaltensweisen/psychische Problemlagen | (mit M2 gemeinsam 15%) |
| 4 | Selbstversorgung | **40%** |
| 5 | Umgang mit krankheits-/therapiebedingten Anforderungen | 20% |
| 6 | Gestaltung Alltagsleben & soziale Kontakte | 15% |

**Punktwerte (gewichtet, 0-100):**

| Pflegegrad | Punkte | Bezeichnung |
|---|---|---|
| 1 | 12,5 – <27 | Geringe Beeinträchtigung |
| 2 | 27 – <47,5 | Erhebliche Beeinträchtigung |
| 3 | 47,5 – <70 | Schwere Beeinträchtigung |
| 4 | 70 – <90 | Schwerste Beeinträchtigung |
| 5 | 90 – 100 | Schwerste + besondere Anforderungen |

(https://www.bundesweites-pflegenetzwerk.de/pflegegrade-punktesystem/)

### C.2 Österreich — Pflegegeld-Stufen 1-7 (Stand 01/2026)

| Stufe | Pflegebedarf/Monat | Betrag |
|---|---|---|
| 1 | > 65h | € 206,20 |
| 2 | > 95h | € 380,30 |
| 3 | > 120h | € 592,60 |
| 4 | > 160h | € 888,50 |
| 5 | > 180h + außergewöhnl. Pflege | € 1.206,90 |
| 6 | > 180h + Anwesenheit erforderlich | € 1.685,40 |
| 7 | > 180h + keine zielgerichtete Bewegung | € 2.214,80 |

Begutachtung durch Arzt, ggf. DGKP. (https://www.pv.at/web/pflegegeld)

### C.3 Daten-Requirements für Begutachtung

- Vollständige Historie: Mobilität, Kognition, Selbstversorgung (mind. 4 Wochen vor Begutachtung)
- Medikamentenplan inkl. Bedarfsmedikation
- Wunddokumentation (Fotos + Verlauf)
- Vital-Werte-Trends
- Sturz- und Incident-Protokolle
- Pflegebericht-Einträge mit Zeitstempel

---

## D. Pain Points der Pflegekräfte

### D.1 Dokumentationszeit — Zahlen aus Studien

- **25% der Arbeitszeit** fließt in Dokumentation (DE-Durchschnitt). (https://www.myneva.eu/de/blog/zeitraubende-dokumentation-in-der-pflege-hintergruende-und-loesungen)
- **~3-4h pro Schicht** in stationärer Pflege (Fraunhofer IML Studie). (https://www.iml.fraunhofer.de/content/dam/iml/de/documents/OE%20360/Whitepaper_Pflegedokumentation_in_Krankenh%C3%A4usern.pdf)
- **15,3 Minuten pro Patient/Tag**, bei ø 17,2 Patienten pro Fachkraft.
- voize-Pilotstudie: Sprachbasierte KI-Dokumentation spart bis zu **37 Minuten pro Schicht**. (https://www.voize.de/blog/pilotstudie---auswirkungen-des-sprachassistenten-voize-auf-die-dokumentationszeit)

### D.2 Marktführer & Schwächen

| Anbieter | Markt | Schwächen |
|---|---|---|
| **MEDIFOX DAN** | >50 Mio € Umsatz, #1 DE | komplexe Modulstruktur, Anbieterbindung, veraltete Basis, Performance-Probleme bei großen Datenmengen |
| **Connext Vivendi** | 39 Mio € Rohertrag, #2 | schwere Client-Server-Architektur, lange Onboarding-Zeiten, UI aus den 2000ern |
| **Senso / DAN / Medistar** | Mittelklasse | begrenzte Mobile-First-UX, keine echte KI-Integration |
| **voize, Dexter-Health** | Challenger (nur Sprach-Add-on) | kein vollständiges PVS, nur Dokumentationsschicht |
| **myneva** | Stark AT + DACH | on-premise-lastig, Cloud erst im Aufbau |

**Gemeinsame Schwächen:** Desktop-orientiert, keine echte Voice-First-UX, proprietäre Datenmodelle, keine Offline-Fähigkeit, hohe TCO, schlechte API-Schnittstellen. (https://www.dexter-health.com/blog/pflegedokumentationssoftware-vergleich-pflegeheime-sis-spracherkennung)

### D.3 Konkrete Pain Points (aus Fokusgruppen)

1. Doppelteingaben (Dienstplan ↔ Dokumentation ↔ Abrechnung)
2. "Stift-und-Zettel-Rückfall" in der Schicht, abends abtippen
3. Medikamentenplan-Änderungen werden nicht propagiert
4. Übergabe dauert 20-30 Minuten, viele Informationen mündlich
5. Angehörige fragen täglich, niemand hat Zeit zu antworten
6. Pflichtdokumentation verdrängt Freitext-Insights
7. MD-Prüfung verursacht 1-2 Wochen Panik-Dokumentation

---

## E. Feature-Liste (priorisiert)

### E.1 Must-Have Pilot (Phase 1, Monat 1-6)

| # | Feature | Begründung |
|---|---|---|
| 1 | **Voice-to-SIS** (Whisper + LLM-Klassifikation in 6 Themenfelder) | Core USP, direkter ROI |
| 2 | **SIS-Erstaufnahme** + Folgeevaluation | Pflichtdokument |
| 3 | **Maßnahmenplan** mit Tagesstruktur | Pflichtdokument |
| 4 | **Pflegebericht** / Berichteblatt (fokussiert auf Abweichungen) | Pflichtdokument |
| 5 | **Tagesübersicht pro Bewohner** (heute + letzte 7 Tage) | Schicht-Workflow |
| 6 | **Übergabebericht** (automatisch aus Berichteblatt generiert) | Schichtwechsel-Pain |
| 7 | **Sturz-Assessment** (Tinetti, Morse) + Incident-Log | Regulatorisch |
| 8 | **Wunddokumentation** mit Foto-Upload + Verlauf | Pflichtdokument |
| 9 | **Medikamentenplan + MAR** (Medication Administration Record) | Hohes Fehlerrisiko |
| 10 | **Vital-Werte-Tracking** (RR, Puls, Temp, BZ, Gewicht, O2) | Standard |
| 11 | **Audit-Log** (wer/wann/was geändert, unveränderlich, 10 Jahre) | §5 GuKG + SGB XI |
| 12 | **Multi-User + RBAC** (Pflegekraft, PDL, Stationsleitung, Admin, MD-Prüfer read-only) | Grundanforderung |
| 13 | **Dienstplan-Light** (wer hat Schicht, einfache Ansicht, kein voller DPMS) | Übergabe-Kontext |
| 14 | **Bewohner-Stammdaten + Pflegegrad/Pflegestufe** | Stammdatenhaltung |
| 15 | **PDF-Export** (Bewohner-Akte, Stichtag-Report) | MD-Prüfung |

### E.2 Nice-to-Have Phase 2 (Monat 7-18)

- **Prädiktive Risikoerkennung** (Sturz, Dekubitus, Delir, Mangelernährung) — MDR-Klasse IIa notwendig
- **Angehörigen-Portal** (read-only, Tagesübersicht, Fotos, Nachrichten)
- **MD-Prüfexport** (QPR-konform, halbjährliche Indikatorenerhebung automatisch)
- **KI-Maßnahmenvorschläge** aus SIS + Risikomatrix
- **Offline-Modus** (PWA mit IndexedDB, Sync bei Verbindung)
- **Mehrsprachigkeit** (DE, EN, RO, HU, HR, BA, PL, TR — für multiethnische Teams)
- **Dienstplan-Voll** (Ausfallmanagement, Urlaubsplanung)
- **Abrechnungsexport** (KIM-Schnittstelle, DTA §105 SGB XI)
- **"Was hat sich seit gestern geändert?"** — KI-generiertes Shift-Briefing
- **Natürliche Sprachsuche** ("Wann war Frau Müller zuletzt unruhig?")
- **Anomalie-Erkennung** in Vitalwerten (Z-Score + Trend)
- **Dekubitus-Frühwarnung** aus Fotos (Computer Vision, EPUAP-Klassifikation)

---

## F. Datenmodell — Postgres (12 Kerntabellen)

**Tenancy-Modell:** Shared DB, Shared Schema, **row-level `tenant_id` + Postgres RLS (Row Level Security)**. Alle Queries automatisch gefiltert via `current_setting('app.current_tenant')`. Verschlüsselung: `pgcrypto` für Felder mit Gesundheitsdaten (PII-Level 2).

```sql
-- 1. Tenants (Einrichtungen)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('stationaer','ambulant','mixed')),
  country CHAR(2) CHECK (country IN ('DE','AT','CH')),
  address JSONB,
  regulatory_id TEXT, -- IK-Nummer DE / DVR AT
  subscription_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users (Pflegekräfte + Rollen)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email CITEXT UNIQUE NOT NULL,
  hashed_password TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('pflegekraft','pdl','stationsleitung','admin','md_reviewer','angehoeriger')),
  qualification TEXT, -- DGKP, PFA, PA, HH
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Residents (Bewohner/Klienten)
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  external_id TEXT, -- Heim-Nummer
  first_name_encrypted BYTEA,
  last_name_encrypted BYTEA,
  birth_date DATE,
  gender TEXT,
  pflegegrad SMALLINT CHECK (pflegegrad BETWEEN 0 AND 5),   -- DE
  pflegestufe SMALLINT CHECK (pflegestufe BETWEEN 0 AND 7), -- AT
  insurance JSONB,
  admission_date DATE,
  discharge_date DATE,
  room TEXT,
  legal_representative JSONB,
  consent_data_processing BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assessments (SIS)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  type TEXT CHECK (type IN ('sis_initial','sis_update','nba','pflegegeld','braden','norton','tinetti','morse','mna','pain')),
  assessment_date DATE NOT NULL,
  data JSONB NOT NULL,   -- themenfelder: {tf1:{}, tf2:{}, ...} + risikomatrix: {sturz:{}, dekubitus:{}, ...}
  total_score NUMERIC,
  grade_suggestion SMALLINT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Care Plans (Maßnahmenpläne)
CREATE TABLE care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  valid_from DATE NOT NULL,
  valid_to DATE,
  goals JSONB,
  measures JSONB, -- [{topic, time_slot, description, frequency, responsible_role}, ...]
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Care Reports (Berichteblatt, Pflegeberichte)
CREATE TABLE care_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  shift TEXT CHECK (shift IN ('morning','afternoon','night')),
  report_date DATE NOT NULL,
  text TEXT NOT NULL,
  classified_topics TEXT[],  -- SIS-Themenfeld-Tags aus KI
  deviation_flag BOOLEAN DEFAULT FALSE,
  source TEXT CHECK (source IN ('voice','text','import')),
  voice_transcript_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Vital Signs
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  measured_at TIMESTAMPTZ NOT NULL,
  rr_systolic SMALLINT, rr_diastolic SMALLINT,
  pulse SMALLINT, temperature NUMERIC(3,1),
  blood_sugar SMALLINT, spo2 SMALLINT,
  weight_kg NUMERIC(5,2), respiration_rate SMALLINT,
  pain_scale SMALLINT,
  measured_by UUID REFERENCES users(id)
);
CREATE INDEX ON vital_signs (resident_id, measured_at DESC);

-- 8. Medications + Administration
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  product_name TEXT, pzn TEXT, dose TEXT, unit TEXT,
  schedule JSONB, -- [{time:"08:00", amount:1}, ...] oder prn:true
  start_date DATE, end_date DATE,
  prescribed_by TEXT, indication TEXT,
  is_prn BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE
);
CREATE TABLE medication_administrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  medication_id UUID NOT NULL REFERENCES medications(id),
  resident_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ, administered_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('given','refused','held','missed')),
  administered_by UUID REFERENCES users(id),
  witness UUID REFERENCES users(id), -- bei BtM
  notes TEXT
);

-- 9. Wounds + Observations
CREATE TABLE wounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID NOT NULL REFERENCES residents(id),
  location_code TEXT, wound_type TEXT,
  origin_date DATE, closed_date DATE,
  classification TEXT -- EPUAP Grad 1-4
);
CREATE TABLE wound_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  wound_id UUID NOT NULL REFERENCES wounds(id),
  observed_at TIMESTAMPTZ NOT NULL,
  length_mm INT, width_mm INT, depth_mm INT,
  exudate TEXT, odor TEXT, pain_scale SMALLINT,
  photo_url TEXT, description TEXT,
  treatment TEXT, observed_by UUID REFERENCES users(id)
);

-- 10. Incidents (Stürze, Verletzungen, Beinahe-Vorfälle)
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resident_id UUID REFERENCES residents(id),
  type TEXT CHECK (type IN ('fall','near_miss','injury','medication_error','aggression','escape','other')),
  occurred_at TIMESTAMPTZ NOT NULL,
  location TEXT, severity SMALLINT,
  description TEXT, immediate_action TEXT,
  root_cause TEXT, follow_up TEXT,
  reported_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id), reviewed_at TIMESTAMPTZ
);

-- 11. Audit Log (regulatorisch, unveränderlich)
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID, entity_type TEXT, entity_id UUID,
  action TEXT CHECK (action IN ('create','read','update','delete','export','login','logout')),
  before JSONB, after JSONB,
  ip INET, user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- append-only: kein UPDATE/DELETE via RLS policy

-- 12. Shifts (Dienstplan-Light)
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  shift_date DATE NOT NULL,
  shift_type TEXT CHECK (shift_type IN ('F','S','N','Z','U','K')), -- Früh/Spät/Nacht/Zwischendienst/Urlaub/Krank
  start_time TIMETZ, end_time TIMETZ,
  station TEXT, notes TEXT
);
CREATE UNIQUE INDEX ON shifts (tenant_id, user_id, shift_date, shift_type);
```

**RLS-Policy-Beispiel:**
```sql
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON residents USING (tenant_id::text = current_setting('app.current_tenant'));
```

---

## G. UX-Prinzipien für Pflegesoftware

1. **One-Hand-Operation** — 90% aller Aktionen mit einem Finger/Daumen erreichbar. Keine kleinen Dropdowns.
2. **Touch-Targets ≥ 48×48 px** (WCAG 2.5.5 Level AAA; Pflegende tragen oft Handschuhe).
3. **Hoher Kontrast ≥ 7:1** (WCAG AAA) — wichtig bei schlechter Beleuchtung, Brille, Nachtdienst.
4. **Voice-First** — primärer Eingabepfad ist Sprache, Tippen Fallback. Keine Pflicht-Textfelder > 30 Zeichen.
5. **Offline-First (PWA)** — IndexedDB für Schicht-Daten, optimistisches UI, Sync-Queue mit Konfliktauflösung (Last-Write-Wins + manuelle Konflikt-UI).
6. **Schicht-zentriert statt Bewohner-zentriert** — Startscreen zeigt "Meine Schicht" (Liste aller zugewiesenen Bewohner, nächste fällige Aufgaben), nicht einen einzelnen Bewohner.
7. **Read-Only-Modus** für Aufsicht/MD-Prüfer mit deutlichem visuellen Banner.
8. **Keine Modal-Dialoge für kritische Aktionen** — Inline-Bestätigung mit Undo (3 Sekunden).
9. **Farbcodierung nach Dringlichkeit** — rot = ausstehend/kritisch, gelb = überfällig, grün = erledigt, grau = n/a.
10. **Minimale Cognitive Load** — pro Screen max. 1 Primäraktion.
11. **Zeitbasierte Autokomplett-Defaults** — "jetzt" als Standard-Zeitstempel, vorausgewählter Bewohner bleibt gecacht.
12. **Schnelles Pflegekraft-Login** — PIN + NFC-Badge, kein Passwort-Typen pro Schicht.

---

## H. Wo KI echten Mehrwert liefert (Demo-Use-Cases)

| # | Use Case | Technik | Demo-Effekt |
|---|---|---|---|
| 1 | **Voice → SIS-Bericht** | Whisper (large-v3) → GPT-4o/Claude mit SIS-Taxonomie-Prompt → strukturierte JSON → DB | Pflegekraft sagt 20 Sek. Sprachnotiz, erhält fertigen SIS-Eintrag mit Themenfeld-Klassifikation |
| 2 | **Schicht-Briefing** | RAG über `care_reports` + `incidents` + `vital_signs` letzte 24h → LLM-Zusammenfassung pro Bewohner | Übergabe-Dauer von 25 auf 5 Min. |
| 3 | **Anomalie-Erkennung Vitalwerte** | Z-Score auf rolling window (30d) + Trendanalyse → Alert bei Abweichung > 2σ | Frühwarnung Infekt/Dehydration |
| 4 | **Sturzrisiko-Score** | Gradient Boosting auf Mobilität + Medikation + Vorfälle + Kognition | Score 0-100 täglich neu, Top-3-Risiko-Bewohner-Panel |
| 5 | **Dekubitus-Frühwarnung Foto** | MobileNet/Medical CNN auf Wundfotos, EPUAP-Klassifikation | Gradzuweisung + Verlaufsvergleich (Phase 2, MDR IIa) |
| 6 | **Semantische Suche** | pgvector Embeddings über care_reports → "Wann war Frau M. zuletzt unruhig?" | Natürliche Sprache statt Volltextsuche |
| 7 | **"Was hat sich geändert?"** | Diff zwischen care_plans Versionen + Incidents-Delta → LLM-Zusammenfassung | Pflegekraft sieht auf einen Blick Änderungen der letzten 48h |
| 8 | **Maßnahmen-Vorschläge** | Few-shot LLM mit SIS-Daten + Pflegestandards (Expertenstandards DNQP) | Vorschlag einblenden, Pflegekraft bestätigt oder editiert — nie autonom |

**Wichtig für alle KI-Features:** Disclaimer "Vorschlag — Prüfung durch Fachkraft erforderlich", Audit-Log jeder KI-Entscheidung, menschliche Bestätigung erforderlich → hält CareAI aus MDR-Scope heraus in Phase 1.

---

## Appendix: Empfohlener Tech-Stack

- **Frontend:** Next.js 15 (App Router) + React Server Components, Tailwind + shadcn/ui, PWA (next-pwa), Zustand für Client-State, TanStack Query für Server-State
- **Backend:** Node.js (Hono oder NestJS), Postgres 16 + pgcrypto + pgvector + RLS, Prisma ORM
- **Voice:** Whisper large-v3 (selbst-gehostet auf EU-GPU bei Hetzner/OVH — DSGVO!) oder Azure Speech-to-Text EU-West
- **LLM:** Claude Sonnet 4.6 via EU-Datacenter + lokaler Llama-3-70B-Fallback für Offline-Szenarien; **kein OpenAI in US** für Produktiv-PII
- **Auth:** Lucia + TOTP MFA + WebAuthn, NFC-Badge via WebNFC (Android)
- **Storage:** S3-kompatibel EU (Scaleway, Exoscale) mit Server-Side-Encryption + Signed URLs, Foto-Metadaten stripped (EXIF-GPS entfernen)
- **Infra:** Hetzner Cloud DE/AT, Kubernetes (k3s), Terraform, Postgres via Neon EU oder selbst-gehostet
- **Monitoring:** Sentry EU, Grafana, OpenTelemetry, ELK für Audit-Log
- **CI/CD:** GitHub Actions mit SBOM + Trivy + Dependabot, staging → prod gated
- **Compliance:** AVV-Template (Art. 28 DSGVO), TOMs (Art. 32), DPA-Generator für jeden Kunden, DSFA (Art. 35) dokumentiert vor Go-Live

---

## Quellen (Auswahl)

- https://www.jusline.at/gesetz/gukg/paragraf/5 — § 5 GuKG
- https://www.ppm-online.org/pflegestandards/pflegemassnahmen/strukturierte-informationssammlung-sis/ — SIS Leitfaden
- https://www.ein-step.de/haufige-fragen — Ein-STEP Projektbüro
- https://www.bundesweites-pflegenetzwerk.de/pflegegrade-punktesystem/ — NBA Punktesystem
- https://www.pv.at/web/pflegegeld — Pflegegeld AT 2026
- https://www.johner-institut.de/blog/regulatory-affairs/ai-act-eu-ki-verordnung/ — AI Act & MDR
- https://www.vde.com/topics-de/health/beratung/regel-11 — MDR Regel 11 Software
- https://dsgvo-gesetz.de/art-9-dsgvo/ — DSGVO Art. 9
- https://www.iml.fraunhofer.de/content/dam/iml/de/documents/OE%20360/Whitepaper_Pflegedokumentation_in_Krankenh%C3%A4usern.pdf — Fraunhofer Whitepaper
- https://www.voize.de/blog/pilotstudie---auswirkungen-des-sprachassistenten-voize-auf-die-dokumentationszeit — voize Pilotstudie
- https://www.dexter-health.com/blog/pflegedokumentationssoftware-vergleich-pflegeheime-sis-spracherkennung — Marktvergleich
- https://www.care-professionals.de/sis-strukturierte-informationssammlung-und-risikomatrix-in-der-praxis/ — Risikomatrix
- https://www.medifoxdan.de/blog/sisr-die-vier-elemente-der-pflegedokumentation/ — 4 Elemente Strukturmodell
- https://md-bund.de/fileadmin/dokumente/Publikationen/SPV/PV_Qualitaetspruefung/191114_-_Hinweise_Strukturmodell.pdf — MD Hinweise Strukturmodell
