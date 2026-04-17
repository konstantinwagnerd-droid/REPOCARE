export type CaseStudy = {
  slug: string;
  facility: string;
  city: string;
  beds: number;
  tagline: string;
  summary: string;
  context: string;
  before: { label: string; value: string }[];
  after: { label: string; value: string }[];
  quotes: { name: string; role: string; text: string }[];
  tech: string[];
  rolloutWeeks: number;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "st-elisabeth-wien",
    facility: "Pflegeheim St. Elisabeth",
    city: "Wien",
    beds: 45,
    tagline: "Von 4 h auf 1,5 h Doku pro Schicht",
    summary:
      "Kleiner privater Traeger in Wien-Hietzing. Nach acht Wochen Pilot sank die durchschnittliche Dokumentationszeit pro Schicht um 62%.",
    context:
      "St. Elisabeth ist ein familiengefuehrtes Pflegeheim mit 45 Plaetzen. 18 Pflegekraefte, davon 12 DGKP, arbeiten in einem eingespielten Team. Vor CareAI wurde mit einer Kombination aus Senso und handschriftlichen Uebergabeheften dokumentiert. Die Geschaeftsfuehrung entschied sich fuer den Umstieg, weil die Fluktuation auf 18% gestiegen war — Hauptgrund laut Austrittsgespraechen: 'zu viel Papierkram'.",
    before: [
      { label: "Doku-Zeit pro Schicht", value: "4 h 10 min" },
      { label: "Handschriftliche Eintraege", value: "70%" },
      { label: "MD-Beanstandungen (12 Monate)", value: "3" },
      { label: "Fluktuation", value: "18%" },
    ],
    after: [
      { label: "Doku-Zeit pro Schicht", value: "1 h 30 min" },
      { label: "Handschriftliche Eintraege", value: "0%" },
      { label: "MD-Beanstandungen (6 Monate)", value: "0" },
      { label: "Fluktuation", value: "7%" },
    ],
    quotes: [
      {
        name: "Sabine Pichler",
        role: "Pflegedienstleitung",
        text: "Ich habe am Anfang nicht geglaubt, dass KI in der Pflege funktioniert. Nach der zweiten Woche habe ich es geglaubt. Nach dem zweiten Monat habe ich mich geaergert, nicht frueher gewechselt zu haben.",
      },
      {
        name: "Ahmed Karimov",
        role: "DGKP, Nachtschicht",
        text: "Spracheingabe versteht meinen Akzent besser als meine Kollegen. Klingt komisch — ist aber so.",
      },
      {
        name: "Maria Ebner",
        role: "Geschaeftsfuehrung",
        text: "Wir haben in den ersten sechs Monaten mehr als 54.000 EUR eingespart. Aber der eigentliche Gewinn ist, dass zwei Mitarbeiterinnen von Kuendigung zurueckgetreten sind.",
      },
    ],
    tech: ["Spracheingabe DE + AT-Dialekte", "SIS-Automatik", "MD-Export", "ELGA-Anbindung"],
    rolloutWeeks: 3,
  },
  {
    slug: "seniorenzentrum-graz-sued",
    facility: "Seniorenzentrum Graz-Sued",
    city: "Graz",
    beds: 120,
    tagline: "MD-Pruefung: 0 Beanstandungen",
    summary:
      "Mittelgrosses Haus der Diakonie. Nach der Einfuehrung verlief die MD-Qualitaetspruefung ohne einzige Beanstandung — erstmals in 12 Jahren.",
    context:
      "Das Seniorenzentrum Graz-Sued gehoert zur Diakonie Steiermark. 120 Betten, 48 Mitarbeitende, zwei Wohnbereiche mit Schwerpunkt Demenz. Die MD-Pruefung 2025 hatte sieben Beanstandungen ergeben — hauptsaechlich Luecken in der Dokumentation von Risiko-Assessments. CareAI wurde gezielt fuer die luecklosen SIS-Eintraege und das Audit-Log eingefuehrt.",
    before: [
      { label: "MD-Beanstandungen 2025", value: "7" },
      { label: "Zeit fuer MD-Vorbereitung", value: "180 h" },
      { label: "Unvollstaendige SIS", value: "23%" },
    ],
    after: [
      { label: "MD-Beanstandungen 2026", value: "0" },
      { label: "Zeit fuer MD-Vorbereitung", value: "12 h" },
      { label: "Unvollstaendige SIS", value: "0%" },
    ],
    quotes: [
      {
        name: "Dr. Hans Meinrad",
        role: "Heimleitung",
        text: "Der MD-Pruefer hat wortwoertlich gesagt: 'So etwas habe ich noch nie gesehen.' Das war fuer uns der Beweis, dass die Investition richtig war.",
      },
      {
        name: "Eva Kogler",
        role: "Qualitaetsbeauftragte",
        text: "Die Audit-Logs sind Gold wert. Wenn der MD fragt 'Warum diese Massnahme?' — ein Klick, und ich habe die komplette Entscheidungshistorie.",
      },
      {
        name: "Jozef Novak",
        role: "DGKP",
        text: "Ich schreibe nicht mehr am Computer. Ich spreche. Das ist, was Pflegekraefte wollten, seit es Computer in der Pflege gibt.",
      },
    ],
    tech: ["Risiko-Matrix R1–R7", "Audit-Log revisionsfest", "Rollen-Governance"],
    rolloutWeeks: 4,
  },
  {
    slug: "maximilianheim-muenchen",
    facility: "Maximilianheim Muenchen",
    city: "Muenchen",
    beds: 280,
    tagline: "100% Vivendi-Umstieg in 6 Wochen",
    summary:
      "Grosser Traeger, kompletter Umstieg von Vivendi auf CareAI inklusive Historien-Migration. Keine Downtime, keine Datenverluste.",
    context:
      "Das Maximilianheim ist mit 280 Plaetzen einer der groessten Pflegeheime Suedbayerns. Vivendi war seit 2009 im Einsatz — mit allen bekannten Problemen: schwerfaellige UI, keine mobile Nutzung, 12.000 EUR jaehrliche Lizenzkosten. Nach einer strukturierten Ausschreibung fiel die Entscheidung zugunsten CareAI — entscheidend war die zugesicherte Full-Migration der Historien-Daten.",
    before: [
      { label: "Softwarekosten / Jahr", value: "12.000 EUR" },
      { label: "Doku am Tablet", value: "0%" },
      { label: "Burnout-Krankenstand", value: "12%" },
    ],
    after: [
      { label: "Softwarekosten / Jahr", value: "11.988 EUR" },
      { label: "Doku am Tablet", value: "82%" },
      { label: "Burnout-Krankenstand", value: "5%" },
    ],
    quotes: [
      {
        name: "Dr. Franziska Huber",
        role: "Geschaeftsfuehrung",
        text: "Die Migration war chirurgisch praezise. Wir hatten Angst vor einem Daten-GAU — und bekamen stattdessen einen Donnerstag-Abend-Switch ohne eine einzige Support-Anfrage.",
      },
      {
        name: "Klaus Berger",
        role: "IT-Leitung",
        text: "Die API-Dokumentation ist auf einem Niveau, das ich nur aus dem Silicon Valley kenne. Das ist in der Pflege-Branche leider die Ausnahme.",
      },
      {
        name: "Fatima Yildiz",
        role: "Stellv. Pflegedienstleitung",
        text: "Unsere Azubis lernen CareAI in zwei Tagen. Vivendi hat drei Wochen gebraucht. Das hat Auswirkungen auf unser komplettes Einarbeitungs-Konzept.",
      },
    ],
    tech: ["Vivendi-Migration", "SSO / SAML", "On-Premise-Option", "Custom KI-Modelle"],
    rolloutWeeks: 6,
  },
];

export const caseStudyMap = Object.fromEntries(caseStudies.map((c) => [c.slug, c]));
