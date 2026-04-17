import type { Template, TemplateId } from "./types";

const boilerplateDefault =
  "CareAI ist eine KI-gestützte Pflegedokumentationsplattform für den DACH-Raum. Sie entlastet Pflegekräfte durch Spracheingabe, SIS-Strukturierung und MDK-konforme Auswertungen. Hosting in der EU, DSGVO-konform.";

const contactDefault =
  "Konstantin Wagner · presse@careai.at · +43 660 000 0000 · https://careai.at/presse";

/** Gemeinsame Felder, die fast jede PM braucht. */
const commonFields = [
  {
    key: "dateline",
    label: "Datum",
    type: "date" as const,
    required: true,
    help: "Veröffentlichungsdatum, ISO-Format (YYYY-MM-DD).",
  },
  {
    key: "location",
    label: "Ort",
    type: "text" as const,
    placeholder: "Wien",
    required: true,
  },
  {
    key: "quote",
    label: "Zitat",
    type: "quote" as const,
    help: "Ein echtes, persönliches Zitat — nicht generisch. Max. 2 Sätze.",
    required: true,
  },
  {
    key: "quoteAuthor",
    label: "Zitat-Autor:in (Name + Rolle)",
    type: "text" as const,
    placeholder: "Konstantin Wagner, Gründer & CEO",
    required: true,
  },
  {
    key: "boilerplate",
    label: "Boilerplate (Über CareAI)",
    type: "textarea" as const,
    required: true,
  },
  {
    key: "contact",
    label: "Pressekontakt",
    type: "textarea" as const,
    required: true,
  },
];

