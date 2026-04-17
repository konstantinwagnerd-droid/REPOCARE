import type { PressItem } from "./PressCard";
import type { MediaAsset } from "./MediaGrid";
import type { ExpertQuote } from "./QuoteBank";
import type { FactSection } from "./FactSheet";

export const pressReleases: PressItem[] = [
  {
    slug: "gruendung-careai-2024",
    date: "2024-10-01",
    category: "Unternehmen",
    title: "CareAI startet: Wiener Gründer:innen wollen Pflege-Dokumentation revolutionieren",
    subtitle:
      "Ein junges Team aus KI-Expert:innen und Pflegekräften gründet in Wien die CareAI GmbH, um 67 % der Dokumentationszeit in stationären Einrichtungen einzusparen.",
    location: "Wien",
  },
  {
    slug: "pilot-seniorenresidenz-hietzing",
    date: "2025-03-14",
    category: "Pilot",
    title: "Erste Pflege-Einrichtung setzt CareAI ein: 90 Minuten mehr Zeit pro Schicht",
    subtitle:
      "Die Seniorenresidenz Hietzing zieht nach sechs Wochen Pilotbetrieb Bilanz: weniger Burnout, bessere Dokumentation, messbar mehr Zeit am Bewohner.",
    location: "Wien",
  },
  {
    slug: "aws-preseed-foerderung",
    date: "2025-07-22",
    category: "Finanzierung",
    title: "CareAI sichert sich aws-Preseed-Förderung über 200.000 Euro",
    subtitle:
      "Die Austria Wirtschaftsservice GmbH fördert CareAI für Markteintritt, klinische Validierung und EU-AI-Act-Konformität.",
    location: "Wien",
  },
  {
    slug: "eu-ai-act-konformitaet",
    date: "2026-02-10",
    category: "Produkt",
    title: "Erstes KI-Pflege-System mit vollständiger EU-AI-Act-Konformität geht live",
    subtitle:
      "CareAI veröffentlicht die erste Version, die alle Transparenz- und Aufsichtspflichten für Hochrisiko-KI im Gesundheitsbereich erfüllt.",
    location: "Wien",
  },
  {
    slug: "1000-bewohner-meilenstein",
    date: "2026-04-01",
    category: "Meilenstein",
    title: "CareAI dokumentiert bereits 1.000 Bewohner:innen in DACH-Einrichtungen",
    subtitle:
      "Nach 6 Monaten am Markt betreut CareAI 1.000 Pflegebedürftige in 12 Einrichtungen. Nächster Schritt: Expansion in weitere deutsche Bundesländer.",
    location: "Wien",
  },
];

export const mediaAssets: MediaAsset[] = [
  {
    id: "logo-primary",
    label: "CareAI Logo — Primär",
    description: "Vollfarbige Variante Petrol + Orange, horizontal. SVG + PNG @2x.",
    format: "SVG, PNG",
    size: "42 KB",
    kind: "logo",
  },
  {
    id: "logo-mono",
    label: "CareAI Logo — Monochrom",
    description: "Einfarbig schwarz oder weiß für Einfarb-Druck.",
    format: "SVG, EPS",
    size: "18 KB",
    kind: "logo",
  },
  {
    id: "logo-claim",
    label: "CareAI Logo mit Claim",
    description: `"Mehr Zeit am Bewohner." — mit Wordmark.`,
    format: "SVG, PNG",
    size: "36 KB",
    kind: "logo",
  },
  {
    id: "logo-secondary",
    label: "CareAI Bildmarke",
    description: "Nur das Symbol, quadratisch. Für Social-Avatare.",
    format: "SVG, PNG",
    size: "22 KB",
    kind: "logo",
  },
  {
    id: "photo-team",
    label: "Gründungsteam",
    description: "Konstantin Wagner und Team, Studio-Shot. Frei für redaktionelle Nutzung.",
    format: "JPG @4k",
    size: "3,8 MB",
    kind: "photo",
  },
  {
    id: "photo-product",
    label: "Produkt in der Einrichtung",
    description: "Pflegekraft nutzt CareAI-Tablet während einer Schicht (gestellte Szene).",
    format: "JPG @4k",
    size: "4,1 MB",
    kind: "photo",
  },
  {
    id: "photo-hietzing",
    label: "Pilot Hietzing",
    description: "Seniorenresidenz Hietzing — Eingangsbereich und Pflegekraft-Portrait.",
    format: "JPG (Serie, 6 Motive)",
    size: "18 MB",
    kind: "photo",
  },
  {
    id: "demo-video",
    label: "Produkt-Demo (90s)",
    description: "Kurzer Produkt-Walkthrough mit Voice-Over. Deutsch.",
    format: "MP4 1080p",
    size: "62 MB",
    kind: "video",
  },
  {
    id: "explainer-video",
    label: "Erklärvideo (3:20)",
    description: "CareAI in drei Minuten — Pflegealltag, KI-Nutzen, Datenschutz.",
    format: "MP4 1080p",
    size: "118 MB",
    kind: "video",
  },
  {
    id: "deck-press",
    label: "Presse-Deck",
    description: "12 Slides: Mission, Team, Produkt, Zahlen, Kontakte.",
    format: "PDF",
    size: "6,2 MB",
    kind: "deck",
  },
  {
    id: "deck-investors",
    label: "Investor-Deck (öffentliche Version)",
    description: "Ohne vertrauliche Zahlen. Nutzbar für Redaktionen.",
    format: "PDF",
    size: "4,8 MB",
    kind: "deck",
  },
  {
    id: "illus-pflege-workflow",
    label: "Illustration Pflege-Workflow",
    description: "Infografik zum SIS-Prozess mit CareAI. Vektor.",
    format: "SVG, PDF",
    size: "280 KB",
    kind: "illustration",
  },
];

