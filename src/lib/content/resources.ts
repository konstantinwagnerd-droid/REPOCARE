export type ResourceKind = "whitepaper" | "webinar" | "template";

export type Resource = {
  slug: string;
  kind: ResourceKind;
  title: string;
  description: string;
  pages?: number;
  duration?: string;
  topic: string;
  leadGate?: boolean;
};

export const RESOURCES: Resource[] = [
  // Whitepaper
  {
    slug: "leitfaden-sis",
    kind: "whitepaper",
    title: "Der ultimative Leitfaden zur SIS",
    description:
      "20 Seiten Praxiswissen zur Strukturierten Informationssammlung: sechs Themenfelder, typische Fehler, Schulungs-Fahrplan.",
    pages: 20,
    topic: "Dokumentation",
    leadGate: true,
  },
  {
    slug: "eu-ai-act-compliance",
    kind: "whitepaper",
    title: "EU AI Act-Compliance fuer Pflegeheime",
    description:
      "15 Seiten zu Risikoklassen, Uebergangsfristen und konkreten Massnahmen fuer Einrichtungen als Deployer.",
    pages: 15,
    topic: "Recht",
    leadGate: true,
  },
  {
    slug: "md-pruefung-kit",
    kind: "whitepaper",
    title: "MD-Pruefung Vorbereitungs-Kit",
    description:
      "10-Schritte-Checkliste, Muster-Dokumente, Beanstandungs-Heatmap der letzten 3 Jahre.",
    pages: 18,
    topic: "Qualitaet",
    leadGate: true,
  },
  {
    slug: "roi-digitalisierung",
    kind: "whitepaper",
    title: "ROI-Case: Digitalisierung der Pflegedokumentation",
    description:
      "Wirtschaftliche Auswertung unserer 12 Pilot-Einrichtungen: Investition, Break-Even, 3-Jahres-ROI.",
    pages: 12,
    topic: "Wirtschaft",
    leadGate: true,
  },

  // Webinare (Aufzeichnungen)
  {
    slug: "webinar-sis-refresher",
    kind: "webinar",
    title: "Webinar: SIS-Refresher fuer PDLs",
    description:
      "90 Minuten mit Dr. Julia Lenhart. Typische Fehler, wirksame Refresher-Modelle, Q&A.",
    duration: "90 Min.",
    topic: "Dokumentation",
  },
  {
    slug: "webinar-ai-act",
    kind: "webinar",
    title: "Webinar: EU AI Act in der Pflege — kein Grund zur Panik",
    description:
      "60 Minuten mit Fatima Al-Khatib. Risikoklassen, Pflichten als Deployer, konkrete Pruefliste.",
    duration: "60 Min.",
    topic: "Recht",
  },
  {
    slug: "webinar-qi-strategie",
    kind: "webinar",
    title: "Webinar: QI als Steuerungs-Instrument",
    description:
      "75 Minuten zur Frage: Wie wird aus QI-Daten echte Qualitaetsentwicklung?",
    duration: "75 Min.",
    topic: "Qualitaet",
  },

  // Vorlagen
  {
    slug: "vorlage-av-vertrag",
    kind: "template",
    title: "AV-Vertrag-Vorlage (Art. 28 DSGVO)",
    description:
      "Vollstaendige Vorlage mit allen Mindestpunkten. Anpassbar in Word.",
    topic: "Recht",
  },
  {
    slug: "vorlage-dsfa",
    kind: "template",
    title: "DSFA-Template fuer KI-Systeme",
    description:
      "Strukturierte Vorlage fuer die Datenschutz-Folgenabschaetzung nach Art. 35 DSGVO, mit KI-Fokus.",
    topic: "Recht",
  },
  {
    slug: "vorlage-foto-einwilligung",
    kind: "template",
    title: "Einwilligungs-Formular Foto/Video",
    description:
      "Granulare Einwilligung fuer Angehoerigen-Portal, oeffentliche Veroeffentlichungen, interne Dokumentation.",
    topic: "Recht",
  },
  {
    slug: "vorlage-dienstplan",
    kind: "template",
    title: "Dienstplan-Vorlage",
    description:
      "Excel-basierte Vorlage mit Fachkraftquote, Wunschfrei-Logik, Urlaubsabgleich.",
    topic: "Organisation",
  },
  {
    slug: "vorlage-uebergabe-checkliste",
    kind: "template",
    title: "Uebergabe-Checkliste (ISBAR)",
    description:
      "Strukturierte Schichtuebergabe — Introduction, Situation, Background, Assessment, Recommendation.",
    topic: "Praxis",
  },
  {
    slug: "vorlage-patientenverfuegung",
    kind: "template",
    title: "Patientenverfuegungs-Formular",
    description:
      "Vorlage kompatibel mit § 1901a BGB (DE) und Patientenverfuegungsgesetz (AT).",
    topic: "Recht",
  },
];

export function getAllResources(): Resource[] {
  return RESOURCES;
}

export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function getResourcesByKind(kind: ResourceKind): Resource[] {
  return RESOURCES.filter((r) => r.kind === kind);
}
