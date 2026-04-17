// CareAI LMS — 8 fachlich ausgearbeitete Beispielkurse.
// Inhalte sind substantiell, auf aktuellem Pflege-Standard 2025/26.
// Quellen: RKI, ASA/ASA, ÖNORM, DNQP-Expertenstandards, DSGVO Art.32, ERC-Leitlinien 2021.

import type { Course } from "./types";

// ===========================================================================
// 1. HYGIENE & INFEKTIONSSCHUTZ
// ===========================================================================
const hygiene: Course = {
  id: "hygiene-basis",
  slug: "hygiene-infektionsschutz",
  title: "Hygiene & Infektionsschutz (Basis)",
  shortDescription:
    "Händehygiene, Standardhygiene, multiresistente Erreger (MRSA, VRE, C. difficile) und Ausbruchsmanagement in der stationären Pflege.",
  category: "pflicht",
  targetRoles: ["pflegekraft", "pdl", "reinigung", "kuche"],
  durationMinutes: 45,
  language: "de",
  difficulty: "einsteiger",
  validity: { type: "jaehrlich" },
  lawReference: "§ 36 IfSG (DE) / § 5 GuKG (AT)",
  learningObjectives: [
    "Die 5 Momente der Händehygiene (WHO) benennen und im Alltag anwenden können.",
    "Standardhygiene-Maßnahmen (PSA, Flächendesinfektion) korrekt auswählen.",
    "Isolierungspflichten bei MRSA, VRE und C. difficile unterscheiden.",
    "Ausbruchsmanagement nach § 23/36 IfSG (oder äquivalent AT) einleiten können.",
  ],
  literature: [
    "KRINKO-Empfehlungen 2024 — Händehygiene in Einrichtungen des Gesundheitswesens",
    "WHO — My 5 Moments for Hand Hygiene",
    "RKI-Ratgeber MRSA / Clostridioides difficile (Stand 2025)",
  ],
  thumbnailEmoji: "🧼",
  points: 100,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "hy-m1",
      kind: "text",
      order: 1,
      title: "Warum Händehygiene Leben rettet",
      estimatedMinutes: 8,
      body: `# Warum Händehygiene Leben rettet

Die hygienische Händedesinfektion ist die wirksamste Einzelmaßnahme zur Vermeidung nosokomialer Infektionen. Studien der WHO zeigen, dass die konsequente Anwendung die Rate nosokomialer Infektionen um **30–50 %** senkt. In deutschen und österreichischen Pflegeeinrichtungen erkranken jährlich rund 30.000 Bewohner:innen zusätzlich an vermeidbaren Infektionen — viele davon durch mangelnde Händehygiene.

## Die 5 Momente der Händehygiene (WHO)

1. **Vor Patientenkontakt** — schützt die Bewohner:in vor körperfremden Keimen
2. **Vor aseptischer Tätigkeit** — Wundversorgung, Katheter, Injektion
3. **Nach Kontakt mit potenziell infektiösen Materialien** — Blut, Urin, Stuhl, Sekrete
4. **Nach Patientenkontakt** — schützt Sie und andere Bewohner:innen
5. **Nach Kontakt mit der unmittelbaren Patientenumgebung** — Bettgestell, Nachtkästchen, Rollator

## Technik

- Mindestens **30 Sekunden** Einwirkzeit, 3 ml alkoholisches Desinfektionsmittel
- Reihenfolge: Handflächen, Handrücken, Fingerzwischenräume, Daumen, Fingerkuppen, Nagelfalz
- Keine Ringe, keine künstlichen Fingernägel, keine lackierten Nägel
- Bei sichtbarer Verschmutzung **zuerst** waschen, dann desinfizieren

## Häufigste Fehler

- Zu kurze Einwirkzeit (< 30 s)
- Fingerkuppen und Daumen werden ausgelassen (80 % aller Keime sitzen dort)
- Desinfektion unterbricht die Händehygiene — nicht „zwischendurch“, sondern zu den 5 Momenten`,
    },
    {
      id: "hy-m2",
      kind: "text",
      order: 2,
      title: "Standardhygiene & persönliche Schutzausrüstung",
      estimatedMinutes: 10,
      body: `# Standardhygiene & PSA

Die **Standardhygiene** gilt für **alle Bewohner:innen**, unabhängig von einer diagnostizierten Infektion. Sie schützt vor unbekannten Infektionsträgern (z. B. nicht-entdecktes MRSA-Carriership).

## Persönliche Schutzausrüstung (PSA)

| Tätigkeit | Handschuhe | Schürze | Mund-Nasen-Schutz | Schutzbrille |
|---|---|---|---|---|
| Grundpflege (Waschen) | ja | ja (einmal) | nein | nein |
| Wundversorgung | ja (steril) | ja | ja | bei Spritzgefahr |
| Intimpflege | ja | ja | nein | nein |
| Absaugen | ja | ja | FFP2 | ja |
| Essen anreichen | nein | nein | nein | nein |

## Reihenfolge An- und Ablegen

**Anlegen:** Schürze → MNS → Schutzbrille → Handschuhe
**Ablegen:** Handschuhe → Schürze → Schutzbrille → MNS → **Händedesinfektion**

## Flächendesinfektion

- Wischdesinfektion, keine Sprühdesinfektion (erzeugt Aerosole)
- Einwirkzeit beachten — Hersteller-Angabe (meist 1–5 min)
- Nach Bewohnerzimmer-Wechsel: patientennahe Flächen (Bettgestell, Nachtkästchen, Türgriff)`,
    },
    {
      id: "hy-m3",
      kind: "text",
      order: 3,
      title: "Multiresistente Erreger — MRSA, VRE, C. difficile",
      estimatedMinutes: 12,
      body: `# Multiresistente Erreger in der stationären Pflege

## MRSA (Methicillin-resistenter Staphylococcus aureus)

- Besiedelt Nasenvorhof, Leiste, Wunden — **Besiedlung ≠ Infektion**
- Übertragung fast ausschließlich über **Hände**
- Isolierung im Einzelzimmer meist **nicht erforderlich**, wenn Bewohner kognitiv orientiert & kontinent
- Sanierung: Mupirocin-Nasensalbe 5 Tage, Octenidin-Ganzkörperwäsche 5 Tage, Wäschewechsel täglich

## VRE (Vancomycin-resistente Enterokokken)

- Problem: Darmbesiedler, übertragen über Stuhl / Hände / Flächen
- Eigene Toilette bzw. Toilettenstuhl bevorzugt
- Keine Routinesanierung möglich — **strikte Händehygiene**

## Clostridioides difficile

- **Sporenbildner!** Alkoholische Händedesinfektion **unwirksam**
- Nach Kontakt: Hände **waschen** (mechanisch entfernen), dann desinfizieren
- Flächendesinfektion: **sporozid** (z. B. Peressigsäure, 0,5 % Natriumhypochlorit)
- Einzelzimmer, eigene Toilette, Symptome mindestens 48 h abgeklungen

## Aufnahme-Screening

- MRSA: bei Risikofaktoren (Antibiose letzte 6 Monate, Krankenhausaufenthalt, offene Wunden)
- VRE: bei Verlegung aus Risikobereich
- Ergebnis dokumentieren, Angehörige informieren, Mitarbeiter-Info`,
    },
    {
      id: "hy-m4",
      kind: "quiz",
      order: 4,
      title: "Abschluss-Quiz Hygiene",
      estimatedMinutes: 15,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Welche der WHO 5-Momente umfasst die Händehygiene VOR einer Injektion?",
          options: [
            { id: "a", text: "Moment 1 — vor Patientenkontakt", correct: false },
            { id: "b", text: "Moment 2 — vor aseptischer Tätigkeit", correct: true },
            { id: "c", text: "Moment 4 — nach Patientenkontakt", correct: false },
            { id: "d", text: "Moment 5 — nach Umgebungskontakt", correct: false },
          ],
          explanation:
            "Eine Injektion ist eine aseptische Tätigkeit. Moment 2 schützt den sterilen Bereich vor Keimen der Haut oder Umgebung.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Wie lange mindestens muss die hygienische Händedesinfektion einwirken?",
          options: [
            { id: "a", text: "10 Sekunden", correct: false },
            { id: "b", text: "15 Sekunden", correct: false },
            { id: "c", text: "30 Sekunden", correct: true },
            { id: "d", text: "60 Sekunden", correct: false },
          ],
          explanation: "Laut KRINKO-Empfehlung mindestens 30 s, mit ausreichend Desinfektionsmittel (ca. 3 ml).",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Welche Aussage zu Clostridioides difficile ist RICHTIG?",
          options: [
            { id: "a", text: "Alkoholische Händedesinfektion reicht aus", correct: false },
            { id: "b", text: "Hände müssen gewaschen werden, weil C. difficile Sporen bildet", correct: true },
            { id: "c", text: "Keine spezielle Flächendesinfektion nötig", correct: false },
            { id: "d", text: "Einzelzimmer nicht erforderlich", correct: false },
          ],
          explanation:
            "C. difficile bildet Sporen, die durch Alkohol nicht inaktiviert werden. Mechanisches Händewaschen + sporozide Flächendesinfektion sind zwingend.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "In welcher Reihenfolge wird PSA angelegt?",
          options: [
            { id: "a", text: "Handschuhe → Schürze → MNS → Brille", correct: false },
            { id: "b", text: "Schürze → MNS → Schutzbrille → Handschuhe", correct: true },
            { id: "c", text: "MNS → Handschuhe → Schürze → Brille", correct: false },
            { id: "d", text: "Brille → Handschuhe → MNS → Schürze", correct: false },
          ],
          explanation: "Immer von unten nach oben und von grob nach fein — Handschuhe zuletzt, da sie kontaminiert werden.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Welche Maßnahme schützt am wirksamsten vor MRSA-Übertragung?",
          options: [
            { id: "a", text: "Einzelzimmerisolierung", correct: false },
            { id: "b", text: "Konsequente Händehygiene", correct: true },
            { id: "c", text: "FFP2-Maske für Personal", correct: false },
            { id: "d", text: "Schutzanzug bei jedem Kontakt", correct: false },
          ],
          explanation: "MRSA wird >95 % über Hände übertragen. Händehygiene ist die wirksamste und kostengünstigste Maßnahme.",
        },
        {
          id: "q6",
          type: "mc",
          points: 10,
          text: "Darf eine MRSA-positive Bewohnerin an Gemeinschaftsaktivitäten teilnehmen?",
          options: [
            { id: "a", text: "Nein, nie", correct: false },
            { id: "b", text: "Ja, wenn Wunden dicht abgedeckt sind und keine Atemwegsinfektion besteht", correct: true },
            { id: "c", text: "Nur mit FFP3-Maske", correct: false },
            { id: "d", text: "Nur mit ärztlicher Einzelgenehmigung", correct: false },
          ],
          explanation:
            "Besiedlung ist kein Grund zur sozialen Isolation. Soziale Teilhabe hat hohen Stellenwert — Standardhygiene reicht bei abgedeckten Wunden.",
        },
        {
          id: "q7",
          type: "mc",
          points: 10,
          text: "Wann ist eine hygienische Händewaschung (mit Wasser und Seife) statt Desinfektion erforderlich?",
          options: [
            { id: "a", text: "Vor jeder Mahlzeit", correct: false },
            { id: "b", text: "Nach Kontakt mit C. difficile oder Norovirus", correct: true },
            { id: "c", text: "Immer vor Betreten eines Bewohnerzimmers", correct: false },
            { id: "d", text: "Nur einmal pro Schicht", correct: false },
          ],
          explanation: "Sporenbildner (C. difficile) und unbehüllte Viren (Norovirus) werden mechanisch durch Waschen entfernt.",
        },
        {
          id: "q8",
          type: "freitext",
          points: 10,
          text: "Nennen Sie 3 der 5 WHO-Momente der Händehygiene.",
          expectedKeywords: [
            "vor patientenkontakt",
            "aseptischer",
            "infektiösen",
            "nach patientenkontakt",
            "umgebung",
          ],
          explanation: "Korrekt sind: 1 vor Patientenkontakt, 2 vor aseptischer Tätigkeit, 3 nach Kontakt mit infektiösem Material, 4 nach Patientenkontakt, 5 nach Kontakt mit Umgebung.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 2. BRANDSCHUTZ & EVAKUIERUNG
// ===========================================================================
const brandschutz: Course = {
  id: "brandschutz",
  slug: "brandschutz-evakuierung",
  title: "Brandschutz & Evakuierung",
  shortDescription:
    "Verhalten im Brandfall, Umgang mit Feuerlöscher, horizontale Evakuierung von immobilen Bewohner:innen, Brandschutztüren.",
  category: "pflicht",
  targetRoles: ["alle"],
  durationMinutes: 30,
  language: "de",
  difficulty: "einsteiger",
  validity: { type: "jaehrlich" },
  lawReference: "ArbSchG § 10, ASR A2.2 (DE) / ASchG § 25 (AT)",
  learningObjectives: [
    "Brandschutzordnung (Teile A/B/C) kennen",
    "Feuerlöscher korrekt einsetzen (PASS-Regel)",
    "Horizontale Evakuierung bei immobilen Bewohner:innen durchführen",
    "Brandschutztüren NIE verkeilen",
  ],
  literature: [
    "DIN 14096 — Brandschutzordnung",
    "ASR A2.2 — Maßnahmen gegen Brände",
    "TRVB 117 O (AT) — Brandalarm- und Evakuierungsplanung",
  ],
  thumbnailEmoji: "🧯",
  points: 60,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "br-m1",
      kind: "text",
      order: 1,
      title: "Im Brandfall — die 3 Sekunden-Regel",
      estimatedMinutes: 8,
      body: `# Im Brandfall — 3 Sekunden-Regel

**Ruhe bewahren — Retten — Melden — Löschen** (in dieser Reihenfolge).

## 1. Retten
- Bewohner:innen aus akut gefährdetem Bereich bringen (horizontal, in benachbarten Rauchabschnitt)
- Türen **schließen** hinter sich — nicht abschließen
- Brandschutztüren wirken 30–90 min als Rauchsperre

## 2. Melden
- Feuermelder drücken
- **112** (DE) / **122** (AT) anrufen: **W-Fragen**
  - **W**o brennt es?
  - **W**as brennt?
  - **W**ieviele Verletzte?
  - **W**elche Art von Verletzung?
  - **W**arten auf Rückfragen!

## 3. Löschen
Nur bei Entstehungsbränden — **Eigenschutz geht vor!**

## PASS-Regel Feuerlöscher
- **P**in ziehen (Sicherung)
- **A**bstand 3 m halten
- **S**trahl auf die **Glutbasis**, nicht in die Flamme
- **S**toßweise löschen, nicht Dauerstrahl

## Nie tun
- Aufzug benutzen
- Fenster öffnen (Sauerstoffzufuhr)
- Brandschutztüren verkeilen
- Zurück ins Zimmer wegen Wertsachen`,
    },
    {
      id: "br-m2",
      kind: "text",
      order: 2,
      title: "Horizontale Evakuierung",
      estimatedMinutes: 10,
      body: `# Horizontale Evakuierung

Pflegeeinrichtungen haben **mehrere Rauchabschnitte pro Etage**. Ziel ist daher **nicht das Gebäude zu verlassen**, sondern Bewohner:innen **horizontal in den nächsten Rauchabschnitt** zu bringen.

## Techniken

### Gehfähige Bewohner:in
- An Hand nehmen, klar ansprechen: „Wir gehen jetzt raus, ich bin bei Ihnen"
- Nicht rennen — das erhöht Sturzrisiko

### Rollstuhl
- Bremsen lösen prüfen
- Durch Brandschutztür schieben

### Bettlägerig
- **Rettungstuch unter die Matratze schieben** — Bewohner:in bleibt liegen
- Mit 1–2 Personen über den Gang ziehen
- Bei Rauch: tief bleiben, unter die Rauchschicht (dort ist die Luft klar und kühl)

## Brandschutztüren
- **Immer geschlossen halten**, niemals mit Keil, Stuhl oder Möbel offenhalten
- Erkennbar an orangefarbenem T30-/T90-Aufkleber
- Moderne Einrichtungen haben Haftmagnete — Tür fällt beim Brandalarm selbsttätig zu

## Sammelplatz
- Nach jedem Brandfall: Sammelplatz aufsuchen, Anwesenheit prüfen
- Schichtleitung übergibt Bewohnerliste an Einsatzleitung`,
    },
    {
      id: "br-m3",
      kind: "quiz",
      order: 3,
      title: "Abschluss-Quiz Brandschutz",
      estimatedMinutes: 12,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Welche Reihenfolge ist im Brandfall korrekt?",
          options: [
            { id: "a", text: "Löschen → Retten → Melden", correct: false },
            { id: "b", text: "Retten → Melden → Löschen", correct: true },
            { id: "c", text: "Melden → Löschen → Retten", correct: false },
            { id: "d", text: "Zuerst Feuerwehr anrufen, dann abwarten", correct: false },
          ],
          explanation: "Menschenleben haben absolute Priorität. Retten, dann alarmieren, dann Löschversuch nur bei Entstehungsbränden.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Was bedeutet PASS bei Feuerlöschern?",
          options: [
            { id: "a", text: "Pin, Abstand, Strahl auf Glut, Stoßweise", correct: true },
            { id: "b", text: "Position, Atmen, Schließen, Schauen", correct: false },
            { id: "c", text: "Panik, Alarm, Sofort, Stop", correct: false },
            { id: "d", text: "Presse, Absetzen, Springen, Schützen", correct: false },
          ],
          explanation: "Pin ziehen, 3 m Abstand, Strahl auf die Glutbasis, stoßweise löschen.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Dürfen Brandschutztüren mit einem Keil offengehalten werden?",
          options: [
            { id: "a", text: "Ja, wenn Warteschlangen entstehen", correct: false },
            { id: "b", text: "Ja, bei gutem Wetter zur Belüftung", correct: false },
            { id: "c", text: "Nein, niemals — strafbar und lebensgefährlich", correct: true },
            { id: "d", text: "Ja, solange Pfleger daneben stehen", correct: false },
          ],
          explanation: "Brandschutztüren müssen im Brandfall selbsttätig schließen. Ein Keil macht den gesamten Rauchabschnitt wirkungslos.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Wie evakuiert man eine bettlägerige Bewohnerin am schnellsten?",
          options: [
            { id: "a", text: "Umlagern auf Rollstuhl", correct: false },
            { id: "b", text: "Mit Rettungstuch unter der Matratze über den Gang ziehen", correct: true },
            { id: "c", text: "Auf den Arm nehmen", correct: false },
            { id: "d", text: "Bett komplett herausfahren (mit Rollen)", correct: false },
          ],
          explanation: "Das Rettungstuch ermöglicht schnelle, kräftesparende Evakuierung ohne Umlagerung.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Wo ist im Brandrauch die Luft am besten?",
          options: [
            { id: "a", text: "In Kopfhöhe stehend", correct: false },
            { id: "b", text: "Gebückt / kriechend in Bodennähe", correct: true },
            { id: "c", text: "Am Fenster", correct: false },
            { id: "d", text: "In der Mitte des Raumes", correct: false },
          ],
          explanation: "Rauchschicht steigt nach oben — in Bodennähe bleibt es länger kühl und sichtklar.",
        },
        {
          id: "q6",
          type: "mc",
          points: 10,
          text: "Was ist die Notrufnummer der Feuerwehr in Österreich?",
          options: [
            { id: "a", text: "110", correct: false },
            { id: "b", text: "112 (EU-einheitlich)", correct: true },
            { id: "c", text: "144", correct: false },
            { id: "d", text: "133", correct: false },
          ],
          explanation: "112 funktioniert EU-weit. In Österreich zusätzlich 122 (Feuerwehr national).",
        },
      ],
    },
  ],
};