export const expertQuotes: ExpertQuote[] = [
  {
    topic: "Pflegenotstand",
    quote:
      "Die deutsche Pflege verliert jedes Jahr 40.000 Pflegekräfte allein durch Burnout. 30 % davon nennen die Dokumentationslast als Hauptgrund. Jede Stunde, die wir von der Tastatur zurück ans Bett holen, ist gewonnene Menschlichkeit.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "KI in der Pflege",
    quote:
      "KI soll in der Pflege nicht ersetzen, sondern entlasten. Unsere Sprache-zu-SIS-Funktion macht aus einer Dokumentationslast von 90 Minuten eine Tätigkeit von 12 Minuten — bei höherer MDK-Qualität. Genau das ist der Unterschied zwischen Tech um der Tech willen und Tech, die Probleme löst.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "EU AI Act",
    quote:
      "CareAI ist Hochrisiko-KI im Gesundheitsbereich — und wir behandeln das nicht als Bürokratie-Last, sondern als Qualitätsmerkmal. Menschliche Aufsicht, Transparenz, Audit-Trails: das macht KI in der Pflege erst vertretbar.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "DSGVO & Datenhoheit",
    quote:
      "Pflege-Daten sind die sensibelsten Daten überhaupt. Unsere Server stehen in Falkenstein, Deutschland — nicht auf einem US-Hyperscaler. Wir haben uns bewusst gegen den bequemen Weg entschieden.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "Pflegegrade",
    quote:
      "Pflegegrade werden heute oft zu niedrig angesetzt, weil die Begutachtung auf Momentaufnahmen basiert. Mit CareAI-Dokumentation liegt erstmals eine vollständige Tages-Aktivitäts-Historie vor — das hilft Bewohner:innen und Angehörigen, den angemessenen Pflegegrad zu belegen.",
    speaker: "Maria Kreuzer",
    role: "Pflegedienstleitung Seniorenresidenz Hietzing (CareAI-Pilotkundin)",
  },
  {
    topic: "Demenz",
    quote:
      "Bei dementen Bewohner:innen entscheiden Kleinigkeiten: Stimmung, Schlafverhalten, Essensverweigerung. CareAI erkennt Muster, die der Schichtübergabe manchmal entgehen — und gibt der Pflegekraft einen strukturierten Hinweis, keinen Alarm-Spam.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "Pflegekräfte-Mangel",
    quote:
      "2030 fehlen allein in Deutschland 500.000 Pflegekräfte. Wir können das nicht über Zuwanderung allein lösen — wir müssen den Beruf wieder attraktiv machen. Weniger Papierkram ist der einfachste Hebel, den wir haben.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "Digitalisierung",
    quote:
      "Die Pflegebranche ist digital zehn Jahre hinter dem Einzelhandel. Das ist aber keine Schuld der Pflege — sondern Folge von Software, die wie 2005 aussieht und sich so bedienen lässt. Moderne, sprach-basierte Interfaces ändern das.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "Datenhoheit",
    quote:
      "Einrichtungen müssen ihre Daten jederzeit exportieren und wieder mitnehmen können. Lock-In ist bei kritischer Infrastruktur nicht akzeptabel. Unser Migrations-Tool funktioniert in beide Richtungen: rein und raus.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
  {
    topic: "Kostenexplosion",
    quote:
      "Die Pflegekasse-Beiträge steigen jedes Jahr — gleichzeitig werden die Einrichtungen schlechter besetzt. Wir können uns das System, das wir haben, nicht mehr leisten. Effizienz-Gewinne durch KI sind kein Nice-to-Have, sie sind überlebenswichtig.",
    speaker: "Konstantin Wagner",
    role: "CEO & Mitgründer, CareAI",
  },
];

export const factSheet: FactSection[] = [
  {
    title: "Unternehmen",
    rows: [
      { label: "Gegründet", value: "Oktober 2024" },
      { label: "Rechtsform", value: "CareAI GmbH (in Gründung / AT)" },
      { label: "Sitz", value: "Wien, Österreich" },
      { label: "Gründer:in", value: "Konstantin Wagner" },
      { label: "Mitarbeiter:innen", value: "Team 4 (Stand April 2026), 15+ geplant bis Ende 2026" },
      { label: "Finanzierung", value: "aws-Preseed, Bootstrapped" },
    ],
  },
  {
    title: "Mission",
    rows: [
      { label: "Slogan", value: `"Mehr Zeit am Bewohner."` },
      { label: "Ziel", value: "67 % weniger Dokumentationszeit in Pflege-Einrichtungen" },
      { label: "SDG", value: "SDG 3 (Gesundheit), SDG 5 (Geschlechtergerechtigkeit), SDG 8 (Würdige Arbeit), SDG 10 (Ungleichheit)" },
    ],
  },
  {
    title: "Markt & Zahlen",
    rows: [
      { label: "Zielgruppe", value: "Stationäre Pflege-Einrichtungen DACH (25–500 Plätze)" },
      { label: "DACH-Marktvolumen", value: "Ca. 14.000 Heime in DE/AT/CH, ~1,2 Mio Plätze" },
      { label: "Pflegekräfte-Mangel DE", value: "500.000 fehlend bis 2030 (Prognose BMG)" },
      { label: "Dokumentationsanteil Schicht", value: "Aktuell 30–40 % — CareAI-Ziel: <12 %" },
    ],
  },
  {
    title: "Produkt",
    rows: [
      { label: "Kern-Feature", value: "Spracheingabe → strukturierte SIS (Pflegedoku)" },
      { label: "Module", value: "SIS, Maßnahmenplan, Schichtbericht, Risiko-Scores, Angehörigen-Portal" },
      { label: "Plattformen", value: "Web, iPad, Android-Tablet, Kiosk-Terminals" },
      { label: "Integrationen", value: "Vivendi, Medifox, DAN, SenSo (Import); ELGA, FHIR (Export)" },
    ],
  },
  {
    title: "Compliance & Zertifizierungen",
    rows: [
      { label: "DSGVO", value: "Vollständig konform, AV-Vertrag, TOM-Konzept" },
      { label: "EU AI Act", value: "Hochrisiko-KI (Anhang III) — alle Pflichten erfüllt" },
      { label: "Hosting", value: "Hetzner Falkenstein (DE), keine Drittland-Datenübermittlung" },
      { label: "ISO 27001", value: "Zertifizierung in Vorbereitung (Audit Q3/2026)" },
      { label: "MDR", value: "Klasse I Medizinprodukt (Registrierung Q4/2026)" },
    ],
  },
  {
    title: "Kontakt Presse",
    rows: [
      { label: "E-Mail", value: "presse@careai.health" },
      { label: "Telefon", value: "+43 1 xxx xxxx (Pressetelefon Mo-Fr 9-17)" },
      { label: "Ansprechpartner", value: "Konstantin Wagner (CEO)" },
      { label: "Web", value: "careai.health/presse" },
    ],
  },
];
