// Vordefinierte Szenarien fuer schnelle Demos.

export interface SampleScenario {
  id: string;
  name: string;
  beschreibung: string;
  anzahl: number;
  seed: number;
  berichteTage: number;
  vitalTage: number;
  empfohlenFuer: string;
}

export const SZENARIEN: SampleScenario[] = [
  {
    id: "klein",
    name: "Kleines Heim",
    beschreibung: "30 Bewohner:innen, 60 Tage Berichte. Realistisch fuer eine kleine Pflege-WG oder Tagesstaette.",
    anzahl: 30, seed: 1001, berichteTage: 60, vitalTage: 30,
    empfohlenFuer: "Kleine Trägerschulungen, Solo-Demos.",
  },
  {
    id: "mittel",
    name: "Mittelständisch",
    beschreibung: "80 Bewohner:innen mit voller Historie. Standard-Pflegeheim Österreich/Süd-DE.",
    anzahl: 80, seed: 2002, berichteTage: 90, vitalTage: 30,
    empfohlenFuer: "Standard-Demos, Schulungen, Investor-Pitches.",
  },
  {
    id: "gross",
    name: "Grosses Heim",
    beschreibung: "200 Bewohner:innen, mehrere Stationen. Stresstest realistischer Größe.",
    anzahl: 200, seed: 3003, berichteTage: 90, vitalTage: 30,
    empfohlenFuer: "Performance-Tests, Multi-Station-Demos.",
  },
  {
    id: "demo-pitch",
    name: "Demo-Pitch (kuratiert)",
    beschreibung: "12 sorgfaeltig kuratierte Profile fuer Investoren-Pitches. Maximale Verständlichkeit.",
    anzahl: 12, seed: 7777, berichteTage: 30, vitalTage: 14,
    empfohlenFuer: "Investor-Pitches, Webinare, Erstkontakt.",
  },
  {
    id: "stress",
    name: "Stresstest 500",
    beschreibung: "500 Bewohner:innen, 90 Tage Berichte. Pruefung von Pagination, Tabellen, Suchindex.",
    anzahl: 500, seed: 9999, berichteTage: 90, vitalTage: 30,
    empfohlenFuer: "Performance-Audits, Last-Tests, QA.",
  },
];