// ===========================================================================
// 3. REANIMATION BLS
// ===========================================================================
const bls: Course = {
  id: "bls-update",
  slug: "reanimation-bls",
  title: "Reanimation (BLS) Update",
  shortDescription:
    "Basic Life Support nach ERC-Leitlinien 2021: Erkennen des Kreislaufstillstands, Thoraxkompressionen, AED-Einsatz.",
  category: "pflicht",
  targetRoles: ["pflegekraft", "pdl"],
  durationMinutes: 60,
  language: "de",
  difficulty: "fortgeschritten",
  validity: { type: "zweijaehrlich" },
  lawReference: "ERC-Leitlinien 2021, GuKG § 14 (AT)",
  learningObjectives: [
    "Kreislaufstillstand innerhalb 10 Sekunden erkennen",
    "Thoraxkompressionen mit korrekter Frequenz (100–120/min) und Tiefe (5–6 cm) durchführen",
    "AED (automatisierter externer Defibrillator) korrekt anwenden",
    "BLS-Algorithmus durchgehend ohne Unterbrechung anwenden",
  ],
  literature: [
    "ERC Leitlinien 2021 — Basic Life Support",
    "GRC-Leitlinien 2024 Update",
    "Schweizer Rat für Wiederbelebung — www.resuscitation.ch",
  ],
  thumbnailEmoji: "🫀",
  points: 120,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "bls-m1",
      kind: "text",
      order: 1,
      title: "Kreislaufstillstand erkennen — die 10-Sekunden-Prüfung",
      estimatedMinutes: 10,
      body: `# Kreislaufstillstand erkennen

**Jede Minute ohne Reanimation senkt die Überlebenschance um 10 %.**

## Der 10-Sekunden-Check
1. **Ansprechen + Schütteln**: „Hallo, können Sie mich hören?" an der Schulter rütteln
2. **Atemwege freimachen**: Kopf nackenwärts überstrecken, Kinn anheben
3. **Atmung prüfen**: Sehen, Hören, Fühlen — max. 10 Sekunden
   - **Normale Atmung** → stabile Seitenlage, Notruf
   - **Keine / Schnappatmung** → SOFORT Reanimation

## Wichtig: Schnappatmung = Kreislaufstillstand
Schnappatmung ist **kein Lebenszeichen**. Sie tritt in den ersten Minuten des Kreislaufstillstands auf und wird oft fehlinterpretiert.

## Notruf
- Rufen: **„Hilfe! Herz-Kreislauf-Stillstand Zimmer 14!"**
- Zweite Person: **Notruf 112 / 122** und **AED holen**
- Bei Einzelperson: Notruf per Lautsprecher vom Handy, dann sofort Reanimation beginnen`,
    },
    {
      id: "bls-m2",
      kind: "text",
      order: 2,
      title: "Thoraxkompression — 30:2",
      estimatedMinutes: 12,
      body: `# Thoraxkompression nach ERC 2021

## Position
- Harte Unterlage (Boden oder Reanimationsbrett)
- Druckpunkt: **Mitte des Brustkorbs** (untere Hälfte Brustbein)
- Ballen beider Hände übereinander, Ellbogen durchgestreckt
- Schultern senkrecht über Druckpunkt

## Parameter
- **Frequenz: 100–120 / min** (Takt: „Stayin' Alive" der Bee Gees)
- **Tiefe: 5–6 cm** bei Erwachsenen
- **Entlastung vollständig** — Brustkorb komplett entlasten
- **Verhältnis 30:2** — 30 Kompressionen, 2 Beatmungen
- **Wechsel alle 2 Min** — Kompressionsqualität sinkt rasch durch Ermüdung

## Beatmung (wenn geschult)
- Kopf überstrecken, Kinn anheben
- Nase zuhalten, Mund-zu-Mund oder Beatmungsmaske
- 1 Sekunde Dauer, Brustkorb sichtbar heben
- Falls Beatmung nicht möglich: **nur Thoraxkompressionen** (besser als Pausen!)

## Häufigste Fehler
- Zu langsame Frequenz (< 100/min)
- Zu flache Kompression (< 5 cm)
- Unvollständige Entlastung
- Unterbrechungen > 10 Sekunden`,
    },
    {
      id: "bls-m3",
      kind: "text",
      order: 3,
      title: "AED — automatisierter externer Defibrillator",
      estimatedMinutes: 10,
      body: `# AED — so einfach wie möglich

Der AED analysiert selbstständig und entscheidet, ob ein Schock nötig ist. **Er kann einem lebenden Menschen keinen Schock geben**.

## 4 Schritte
1. **Einschalten** — folgen Sie den Sprachansagen
2. **Elektroden kleben**:
   - **Unter rechtes Schlüsselbein**
   - **Links seitlich unter Brust** (in Achselhöhe)
3. **Zurücktreten** — „Niemand berührt die Patientin!" — Analyse läuft
4. **Schockknopf drücken** (wenn empfohlen) — sofort Reanimation fortsetzen

## Sonderfälle
- **Herzschrittmacher**: Elektrode mind. 8 cm daneben kleben
- **Nässe**: Brust kurz abtrocknen
- **Starke Brustbehaarung**: mit Einwegrasierer kurz entfernen
- **Kinder 1–8 Jahre**: Kinder-Pads nutzen (falls vorhanden), sonst Erwachsenen-Pads vorne + hinten

## Reanimation fortsetzen
- Nach jedem Schock SOFORT 2 Min 30:2 — **nicht auf Puls prüfen**
- AED analysiert alle 2 Min automatisch erneut`,
    },
    {
      id: "bls-m4",
      kind: "quiz",
      order: 4,
      title: "Abschluss-Quiz BLS",
      estimatedMinutes: 15,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Wie lange dürfen Sie höchstens prüfen, ob eine Person normal atmet?",
          options: [
            { id: "a", text: "5 Sekunden", correct: false },
            { id: "b", text: "10 Sekunden", correct: true },
            { id: "c", text: "30 Sekunden", correct: false },
            { id: "d", text: "1 Minute", correct: false },
          ],
          explanation: "Max. 10 s — jede zusätzliche Sekunde ohne Kompression senkt die Überlebenschance.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Welche Kompressionsfrequenz empfiehlt ERC 2021?",
          options: [
            { id: "a", text: "60–80 / min", correct: false },
            { id: "b", text: "80–100 / min", correct: false },
            { id: "c", text: "100–120 / min", correct: true },
            { id: "d", text: "140–160 / min", correct: false },
          ],
          explanation: "100–120 / min. Merksatz: Takt von „Stayin' Alive“.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Wie tief wird beim Erwachsenen komprimiert?",
          options: [
            { id: "a", text: "2–3 cm", correct: false },
            { id: "b", text: "3–4 cm", correct: false },
            { id: "c", text: "5–6 cm", correct: true },
            { id: "d", text: "7–8 cm", correct: false },
          ],
          explanation: "5–6 cm, vollständige Entlastung zwischen den Kompressionen.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Was ist Schnappatmung?",
          options: [
            { id: "a", text: "Zeichen des Aufwachens", correct: false },
            { id: "b", text: "Normale Reaktion auf Stress", correct: false },
            { id: "c", text: "Zeichen eines beginnenden Kreislaufstillstands — sofort Reanimation", correct: true },
            { id: "d", text: "Kein Reanimationsgrund", correct: false },
          ],
          explanation: "Schnappatmung ist KEINE normale Atmung — Reanimation sofort starten.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Verhältnis Kompressionen : Beatmungen beim Erwachsenen?",
          options: [
            { id: "a", text: "15:2", correct: false },
            { id: "b", text: "30:2", correct: true },
            { id: "c", text: "50:2", correct: false },
            { id: "d", text: "Nur Beatmung", correct: false },
          ],
          explanation: "30 Thoraxkompressionen, dann 2 Beatmungen. Wenn Beatmung nicht möglich: nur Kompressionen.",
        },
        {
          id: "q6",
          type: "mc",
          points: 10,
          text: "Kann ein AED einer bewusstlosen, aber lebenden Person einen Schock geben?",
          options: [
            { id: "a", text: "Ja, wenn Knopf gedrückt wird", correct: false },
            { id: "b", text: "Nein — AED analysiert und gibt nur bei defibrillierbarem Rhythmus frei", correct: true },
            { id: "c", text: "Nur bei Kindern", correct: false },
            { id: "d", text: "Nur wenn Arzt daneben", correct: false },
          ],
          explanation: "AED erkennt defibrillierbare Rhythmen (VF, pulslose VT) — bei lebender Person gibt er keinen Schock frei.",
        },
        {
          id: "q7",
          type: "mc",
          points: 10,
          text: "Wie oft sollten sich Helfer bei der Reanimation abwechseln?",
          options: [
            { id: "a", text: "Alle 30 Sekunden", correct: false },
            { id: "b", text: "Alle 2 Minuten", correct: true },
            { id: "c", text: "Alle 10 Minuten", correct: false },
            { id: "d", text: "Nie wechseln", correct: false },
          ],
          explanation: "Kompressionsqualität sinkt nach 2 Min drastisch. Wechsel in < 5 s während AED-Analyse.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 4. DATENSCHUTZ DSGVO / DSG
// ===========================================================================
const dsgvo: Course = {
  id: "dsgvo",
  slug: "datenschutz-dsgvo",
  title: "Datenschutz DSGVO & DSG",
  shortDescription:
    "Umgang mit Gesundheitsdaten, Art. 9 DSGVO, Schweigepflicht, Auskunftsrecht, Data Breach-Meldung.",
  category: "pflicht",
  targetRoles: ["alle"],
  durationMinutes: 40,
  language: "de",
  difficulty: "einsteiger",
  validity: { type: "jaehrlich" },
  lawReference: "DSGVO Art. 9, Art. 32; BDSG / DSG 2018",
  learningObjectives: [
    "Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) erkennen",
    "TOMs (technische + organisatorische Maßnahmen) im Alltag umsetzen",
    "Betroffenenrechte (Auskunft, Löschung) bearbeiten können",
    "Data Breach innerhalb 72 h melden",
  ],
  literature: [
    "DSGVO Art. 5, 9, 32, 33",
    "BayLDA — Tätigkeitsberichte 2023/24",
    "DSB (AT) — Leitfaden für Pflegeeinrichtungen",
  ],
  thumbnailEmoji: "🔐",
  points: 80,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "ds-m1",
      kind: "text",
      order: 1,
      title: "Gesundheitsdaten — Art. 9 DSGVO",
      estimatedMinutes: 10,
      body: `# Art. 9 DSGVO — besondere Kategorien

Gesundheitsdaten genießen **besonderen Schutz**. Verarbeitung ist grundsätzlich **verboten**, außer:

- **Einwilligung** der betroffenen Person
- **Art. 9 Abs. 2 h DSGVO**: Erforderlich zur Gesundheitsversorgung, durch Berufsgeheimnisträger
- Arbeitsrechtliche Pflichten (Arbeitsmedizin)

## Berufsgeheimnis (§ 203 StGB / § 301 ABGB)
- Pflegekräfte, Ärztinnen, Therapeuten unterliegen dem Berufsgeheimnis
- Auch nach Ende des Arbeitsverhältnisses
- Bruch: Geldstrafe, Freiheitsstrafe bis 1 Jahr

## Darf ich…?
| Situation | Erlaubt? |
|---|---|
| Gesundheitsdaten in WhatsApp-Gruppe Kollegen | **NEIN** (unverschlüsselt, ausländische Cloud) |
| Übergabe-Notizen auf Papier in den Müll | **NEIN** — Aktenvernichter |
| Fotos von Wunden im privaten Handy | **NEIN** — nur in dienstlicher dokumentierter Anwendung |
| Angehörigen Gesundheitsstatus am Telefon durchgeben | **Nur mit Vollmacht & Authentifizierung** |
| Tratschen im Pausenraum über Bewohner:in | **NEIN** — Berufsgeheimnis gilt auch kollegenintern |`,
    },
    {
      id: "ds-m2",
      kind: "text",
      order: 2,
      title: "TOMs — Alltag im Heim",
      estimatedMinutes: 10,
      body: `# TOMs — technische und organisatorische Maßnahmen (Art. 32 DSGVO)

## Passwörter
- **Individuell** — niemals teilen
- **Bildschirmsperre** bei jedem Verlassen (Win+L)
- Kein Post-It am Monitor

## Physischer Zugang
- Dokumentationsraum verschlossen halten
- Bildschirm nicht zu Gang/Flur ausgerichtet
- Abschließbare Schränke für Papierakten

## E-Mail
- Gesundheitsdaten **nie unverschlüsselt** per Mail
- Verschlüsselung: S/MIME, PGP oder Passwort-geschütztes PDF
- Empfänger doppelt prüfen (Autocomplete-Falle!)

## Mobilgeräte
- Diensthandy mit MDM, Wipe bei Verlust
- Keine privaten USB-Sticks
- Fotos nur via offizielle App, nicht WhatsApp

## Auskunftsrechte (Art. 15)
- Bewohner:innen haben Recht auf Kopie **aller** über sie gespeicherten Daten
- Frist: **1 Monat**, verlängerbar auf 3
- Weiterleitung an Datenschutzbeauftragte:n`,
    },
    {
      id: "ds-m3",
      kind: "text",
      order: 3,
      title: "Data Breach — was tun wenn etwas passiert?",
      estimatedMinutes: 8,
      body: `# Data Breach — Meldepflicht 72 h

**Ein Datenschutzvorfall ist jede Verletzung, die zu Verlust, Zerstörung, unberechtigtem Zugriff oder Offenlegung führt.**

## Beispiele
- Laptop mit Bewohnerdaten gestohlen
- E-Mail mit Diagnoseliste an falschen Empfänger
- Akte im Müll statt im Schredder
- Ransomware auf der Dokumentationssoftware

## Eskalation
1. **Sofort** an Datenschutzbeauftragte:n melden (intern, Telefonliste)
2. Vorfall dokumentieren (Zeit, Beteiligte, Datenkategorien, Zahl Betroffener)
3. DSB prüft Meldepflicht an Aufsichtsbehörde (BayLDA / DSB) — **72 h**
4. Bei hohem Risiko auch Betroffene informieren
5. Maßnahmen: technisch (Passwort ändern) + organisatorisch (Schulung)

## Mitarbeiter-Schutz
- Keine Bestrafung bei ehrlicher Meldung — „Just Culture"
- Verheimlichen ist der einzige Fehler, der Konsequenzen hat`,
    },
    {
      id: "ds-m4",
      kind: "quiz",
      order: 4,
      title: "Abschluss-Quiz DSGVO",
      estimatedMinutes: 12,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Unter welchen Artikel fallen Gesundheitsdaten?",
          options: [
            { id: "a", text: "Art. 6 DSGVO", correct: false },
            { id: "b", text: "Art. 9 DSGVO (besondere Kategorien)", correct: true },
            { id: "c", text: "Art. 15 DSGVO", correct: false },
            { id: "d", text: "Gar nicht geregelt", correct: false },
          ],
          explanation: "Art. 9 regelt besondere Kategorien — darunter Gesundheit, religiöse Überzeugung, sexuelle Orientierung.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Binnen welcher Frist muss ein Data Breach an die Aufsichtsbehörde gemeldet werden?",
          options: [
            { id: "a", text: "24 Stunden", correct: false },
            { id: "b", text: "72 Stunden", correct: true },
            { id: "c", text: "1 Woche", correct: false },
            { id: "d", text: "1 Monat", correct: false },
          ],
          explanation: "Art. 33 DSGVO — 72 h an die Aufsichtsbehörde; bei hohem Risiko auch an Betroffene.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Dürfen Bewohnerdaten in der WhatsApp-Gruppe der Kollegen geteilt werden?",
          options: [
            { id: "a", text: "Ja, wenn alle Kollegen dort sind", correct: false },
            { id: "b", text: "Ja, wenn Leitung zustimmt", correct: false },
            { id: "c", text: "Nein — fehlende AV-Verträge, unverschlüsselte Speicherung in US-Cloud", correct: true },
            { id: "d", text: "Ja, bei Notfällen", correct: false },
          ],
          explanation: "WhatsApp ist kein zulässiger Kanal für Gesundheitsdaten. Einrichtung muss sichere Kanäle bereitstellen.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Eine Bewohnerin verlangt Kopie aller über sie gespeicherten Daten. Frist?",
          options: [
            { id: "a", text: "Sofort", correct: false },
            { id: "b", text: "1 Monat (Art. 12 Abs. 3)", correct: true },
            { id: "c", text: "6 Monate", correct: false },
            { id: "d", text: "Muss nicht beantwortet werden", correct: false },
          ],
          explanation: "Art. 12 Abs. 3 — 1 Monat, verlängerbar auf 3 bei Komplexität.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Was bedeutet Just Culture?",
          options: [
            { id: "a", text: "Nur Leitung darf Fehler machen", correct: false },
            { id: "b", text: "Fehler werden geahndet", correct: false },
            { id: "c", text: "Ehrliche Meldung von Fehlern ohne Bestrafung — Lernen statt Schuldigensuche", correct: true },
            { id: "d", text: "Keine Fehler-Kultur", correct: false },
          ],
          explanation: "Just Culture fördert Meldung — nur grobe Fahrlässigkeit/Vorsatz haben Konsequenzen.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 5. STURZPROPHYLAXE
// ===========================================================================
const sturz: Course = {
  id: "sturzprophylaxe",
  slug: "sturzprophylaxe",
  title: "Sturzprophylaxe — Expertenstandard",
  shortDescription:
    "Risikoeinschätzung nach DNQP, Mehrfachfaktoren-Assessment, Interventionen und Dokumentation.",
  category: "weiterbildung",
  targetRoles: ["pflegekraft", "pdl"],
  durationMinutes: 60,
  language: "de",
  difficulty: "fortgeschritten",
  validity: { type: "fuenfjaehrlich" },
  lawReference: "DNQP Expertenstandard Sturzprophylaxe (2. Aktualisierung 2022)",
  learningObjectives: [
    "Sturzrisikofaktoren (intrinsisch + extrinsisch) identifizieren",
    "Mehrfachfaktoren-Assessment durchführen",
    "Evidenzbasierte Interventionen auswählen",
    "Ereignisprotokoll erstellen und reflektieren",
  ],
  literature: [
    "DNQP — Expertenstandard Sturzprophylaxe in der Pflege, 2. Aktualisierung 2022",
    "WHO Global Report on Falls Prevention in Older Age 2023",
  ],
  thumbnailEmoji: "🚶",
  points: 120,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "st-m1",
      kind: "text",
      order: 1,
      title: "Sturzrisikofaktoren identifizieren",
      estimatedMinutes: 15,
      body: `# Sturzrisikofaktoren

Rund **30 % der über 65-Jährigen** stürzen mindestens einmal pro Jahr. In Pflegeheimen sind es **50 %**. Stürze sind die häufigste Ursache für Frakturen und Pflegestufen-Erhöhungen.

## Intrinsische Faktoren (Person)
- **Stürze in der Anamnese** (stärkster Prädiktor!)
- Gangstörung, Balancestörung
- Muskelschwäche (Sarkopenie)
- Sehstörung (Katarakt, Makuladegeneration)
- Kognitive Einschränkung (Demenz, Delir)
- Inkontinenz (Eile zur Toilette)
- Orthostatische Dysregulation
- Medikamente: **FRIDs** (Fall Risk Increasing Drugs) — Benzodiazepine, Antipsychotika, Diuretika

## Extrinsische Faktoren (Umgebung)
- Stolperkanten, Teppiche
- Unzureichende Beleuchtung (besonders nachts)
- Ungeeignetes Schuhwerk
- Fehlende Handläufe
- Rutschiger Boden (Bad!)
- Hohe Betten ohne Aufstehhilfe

## Verhaltensfaktoren
- Sturzangst (paradoxer Effekt: reduziert Aktivität → Muskelverlust → höheres Risiko)
- Risikoverhalten (steigt auf Stuhl ohne Hilfe)
- Schlafstörung → nächtliche Toilettengänge`,
    },
    {
      id: "st-m2",
      kind: "text",
      order: 2,
      title: "Assessment und Intervention",
      estimatedMinutes: 20,
      body: `# Assessment und Intervention

## Mehrfachfaktoren-Assessment (DNQP)

Kein einzelnes Tool — DNQP empfiehlt strukturierte Einschätzung statt Score-Tabellen:

- Anamnese: letzte 12 Monate Stürze, Beinahe-Stürze
- **Timed Up and Go (TUG)**: > 12 s = Sturzrisiko
- **Chair-Rise-Test**: 5× aufstehen ohne Hände, > 12 s = Risiko
- **Tandem-Stand**: 10 s hintereinander stehen, < 10 s = Risiko
- Medikamentenreview (besonders FRIDs)
- Umgebungs-Check im Bewohnerzimmer

## Interventionen — Evidenzgrad A

| Intervention | Evidenz |
|---|---|
| Körperliches Training (Kraft + Balance) 2–3× / Woche | A |
| Vitamin D 800–1000 IE / Tag bei Mangel | A |
| Medikamenten-Review (FRIDs absetzen) | A |
| Bewegungsmelder + Nachtlicht | B |
| Hüftprotektoren bei Hochrisiko | B |
| Sehkorrektur | B |

## Bettgitter & Fixierung

**Bettgitter sind keine Sturzprophylaxe.** Im Gegenteil: Bewohner:innen klettern darüber und stürzen aus größerer Höhe. Gitter nur auf ausdrücklichen Bewohnerwunsch, mit Beratung.

**Fixierung** ist **freiheitsentziehend** (§ 1906 BGB / UbG AT) — nur bei richterlicher Genehmigung und nach Abwägung mildere Mittel (Niederflurbett, Sensor).

## Nach einem Sturz
1. **Sofort**: Bewohner:in versorgen, Vitalzeichen, Schmerzen, Frakturzeichen
2. Arzt informieren
3. Ereignisprotokoll: Ort, Uhrzeit, Tätigkeit, Schuhe, Licht, Umfeld
4. Maßnahmen-Check: was hätte den Sturz verhindert?
5. Team-Fallbesprechung`,
    },
    {
      id: "st-m3",
      kind: "reflexion",
      order: 3,
      title: "Reflexion — Ihr letzter Sturzfall",
      estimatedMinutes: 10,
      prompt:
        "Denken Sie an einen konkreten Sturzfall der letzten Monate zurück. Welche Faktoren haben im Nachhinein dazu beigetragen? Welche davon waren bekannt, welche wurden übersehen? Was würden Sie beim nächsten Mal anders machen?",
      minWords: 100,
    },
    {
      id: "st-m4",
      kind: "quiz",
      order: 4,
      title: "Abschluss-Quiz Sturzprophylaxe",
      estimatedMinutes: 15,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Was ist der stärkste Prädiktor für zukünftige Stürze?",
          options: [
            { id: "a", text: "Alter über 80", correct: false },
            { id: "b", text: "Sturz in den letzten 12 Monaten", correct: true },
            { id: "c", text: "Männliches Geschlecht", correct: false },
            { id: "d", text: "Übergewicht", correct: false },
          ],
          explanation: "Vorherige Stürze sind der stärkste Einzelprädiktor. Daher systematisch erfragen.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Bettgitter zur Sturzprophylaxe…",
          options: [
            { id: "a", text: "sind Goldstandard", correct: false },
            { id: "b", text: "sind evidenzbasiert", correct: false },
            { id: "c", text: "erhöhen oft das Sturzrisiko und sind freiheitsentziehend", correct: true },
            { id: "d", text: "müssen bei jedem über 80 angebracht werden", correct: false },
          ],
          explanation: "Bewohner:innen klettern über Gitter und stürzen aus größerer Höhe. Gitter sind FeM — nur mit richterlicher Genehmigung.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Ab welcher Zeit gilt der Timed Up and Go-Test als auffällig?",
          options: [
            { id: "a", text: "> 8 s", correct: false },
            { id: "b", text: "> 12 s", correct: true },
            { id: "c", text: "> 20 s", correct: false },
            { id: "d", text: "Zeitgrenze existiert nicht", correct: false },
          ],
          explanation: "DNQP: > 12 s weist auf erhöhtes Sturzrisiko hin. Weiterführendes Assessment indiziert.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Welche Intervention hat Evidenzgrad A?",
          options: [
            { id: "a", text: "Körperliches Training (Kraft + Balance)", correct: true },
            { id: "b", text: "Hüftprotektoren standardmäßig für alle", correct: false },
            { id: "c", text: "Sedierung", correct: false },
            { id: "d", text: "Gehstützen ohne Anpassung", correct: false },
          ],
          explanation: "Kraft-/Balance-Training 2–3× / Woche reduziert Stürze um ca. 30 %. Evidenzgrad A.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Was sind FRIDs?",
          options: [
            { id: "a", text: "Sturzmatten-Firma", correct: false },
            { id: "b", text: "Fall Risk Increasing Drugs — sturzrisikoerhöhende Medikamente", correct: true },
            { id: "c", text: "Französische Pflegerichtlinien", correct: false },
            { id: "d", text: "Eine Frakturklassifikation", correct: false },
          ],
          explanation: "Benzodiazepine, Antipsychotika, Antidepressiva, Diuretika — immer Medikamentenreview.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 6. DEKUBITUSPROPHYLAXE
// ===========================================================================
const dekubitus: Course = {
  id: "dekubitus",
  slug: "dekubitusprophylaxe",
  title: "Dekubitusprophylaxe — Expertenstandard",
  shortDescription:
    "Risikoeinschätzung (Braden), Druckentlastung, Lagerungsintervalle, Wundstadien EPUAP/NPIAP.",
  category: "weiterbildung",
  targetRoles: ["pflegekraft", "pdl"],
  durationMinutes: 60,
  language: "de",
  difficulty: "fortgeschritten",
  validity: { type: "fuenfjaehrlich" },
  lawReference: "DNQP Expertenstandard Dekubitusprophylaxe (2. Aktualisierung 2017, laufend)",
  learningObjectives: [
    "Dekubitusrisiko mit Braden-Skala einschätzen",
    "EPUAP/NPIAP-Stadien 1–4 unterscheiden",
    "Lagerungskonzepte (30°-Schräglage, Mikrolagerung) anwenden",
    "Haut- und Ernährungsinterventionen planen",
  ],
  literature: [
    "DNQP Expertenstandard Dekubitusprophylaxe 2017",
    "EPUAP/NPIAP/PPPIA International Guideline 2019",
    "ICW-Dekubitus-Leitlinie 2023",
  ],
  thumbnailEmoji: "🛏️",
  points: 120,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "de-m1",
      kind: "text",
      order: 1,
      title: "Risikoeinschätzung und Stadien",
      estimatedMinutes: 15,
      body: `# Dekubitus — Entstehung und Einschätzung

Ein Dekubitus entsteht durch **Druck + Zeit** oder **Druck + Scherkräfte**, meist über knöchernen Prominenzen (Sakrum, Ferse, Trochanter, Sitzbein).

## Risikofaktoren
- Immobilität (wichtigster Faktor)
- Inkontinenz (Feuchtigkeit, Aufweichen der Haut)
- Mangelernährung (Eiweiß, Zink, Vitamin C)
- Durchblutungsstörung (pAVK, Diabetes)
- Dünne Haut (Alter, Cortison)
- Scherkräfte (Rutschen in halbsitzender Position)

## Braden-Skala (6 Items, 6–23 Punkte)
- Sensorische Wahrnehmung
- Feuchtigkeit
- Aktivität
- Mobilität
- Ernährung
- Reibung / Scherkräfte

**Werte**: < 18 = Risiko, < 13 = hohes Risiko, < 9 = sehr hohes Risiko

## EPUAP/NPIAP Stadien
- **Stadium 1**: nicht-wegdrückbare Rötung bei intakter Haut
- **Stadium 2**: Blase oder oberflächlicher Hautdefekt (bis Dermis)
- **Stadium 3**: Ulkus bis Subkutis (Fettgewebe sichtbar)
- **Stadium 4**: Ulkus mit freiliegendem Muskel, Sehne, Knochen
- **Nicht klassifizierbar**: vollständige Bedeckung durch Belag
- **Tiefe Gewebeschädigung**: lokalisierte lila/braune Verfärbung`,
    },
    {
      id: "de-m2",
      kind: "text",
      order: 2,
      title: "Interventionen — Lagerung und Haut",
      estimatedMinutes: 20,
      body: `# Interventionen

## Lagerungskonzepte
- **30°-Schräglage**: Rücken, 30° seitlich rechts / links im Wechsel — entlastet Sakrum und Trochanter
- **Mikrolagerung**: minimale Positionsänderungen (5–10°) alle 1–2 h, besonders bei Bewohner:innen die nicht mehr umgelagert werden mögen
- **135°-Bauchlage**: selten, nur gezielt bei Steißbein-Dekubitus

## Intervalle
- Individuell nach Haut-Kontrolle (**„no blanche" Test**) — nicht starre 2-h-Regel
- Haut nach jedem Wechsel kontrollieren — Rötung > 30 min = Intervall verkürzen

## Druckverteilende Auflagen
- **Weichlagerung (Schaumstoff)**: leichtes bis mittleres Risiko
- **Wechseldruck-Matratzen**: hohes Risiko
- **Mikrostimulations-Systeme**: fördern Eigenbewegung

## Ferse besonders schützen
- **Freilagerung** — Kissen unter Unterschenkel, Ferse schwebt
- Keine Ring-/Donut-Kissen (schneiden Durchblutung ab)

## Haut
- Trocken halten (Feuchtigkeitsschutz bei Inkontinenz)
- pH-neutrale Reinigung, nicht reiben
- KEINE Massage geröteter Stellen — Gewebeschaden möglich
- Wasser-in-Öl-Schutzfilme nur auf intakter Haut

## Ernährung
- Eiweiß 1,2–1,5 g/kg KG/Tag
- Flüssigkeit 30 ml/kg KG/Tag
- Bei Mangelernährung: Trinknahrung, Supplementierung
- Screening MNA oder NRS-2002`,
    },
    {
      id: "de-m3",
      kind: "quiz",
      order: 3,
      title: "Abschluss-Quiz Dekubitus",
      estimatedMinutes: 15,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Ab welchem Braden-Wert besteht Dekubitusrisiko?",
          options: [
            { id: "a", text: "< 10", correct: false },
            { id: "b", text: "< 18", correct: true },
            { id: "c", text: "> 20", correct: false },
            { id: "d", text: "Braden misst kein Dekubitusrisiko", correct: false },
          ],
          explanation: "Braden < 18 = Risiko, < 13 = hoch, < 9 = sehr hoch.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Welches Stadium: nicht-wegdrückbare Rötung bei intakter Haut?",
          options: [
            { id: "a", text: "Stadium 1", correct: true },
            { id: "b", text: "Stadium 2", correct: false },
            { id: "c", text: "Stadium 3", correct: false },
            { id: "d", text: "Stadium 4", correct: false },
          ],
          explanation: "Stadium 1 nach EPUAP/NPIAP — nicht-wegdrückbare Rötung (Fingertest).",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Darf eine gerötete Stelle massiert werden?",
          options: [
            { id: "a", text: "Ja, das fördert die Durchblutung", correct: false },
            { id: "b", text: "Ja, mit Franzbranntwein", correct: false },
            { id: "c", text: "Nein — Massage kann Gewebeschaden verursachen", correct: true },
            { id: "d", text: "Nur mit Arzt-Anweisung", correct: false },
          ],
          explanation: "Massage geröteter Stellen ist obsolet. Druck entlasten, Haut beobachten.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Wie wird die Ferse am besten geschützt?",
          options: [
            { id: "a", text: "Ring-Kissen unter die Ferse", correct: false },
            { id: "b", text: "Ferse freilagern — Kissen unter Unterschenkel", correct: true },
            { id: "c", text: "Extra-fester Verband", correct: false },
            { id: "d", text: "Kein Schutz nötig", correct: false },
          ],
          explanation: "Freilagerung — Ferse schwebt. Ring-Kissen schneiden die Durchblutung ab.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Welche Lagerung entlastet Sakrum und Trochanter?",
          options: [
            { id: "a", text: "90°-Seitenlage", correct: false },
            { id: "b", text: "30°-Schräglage", correct: true },
            { id: "c", text: "Halbsitzende Position", correct: false },
            { id: "d", text: "Bauchlage", correct: false },
          ],
          explanation: "30°-Schräglage entlastet sowohl Sakrum als auch Trochanter — Kombi-Lagerung.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 7. DEMENZ-SENSIBLE PFLEGE
// ===========================================================================
const demenz: Course = {
  id: "demenz",
  slug: "demenz-sensible-pflege",
  title: "Demenz-sensible Pflege",
  shortDescription:
    "Validation nach Feil, Biographiearbeit, herausforderndes Verhalten — personzentriert begegnen.",
  category: "weiterbildung",
  targetRoles: ["pflegekraft", "pdl"],
  durationMinutes: 90,
  language: "de",
  difficulty: "fortgeschritten",
  validity: { type: "einmalig" },
  learningObjectives: [
    "Demenz-Formen (Alzheimer, vaskulär, Lewy, FTD) unterscheiden",
    "Validation nach Naomi Feil anwenden",
    "Biographiearbeit als Zugang nutzen",
    "Herausforderndes Verhalten (BPSD) deeskalieren",
  ],
  literature: [
    "Feil, N. — Validation. Ein Weg zum Verständnis verwirrter alter Menschen",
    "Kitwood, T. — Demenz. Der person-zentrierte Ansatz",
    "S3-Leitlinie Demenzen 2023 (DGPPN, DGN)",
  ],
  thumbnailEmoji: "🧠",
  points: 180,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "dm-m1",
      kind: "text",
      order: 1,
      title: "Demenz verstehen — Formen & Verlauf",
      estimatedMinutes: 15,
      body: `# Demenz — eine Übersicht

Demenz ist kein eigenständiges Krankheitsbild, sondern ein **Syndrom** aus nachlassender Gedächtnisleistung, Sprache, Orientierung und Alltagskompetenzen.

## Häufigste Formen

| Form | Anteil | Besonderheit |
|---|---|---|
| Alzheimer-Demenz | ~60 % | Schleichend, zuerst Kurzzeitgedächtnis |
| Vaskuläre Demenz | ~15 % | Stufenweise nach kleinen Schlaganfällen |
| Lewy-Body | ~10 % | Fluktuationen, visuelle Halluzinationen, Parkinson-Symptome |
| Fronto-temporal (FTD) | ~5 % | Persönlichkeitsveränderung vor Gedächtnisverlust |
| Mischformen | 10 % | Alzheimer + vaskulär |

## Stadien (Reisberg)
- **Früh**: Vergesslichkeit, Suchen von Wörtern, eingeschränkte Urteilsfähigkeit
- **Mittel**: Hilfe bei Alltag, Orientierungsstörung, Schlaf-Wach-Umkehr
- **Schwer**: vollständige Pflegebedürftigkeit, Sprachverlust, Schluckstörung

## Was erhalten bleibt
Auch im schweren Stadium bleiben oft erhalten:
- **Emotionales Gedächtnis** — Stimmungen werden „gespürt"
- **Prozedurales Gedächtnis** — erlernte Bewegungsabläufe (Zähneputzen, Klavier)
- **Musik und Rhythmus**
- **Berührung, Blickkontakt**`,
    },
    {
      id: "dm-m2",
      kind: "text",
      order: 2,
      title: "Validation nach Naomi Feil",
      estimatedMinutes: 20,
      body: `# Validation — die Welt der Bewohner:in annehmen

Naomi Feil entwickelte in den 1970ern die Validation — statt zu **korrigieren** („Ihr Mann ist seit 20 Jahren verstorben") nimmt die Pflegende die Realität des Gegenübers **an**.

## Grundprinzip
„Verwirrtes" Verhalten ist nie sinnlos — es hat eine biografische und emotionale Funktion. Unsere Aufgabe: **den Gefühlsinhalt verstehen und spiegeln**.

## Die 4 Phasen nach Feil
1. **Mangelhafte Orientierung** — sucht Halt, klammert an Erinnerungen
2. **Zeitverwirrtheit** — lebt in der Vergangenheit, sucht tote Angehörige
3. **Sich wiederholende Bewegungen** — Rituale (wischen, reiben, laufen)
4. **Vegetieren** — minimale Kommunikation, Rückzug

## Techniken
- **Zentrieren**: eigene Gedanken abschalten, im Moment sein
- **Tatsachen-Fragen** statt Gefühlsfragen: „Wann war das?" nicht „Wie fühlt sich das an?"
- **Umformulieren**: Schlüsselworte aufnehmen — „Ihre Mutter wartet auf Sie?"
- **Polarität**: „Wie schlimm ist es heute?" nicht „Ist es schlimm?"
- **Berührung**: sanft an Wange, Schulter
- **Augenkontakt auf Augenhöhe**
- **Musik & Rhythmus**

## Beispiel
Frau M. (88, Alzheimer) steht nachts im Nachthemd im Flur: „Ich muss die Kinder zur Schule bringen!"

**Korrektur (falsch)**: „Frau M., Sie sind im Heim. Ihre Kinder sind längst erwachsen."
**Validation**: „Sie haben Ihre Kinder immer so pünktlich zur Schule gebracht, ja? Was war der Lieblingsweg?"`,
    },
    {
      id: "dm-m3",
      kind: "text",
      order: 3,
      title: "Biographiearbeit — der Schlüssel zur Person",
      estimatedMinutes: 15,
      body: `# Biographiearbeit

Mit fortschreitender Demenz verliert die Person zunehmend den Zugang zum eigenen „Ich". Biographische Informationen sind **Anker**.

## Was gehört in die Biographie?

- **Herkunft & Familie** — Geschwister, Eltern, Heimatort
- **Beruf** — war er Lokführer? Hat er Kühe gemolken?
- **Lebensgeschichten** — Krieg, Flucht, Hochzeit, Kinder, Verlust
- **Vorlieben** — Musik, Essen, Hobbys
- **Abneigungen** — Gerüche, bestimmte Worte, Situationen
- **Rituale** — Abendgebet, Kaffee um 15 Uhr

## Wo hole ich Infos?

- **Angehörige** (Gold wert!) — erstes Gespräch innerhalb 14 Tagen
- **Fotos, alte Briefe, Tagebücher**
- **Bewohnerin selbst** — auch bei Demenz kommen Erinnerungen
- **Ehemalige Bekannte, Nachbarn**

## Im Alltag nutzen

- **Begrüßung**: „Guten Morgen Frau Huber, wie geht's der Chefin vom Gasthaus?"
- **Beschäftigung**: ehemalige Bäuerin bekommt Körner zum Sortieren
- **Musik**: Lieblingsmusik der Jugend (15–25 Jahre) wirkt am stärksten
- **Essen**: Lieblingsessen bei Nahrungsverweigerung probieren

## Biographische Reize gegen BPSD
Herausforderndes Verhalten verschwindet oft, wenn wir den biografischen Kontext verstehen. Beispiel: Herr B. schlägt beim Waschen — in seiner Biographie: KZ-Überlebender, Duschen = Angst vor Gas. Lösung: Waschlappen-Wäsche im Bett, ruhige Stimme.`,
    },
    {
      id: "dm-m4",
      kind: "text",
      order: 4,
      title: "Herausforderndes Verhalten (BPSD)",
      estimatedMinutes: 15,
      body: `# BPSD — Behavioral and Psychological Symptoms of Dementia

BPSD umfasst: Agitation, Aggression, Unruhe, Apathie, Schreien, Wahn, Halluzinationen, Schlafstörung.

## NDB-Modell (Need-driven Dementia-compromised Behavior)
Verhalten ist **Ausdruck eines Bedürfnisses**, das die Person nicht mehr verbalisieren kann.

Grundbedürfnisse:
- **Körperlich**: Schmerzen, Hunger, Durst, Toilette, zu warm/kalt
- **Psychisch**: Angst, Einsamkeit, Überforderung, Lärm
- **Sozial**: Kontakt, Sicherheit, Zugehörigkeit

## Deeskalation
- **Ruhe ausstrahlen** — Körpersprache, langsame Bewegungen
- **Von vorne ansprechen**, nicht von hinten
- **Name nennen** und sich selbst vorstellen („Ich bin Maria, Pflegerin")
- **Kurze, einfache Sätze**
- **Keine Diskussion, keine Logik** — vergeblich
- **Ablenkung** statt Konfrontation
- **Raus aus der Situation** — Musik, Spaziergang

## Medikamentöse Therapie — letzte Option
- **Antipsychotika** nur bei Selbst-/Fremdgefährdung, befristet, niedrig dosiert
- **Risiken**: Sturz, Schlaganfall, Mortalität erhöht
- **Besser**: nicht-medikamentöse Interventionen zuerst`,
    },
    {
      id: "dm-m5",
      kind: "reflexion",
      order: 5,
      title: "Reflexion — Validation in der Praxis",
      estimatedMinutes: 10,
      prompt:
        "Beschreiben Sie eine Situation, in der Sie mit einer dementen Bewohnerin kommuniziert haben. Hätten Sie mit den Validation-Techniken nach Feil anders reagieren können? Was haben Sie über die biographischen Hintergründe dieser Person gewusst — was fehlte?",
      minWords: 150,
    },
    {
      id: "dm-m6",
      kind: "quiz",
      order: 6,
      title: "Abschluss-Quiz Demenz",
      estimatedMinutes: 15,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Welche Demenz-Form ist häufigste?",
          options: [
            { id: "a", text: "Vaskulär", correct: false },
            { id: "b", text: "Alzheimer", correct: true },
            { id: "c", text: "Lewy-Body", correct: false },
            { id: "d", text: "Fronto-temporal", correct: false },
          ],
          explanation: "Alzheimer ~ 60 % aller Demenzen.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Wie reagieren Sie auf: „Ich muss meine Kinder von der Schule abholen!“ (von 90-jähriger Demenz-Bewohnerin)?",
          options: [
            { id: "a", text: "„Ihre Kinder sind längst erwachsen“", correct: false },
            { id: "b", text: "„Das ist nicht real“", correct: false },
            { id: "c", text: "„Waren Ihre Kinder gute Schüler? Wie alt sind sie gewesen?“", correct: true },
            { id: "d", text: "Sie ignorieren es", correct: false },
          ],
          explanation: "Validation: Realität annehmen, biografischen Bezug suchen. Korrekturen erzeugen Angst und Aggression.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Welche Funktion erfüllt herausforderndes Verhalten nach NDB-Modell?",
          options: [
            { id: "a", text: "Zufällig, ohne Ursache", correct: false },
            { id: "b", text: "Ausdruck unerfüllter Bedürfnisse", correct: true },
            { id: "c", text: "Böswilligkeit", correct: false },
            { id: "d", text: "Nur medikamentös behandelbar", correct: false },
          ],
          explanation: "NDB: Verhalten zeigt unerfülltes körperliches, psychisches oder soziales Bedürfnis.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Welche Erinnerungen bleiben bei Alzheimer oft am längsten erhalten?",
          options: [
            { id: "a", text: "Gestrige Ereignisse", correct: false },
            { id: "b", text: "Emotionale und biographische Erinnerungen aus Jugend", correct: true },
            { id: "c", text: "Telefonnummern", correct: false },
            { id: "d", text: "Neue Namen", correct: false },
          ],
          explanation: "Das Kurzzeitgedächtnis geht zuerst. Biographische Ereignisse aus der Jugend (15–25 J.) bleiben am längsten.",
        },
        {
          id: "q5",
          type: "mc",
          points: 10,
          text: "Antipsychotika bei BPSD…",
          options: [
            { id: "a", text: "sind erste Wahl", correct: false },
            { id: "b", text: "sind letzte Option, nur bei Gefährdung, befristet", correct: true },
            { id: "c", text: "haben keine Nebenwirkungen", correct: false },
            { id: "d", text: "senken das Sturzrisiko", correct: false },
          ],
          explanation: "Antipsychotika erhöhen Sturz-, Schlaganfall- und Mortalitätsrisiko. Nicht-medikamentös zuerst.",
        },
        {
          id: "q6",
          type: "mc",
          points: 10,
          text: "Warum Lieblingsmusik aus der Jugend einsetzen?",
          options: [
            { id: "a", text: "Weil sie lauter ist", correct: false },
            { id: "b", text: "Weil Erinnerungen aus 15–25 J. am stärksten emotional verankert sind", correct: true },
            { id: "c", text: "Weil sie billig ist", correct: false },
            { id: "d", text: "Es gibt keinen Unterschied", correct: false },
          ],
          explanation: "Reminiscence Bump — Erinnerungen aus der Jugendzeit sind am stärksten emotional verankert und bleiben am längsten abrufbar.",
        },
      ],
    },
  ],
};

