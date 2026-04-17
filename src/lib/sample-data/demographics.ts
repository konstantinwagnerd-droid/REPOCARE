// Realistische Verteilungen fuer ein durchschnittliches oesterreichisches/
// deutsches Pflegeheim. Basis: Statistik Austria 2024 + Pflegestatistik DE.

import type { Pflegegrad, Geschlecht } from "./types";

// Alter: Schwerpunkt 80-95, Median ~85
export const ALTER_VERTEILUNG: { range: [number, number]; gewicht: number }[] = [
  [[65, 74], 0.07],
  [[75, 79], 0.13],
  [[80, 84], 0.24],
  [[85, 89], 0.30],
  [[90, 94], 0.18],
  [[95, 100], 0.07],
  [[101, 105], 0.01],
].map(([r, g]) => ({ range: r as [number, number], gewicht: g as number }));

// PG-Verteilung (gewichtet zu PG3/4 — typischer Heim-Cut)
export const PG_VERTEILUNG: { pg: Pflegegrad; gewicht: number }[] = [
  { pg: 1, gewicht: 0.04 },
  { pg: 2, gewicht: 0.18 },
  { pg: 3, gewicht: 0.32 },
  { pg: 4, gewicht: 0.31 },
  { pg: 5, gewicht: 0.15 },
];

// Geschlechter-Verteilung (~70% weiblich in dieser Altersgruppe)
export const GESCHLECHT_VERTEILUNG: { geschlecht: Geschlecht; gewicht: number }[] = [
  { geschlecht: "weiblich", gewicht: 0.70 },
  { geschlecht: "maennlich", gewicht: 0.295 },
  { geschlecht: "divers", gewicht: 0.005 },
];

export const KONFESSIONEN = [
  { wert: "roemisch-katholisch", gewicht: 0.55 },
  { wert: "evangelisch", gewicht: 0.18 },
  { wert: "konfessionslos", gewicht: 0.20 },
  { wert: "orthodox", gewicht: 0.04 },
  { wert: "islamisch", gewicht: 0.03 },
];

export const HERKUNFT = [
  { wert: "Oesterreich", gewicht: 0.62 },
  { wert: "Deutschland", gewicht: 0.20 },
  { wert: "Ungarn", gewicht: 0.04 },
  { wert: "Polen", gewicht: 0.04 },
  { wert: "Tschechien", gewicht: 0.03 },
  { wert: "Tuerkei", gewicht: 0.03 },
  { wert: "Bosnien", gewicht: 0.02 },
  { wert: "Kroatien", gewicht: 0.02 },
];