export const templates: Record<TemplateId, Template> = {
  milestone: {
    id: "milestone",
    title: "Meilenstein-PM",
    description:
      "Für Produkt-Meilensteine, Zertifizierungen, Kund:innen-Schwellen, Nutzerzahlen.",
    defaultHeadline: "CareAI erreicht {{milestone}}",
    fields: [
      {
        key: "milestone",
        label: "Meilenstein (kurz)",
        type: "text",
        placeholder: "1.000 Pflegekräfte im Echtbetrieb",
        required: true,
      },
      {
        key: "context",
        label: "Kontext",
        type: "textarea",
        help: "Warum ist dieser Meilenstein relevant? 2–4 Sätze.",
        required: true,
      },
      {
        key: "numbers",
        label: "Zahlen & Fakten (Bulletpoints)",
        type: "textarea",
        placeholder:
          "- 1.000 aktive Pflegekräfte\n- 28 Einrichtungen in DACH\n- 43 % Zeitersparnis in Dokumentation",
        required: true,
      },
      {
        key: "outlook",
        label: "Ausblick",
        type: "textarea",
        help: "Nächste Schritte, 2–3 Sätze.",
      },
      ...commonFields,
    ],
    body: `# {{headline}}

**{{location}}, {{dateline}}** — {{context}}

## Zahlen und Fakten

{{numbers}}

> "{{quote}}"
> — {{quoteAuthor}}

## Ausblick

{{outlook}}

## Über CareAI

{{boilerplate}}

## Pressekontakt

{{contact}}
`,
  },

  funding: {
    id: "funding",
    title: "Funding-PM",
    description:
      "Für Seed-/Serie-A-Runden, Förderungen (FFG, aws, EXIST, ZIM), Wandeldarlehen.",
    defaultHeadline: "CareAI sichert sich {{amount}} {{fundingType}}",
    fields: [
      {
        key: "amount",
        label: "Betrag (z. B. 1,2 Mio. €)",
        type: "text",
        required: true,
      },
      {
        key: "fundingType",
        label: "Art der Finanzierung",
        type: "text",
        placeholder: "Seed-Finanzierung",
        required: true,
      },
      {
        key: "investors",
        label: "Investor:innen / Förder-Geber",
        type: "textarea",
        placeholder:
          "Lead: xyz Ventures\nweitere: abc Capital, Business Angels",
        required: true,
      },
      {
        key: "useOfFunds",
        label: "Mittelverwendung (3 Stichpunkte)",
        type: "textarea",
        placeholder:
          "- Produkt-Team auf 12 Köpfe ausbauen\n- Expansion nach Deutschland\n- DiGA-Zertifizierung",
        required: true,
      },
      {
        key: "traction",
        label: "Traction (aktuelle Kennzahlen)",
        type: "textarea",
      },
      ...commonFields,
    ],
    body: `# {{headline}}

**{{location}}, {{dateline}}** — Das Wiener HealthTech-Start-up CareAI gibt heute den Abschluss einer {{fundingType}} in Höhe von **{{amount}}** bekannt.

## Investor:innen

{{investors}}

## Mittelverwendung

{{useOfFunds}}

## Aktuelle Traction

{{traction}}

> "{{quote}}"
> — {{quoteAuthor}}

## Über CareAI

{{boilerplate}}

## Pressekontakt

{{contact}}
`,
  },

  partner: {
    id: "partner",
    title: "Partner-PM",
    description:
      "Für Kooperationen, Integrationen, Wiederverkaufspartnerschaften, Klinik-Pilotprojekte.",
    defaultHeadline: "CareAI und {{partnerName}} starten Partnerschaft",
    fields: [
      {
        key: "partnerName",
        label: "Partner-Name",
        type: "text",
        required: true,
      },
      {
        key: "partnerDescription",
        label: "Kurzbeschreibung Partner",
        type: "textarea",
        required: true,
      },
      {
        key: "scope",
        label: "Umfang der Partnerschaft",
        type: "textarea",
        help: "Was macht ihr gemeinsam? 3–5 Sätze.",
        required: true,
      },
      {
        key: "benefits",
        label: "Kund:innen-Nutzen (Bulletpoints)",
        type: "textarea",
        required: true,
      },
      ...commonFields,
    ],
    body: `# {{headline}}

**{{location}}, {{dateline}}** — CareAI und {{partnerName}} geben heute eine strategische Partnerschaft bekannt.

## Über {{partnerName}}

{{partnerDescription}}

## Umfang

{{scope}}

## Nutzen für Kund:innen

{{benefits}}

> "{{quote}}"
> — {{quoteAuthor}}

## Über CareAI

{{boilerplate}}

## Pressekontakt

{{contact}}
`,
  },

  product: {
    id: "product",
    title: "Produkt-Launch-PM",
    description:
      "Für neue Produkte, Major-Releases, Feature-Launches mit Marktrelevanz.",
    defaultHeadline: "CareAI launcht {{productName}}",
    fields: [
      {
        key: "productName",
        label: "Produkt- / Feature-Name",
        type: "text",
        required: true,
      },
      {
        key: "tagline",
        label: "Einzeiler (Value Prop)",
        type: "text",
        required: true,
      },
      {
        key: "problem",
        label: "Welches Problem löst es?",
        type: "textarea",
        required: true,
      },
      {
        key: "how",
        label: "Wie funktioniert es?",
        type: "textarea",
        required: true,
      },
      {
        key: "availability",
        label: "Verfügbarkeit",
        type: "text",
        placeholder: "Ab sofort für alle Bestandskund:innen verfügbar.",
        required: true,
      },
      ...commonFields,
    ],
    body: `# {{headline}}

**{{location}}, {{dateline}}** — {{tagline}}

## Das Problem

{{problem}}

## Die Lösung

{{how}}

## Verfügbarkeit

{{availability}}

> "{{quote}}"
> — {{quoteAuthor}}

## Über CareAI

{{boilerplate}}

## Pressekontakt

{{contact}}
`,
  },

  event: {
    id: "event",
    title: "Event-PM",
    description:
      "Für Messen, Kongresse, Webinare, Awards, öffentliche Auftritte.",
    defaultHeadline: "CareAI auf {{eventName}}",
    fields: [
      {
        key: "eventName",
        label: "Event-Name",
        type: "text",
        required: true,
      },
      {
        key: "eventDate",
        label: "Event-Datum / Zeitraum",
        type: "text",
        required: true,
      },
      {
        key: "eventLocation",
        label: "Event-Ort",
        type: "text",
        required: true,
      },
      {
        key: "topic",
        label: "CareAIs Beitrag / Thema",
        type: "textarea",
        required: true,
      },
      {
        key: "invitation",
        label: "Einladung / Call-to-Action",
        type: "textarea",
        placeholder:
          "Medienvertreter:innen können sich unter presse@careai.at akkreditieren.",
        required: true,
      },
      ...commonFields,
    ],
    body: `# {{headline}}

**{{location}}, {{dateline}}** — CareAI ist vom **{{eventDate}}** auf der **{{eventName}}** in {{eventLocation}} vertreten.

## CareAIs Beitrag

{{topic}}

> "{{quote}}"
> — {{quoteAuthor}}

## Einladung

{{invitation}}

## Über CareAI

{{boilerplate}}

## Pressekontakt

{{contact}}
`,
  },
};

export const defaultBoilerplate = boilerplateDefault;
export const defaultContact = contactDefault;

export function getTemplate(id: TemplateId): Template {
  return templates[id];
}

export function listTemplates(): Template[] {
  return Object.values(templates);
}
