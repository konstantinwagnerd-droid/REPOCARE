# CareAI Learning Management System (LMS)

Zentrales Staff-Training-System für Pflegeeinrichtungen — Pflichtschulungen, Weiterbildung, Onboarding.

## Warum

Pflegeeinrichtungen sind gesetzlich verpflichtet, Mitarbeitende regelmäßig zu schulen: Hygiene, Brandschutz, Reanimation, Datenschutz, Expertenstandards (Sturz, Dekubitus), Demenz, Palliativcare. Plus Onboarding für neue Mitarbeitende und neue Software. CareAI bündelt das zentral mit automatischer Frist-Erinnerung, Compliance-Dashboard und MDK-fertigem Export.

## Aufbau

```
src/
├── lib/lms/                    # Kern-Logik (framework-agnostisch)
│   ├── types.ts                # Course, Module, Quiz, Assignment, Certificate, …
│   ├── courses.ts              # 8 ausgearbeitete Beispielkurse
│   ├── grader.ts               # Quiz-Auswertung (MC, Freitext, Matching, Hotspot)
│   ├── scheduler.ts            # Frist-Berechnung (jährlich/2j/5j)
│   ├── certificate.ts          # HTML-Zertifikat + simpler QR-Marker
│   ├── compliance.ts           # Ampel & Tenant-Quote
│   ├── recommender.ts          # Kurs-Vorschläge basierend auf Rolle + Fristen
│   ├── gamification.ts         # Punkte, Streaks, Abzeichen, Leaderboard
│   └── store.ts                # In-Memory-Store mit Demo-Daten (prod → DB)
│
├── components/lms/             # UI-Bausteine
│   ├── LmsShell.tsx            # Shell (Sidebar + Header) für Learner/Admin
│   ├── CourseCard.tsx
│   ├── ModulePlayer.tsx        # Text/Video/Quiz/Reflexion-Router inkl. Notizen
│   ├── QuizPlayer.tsx          # Interaktives Quiz mit Auswertung
│   ├── CertificateViewer.tsx
│   ├── ComplianceAmpel.tsx
│   ├── ProgressRing.tsx
│   └── LeaderboardCard.tsx
│
├── app/lms/                    # Learner-Routen
│   ├── page.tsx                # /lms — Dashboard
│   ├── katalog/                # /lms/katalog — Filter + Search
│   ├── kurs/[id]/              # /lms/kurs/[id] — Kurs-Viewer
│   ├── zertifikate/            # /lms/zertifikate — PDF + QR
│   ├── kalender/               # /lms/kalender — ICS-Export
│   └── dashboard/              # Alias → /lms
│
├── app/admin/lms/              # Admin-Routen
│   ├── page.tsx                # Compliance-Dashboard
│   ├── kurse/                  # Kurs-Verwaltung
│   ├── zuweisungen/            # Bulk-Assign + Erinnerungen
│   ├── compliance/             # Matrix-Ansicht + MD-Export
│   └── reports/                # Kursmetriken, Abbruchquote
│
├── app/api/lms/                # Learner-APIs
│   ├── courses/                # GET Katalog, GET [id], POST enroll, progress, notes, reflection
│   ├── quiz/[id]/submit/       # Quiz-Auswertung + Zertifikat-Ausstellung
│   ├── certificates/[id]/      # HTML-Zertifikat (druckbar)
│   └── compliance/             # me (JSON + ICS), tenant (JSON + CSV)
│
└── app/api/admin/lms/
    ├── courses/save/           # Kurs persistieren
    └── assign/                 # Zuweisungen erzeugen

content/lms/README.md            # Redaktions-Begleittext
```

## Kursinhalte — Redaktions-Guideline

Jeder Kurs enthält:

- **Lernziele** (4–6 präzise, prüfbare Verben: „benennen", „unterscheiden", „durchführen")
- **3–6 Module**: Text (300–800 Worte), Video-Stub (Transkript), Quiz (5–10 Fragen), optional Reflexion
- **Abschluss-Quiz** mit Bestehensgrenze (Default 80 %) und Fachbegründungen
- **Literatur**: mind. 2 fachliche Quellen (WHO, KRINKO, DNQP, DSGVO, ERC, …)
- **Gesetzesbezug** (`lawReference`) wenn anwendbar
- **Gültigkeit** (`validity`): jährlich, 2-jährlich, 5-jährlich oder einmalig

**Sprache**: Deutsch, Du-Form vermeiden — Sie-Ansprache. Deutsche Fachtermini + englische Synonyme wo etabliert (MRSA, BPSD).

## Zertifikats-Flow

1. Bewohner absolviert alle Module (Text → Video → Reflexion …)
2. Finales Quiz ≥ Bestehensgrenze → `POST /api/lms/quiz/[id]/submit` erzeugt Zertifikat
3. Zertifikat enthält: Name, Personal-Nr., Kurs, Dauer, Punktzahl, Ausstellungsdatum, Gültigkeit (berechnet aus `validity`), Verifikations-Code, QR-Marker
4. Bei nächster Fälligkeit zeigt der Compliance-Ampel-Score auf Gelb (30 Tage vor) bzw. Rot (nach Fälligkeit)
5. Erinnerungen werden bei 30/14/7/1 Tag vor Frist geplant (Mail-Versand außerhalb unserer Zone)

## Rollen & Zugriff

- `/lms/**` — alle authentifizierten User
- `/admin/lms/**` — nur `admin` oder `pdl` (über `src/app/admin/layout.tsx`)
- API: Learner-APIs bedienen den angemeldeten User; Admin-APIs nur Rolle admin/pdl

## Compliance-Export für MDK / MD

- `/api/lms/compliance/tenant?format=csv` — CSV-Export mit Ampel pro Mitarbeiter × Kurs
- Enthält: User-ID, Name, Rolle, Kurs-Status (gruen/gelb/rot/offen), Fälligkeitsdatum, Quote
- UTF-8 mit BOM für Excel-Kompatibilität; Feldtrenner Semikolon (Ö/DE-Konvention)

## Gamification

- Punkte pro Kursabschluss (30–180 je nach Aufwand)
- Streaks (aufeinanderfolgende Lern-Tage)
- 6 Abzeichen (Neueinsteiger → Expertin, Punkte-Meilensteine, 7-Tage-Streak)
- Leaderboard pro Team (optional anonymisierbar)

## Roadmap

- [ ] Echte QR-Lib (z. B. `qrcode`) statt vereinfachtem SVG-Marker
- [ ] Video-Upload (Cloudinary / Mux) statt Stub
- [ ] Adaptive Quiz (schwierigere Fragen bei hohen Scores)
- [ ] Anbindung an HR-System für Dienstplan-gesteuerte Lernzeit-Fenster
- [ ] SCORM / xAPI für externe LMS-Interop
- [ ] Gruppen-Schulungen (ein:e Trainer:in bestätigt Teilnehmerliste)

## TypeScript-Qualität

Das LMS ist vollständig in `src/lib/lms/` gekapselt und hat **keine** Abhängigkeiten zu `src/db`, `src/lib/auth`, `src/lib/pdf` u. a. TABU-Zonen. Persistenz erfolgt über einen austauschbaren In-Memory-Store (`store.ts`), der in Produktion durch einen DB-Adapter ersetzt werden kann.