// ===========================================================================
// 8. CAREAI ONBOARDING
// ===========================================================================
const onboarding: Course = {
  id: "careai-onboarding",
  slug: "careai-onboarding",
  title: "CareAI Onboarding — die Basics",
  shortDescription:
    "Erste Schritte mit CareAI: Anmeldung, Dokumentation per Sprache, Übergabe, Bewohner:innen-Akte.",
  category: "onboarding",
  targetRoles: ["pflegekraft", "pdl", "admin"],
  durationMinutes: 30,
  language: "de",
  difficulty: "einsteiger",
  validity: { type: "einmalig" },
  learningObjectives: [
    "Sich bei CareAI sicher anmelden (2FA)",
    "Bewohner:innen-Akte verstehen",
    "Sprach-Dokumentation nutzen",
    "Schichtbericht erstellen",
  ],
  literature: ["CareAI Handbuch 2026", "CareAI Hilfe-Center"],
  thumbnailEmoji: "🚀",
  points: 40,
  published: true,
  updatedAt: "2026-04-17",
  modules: [
    {
      id: "oa-m1",
      kind: "text",
      order: 1,
      title: "Anmeldung & Sicherheit",
      estimatedMinutes: 7,
      body: `# Willkommen bei CareAI

CareAI ist Ihre zentrale Plattform für Dokumentation, Übergabe und Bewohner:innen-Verwaltung.

## Anmeldung
1. Öffnen Sie **app.careai.at** (oder Ihren Einrichtungs-Link)
2. E-Mail + Passwort (mindestens 12 Zeichen, 1 Sonderzeichen)
3. **2FA** per App (empfohlen) oder SMS

## Passwort-Regeln
- Mindestens 12 Zeichen
- Niemals wiederverwenden
- Niemals teilen — jede Kraft hat eigenen Zugang

## Bildschirmsperre
- **Win + L** (Windows) bzw. **Ctrl + Cmd + Q** (Mac) beim Verlassen
- Automatische Sperre nach 5 min Inaktivität

## Rollen in CareAI
- **Pflegekraft**: Dokumentation, Bewohner:innen-Akte (eigene Station), Übergabe
- **PDL**: zusätzlich Dienstplan, Freigaben, Reports
- **Admin**: Systemeinstellungen, User-Verwaltung, Audit`,
    },
    {
      id: "oa-m2",
      kind: "text",
      order: 2,
      title: "Bewohner:innen-Akte",
      estimatedMinutes: 8,
      body: `# Die digitale Akte

In der Akte finden Sie alle Informationen zu einer Bewohner:in zentral:

## Reiter
- **Stammdaten**: Name, Geburtsdatum, Pflegegrad, Kontakte
- **SIS**: Strukturierte Informationssammlung (Lebensbereiche)
- **Pflegeplanung**: Ressourcen, Probleme, Ziele, Maßnahmen
- **Dokumentation**: tägliche Einträge chronologisch
- **Vitalwerte**: Blutdruck, Puls, Temperatur, Gewicht (mit Verlaufsgraphen)
- **Medikation**: aktueller Plan, Historie
- **Wunden**: Fotos, Stadium, Größe, Verlauf
- **Angehörige**: Kontakte, Vollmachten

## Suche
- **Global**: Strg + K — suchen Sie Bewohner:in, Eintrag, Dokument
- **Semantisch**: „Frau mit Diabetes Zimmer 12" funktioniert

## Datenschutz
- Einträge können nicht nachträglich gelöscht werden (Audit)
- Korrekturen: neuer Eintrag mit Begründung
- Zugriffe werden protokolliert`,
    },
    {
      id: "oa-m3",
      kind: "text",
      order: 3,
      title: "Sprach-Dokumentation & Schichtbericht",
      estimatedMinutes: 10,
      body: `# Sprach-Dokumentation

CareAI versteht gesprochene Dokumentation — **3× schneller** als Tippen.

## So geht's
1. Bei Bewohner:in: Mikrofon-Symbol (oder Tastenkürzel **Strg + Shift + V**)
2. Frei sprechen: „Frau Huber hat heute Morgen 150 ml getrunken, Blutdruck 135 zu 80, leicht erhöhte Unruhe am Nachmittag, kein Schmerz angegeben"
3. CareAI zeigt strukturierten Entwurf — prüfen, anpassen, **bestätigen**

## Wichtig
- Keine Daten anderer Bewohner:innen in einem Diktat mischen
- Immer Name + Zimmer am Anfang nennen
- Nur in geschlossenen Räumen diktieren (Datenschutz)

## Schichtbericht
- Automatisch zusammengefasst aus Einträgen der Schicht
- Sie können Abschnitte hinzufügen oder hervorheben
- Übergabe beim Schichtwechsel digital + mündlich

## Hilfe
- **?**-Symbol oben rechts
- Chat-Support Mo–Fr 8–18 Uhr
- Notfall: 0800 CAREAI 24/7`,
    },
    {
      id: "oa-m4",
      kind: "quiz",
      order: 4,
      title: "Abschluss-Quiz CareAI Onboarding",
      estimatedMinutes: 5,
      passThreshold: 0.8,
      isFinal: true,
      questions: [
        {
          id: "q1",
          type: "mc",
          points: 10,
          text: "Welches Tastenkürzel öffnet die Sprach-Dokumentation?",
          options: [
            { id: "a", text: "Strg + V", correct: false },
            { id: "b", text: "Strg + Shift + V", correct: true },
            { id: "c", text: "F5", correct: false },
            { id: "d", text: "Alt + M", correct: false },
          ],
          explanation: "Strg + Shift + V — V wie Voice.",
        },
        {
          id: "q2",
          type: "mc",
          points: 10,
          text: "Was tun Sie beim Verlassen des Arbeitsplatzes?",
          options: [
            { id: "a", text: "Nichts, kommt ja gleich wieder", correct: false },
            { id: "b", text: "Bildschirm sperren (Win + L)", correct: true },
            { id: "c", text: "Monitor ausschalten", correct: false },
            { id: "d", text: "Browser schließen", correct: false },
          ],
          explanation: "Win + L sperrt sofort — Standard beim Verlassen.",
        },
        {
          id: "q3",
          type: "mc",
          points: 10,
          text: "Kann man Einträge in der Akte nachträglich löschen?",
          options: [
            { id: "a", text: "Ja, jederzeit", correct: false },
            { id: "b", text: "Nein — Audit-Pflicht. Korrekturen per neuem Eintrag", correct: true },
            { id: "c", text: "Nur durch Admin", correct: false },
            { id: "d", text: "Nach 24 h", correct: false },
          ],
          explanation: "Medizinische Dokumentation ist revisionssicher. Fehler werden korrigiert, nicht gelöscht.",
        },
        {
          id: "q4",
          type: "mc",
          points: 10,
          text: "Was öffnet die globale Suche?",
          options: [
            { id: "a", text: "F1", correct: false },
            { id: "b", text: "Strg + K", correct: true },
            { id: "c", text: "Strg + F", correct: false },
            { id: "d", text: "Alt + S", correct: false },
          ],
          explanation: "Strg + K — Standard-Shortcut in CareAI.",
        },
      ],
    },
  ],
};

// ===========================================================================
// EXPORT
// ===========================================================================
export const COURSES: Course[] = [
  hygiene,
  brandschutz,
  bls,
  dsgvo,
  sturz,
  dekubitus,
  demenz,
  onboarding,
];

export function findCourse(slugOrId: string): Course | undefined {
  return COURSES.find((c) => c.id === slugOrId || c.slug === slugOrId);
}
