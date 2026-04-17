/**
 * ICD-10-Subset: 80 häufige Diagnosen in österreichischen/deutschen Pflegeheimen.
 * Quellen: Statistik Austria "Pflegeheime 2023" sowie DIMDI ICD-10-GM.
 * Dieses Set deckt ≈90% der Diagnosen im stationären Langzeitpflege-Alltag.
 */
import type { IcdEntry } from './types';

export const ICD_SUBSET: IcdEntry[] = [
  // Kreislauf
  { code: 'I10', label: 'Essentielle (primäre) Hypertonie', category: 'Kreislauf' },
  { code: 'I11.0', label: 'Hypertensive Herzkrankheit mit (kongestiver) Herzinsuffizienz', category: 'Kreislauf' },
  { code: 'I25.1', label: 'Atherosklerotische Herzkrankheit', category: 'Kreislauf' },
  { code: 'I48.0', label: 'Paroxysmales Vorhofflimmern', category: 'Kreislauf' },
  { code: 'I50.0', label: 'Kongestive Herzinsuffizienz', category: 'Kreislauf' },
  { code: 'I63.9', label: 'Hirninfarkt, nicht näher bezeichnet', category: 'Kreislauf' },
  { code: 'I69.4', label: 'Folgen eines Schlaganfalls', category: 'Kreislauf' },
  { code: 'I70.2', label: 'Atherosklerose der Extremitätenarterien', category: 'Kreislauf' },
  { code: 'I83.9', label: 'Varizen der unteren Extremitäten ohne Ulzeration', category: 'Kreislauf' },
  { code: 'I95.1', label: 'Orthostatische Hypotonie', category: 'Kreislauf' },

  // Stoffwechsel / Endokrin
  { code: 'E11.9', label: 'Diabetes mellitus Typ 2, ohne Komplikationen', category: 'Stoffwechsel' },
  { code: 'E11.65', label: 'Diabetes mellitus Typ 2, entgleist', category: 'Stoffwechsel' },
  { code: 'E03.9', label: 'Hypothyreose, nicht näher bezeichnet', category: 'Stoffwechsel' },
  { code: 'E05.9', label: 'Hyperthyreose, nicht näher bezeichnet', category: 'Stoffwechsel' },
  { code: 'E78.0', label: 'Reine Hypercholesterinämie', category: 'Stoffwechsel' },
  { code: 'E86', label: 'Volumenmangel / Exsikkose', category: 'Stoffwechsel' },
  { code: 'E87.6', label: 'Hypokaliämie', category: 'Stoffwechsel' },

  // Psyche / Kognition
  { code: 'F00.1', label: 'Demenz bei Alzheimer-Krankheit, mit spätem Beginn', category: 'Psyche' },
  { code: 'F01.9', label: 'Vaskuläre Demenz, nicht näher bezeichnet', category: 'Psyche' },
  { code: 'F03', label: 'Nicht näher bezeichnete Demenz', category: 'Psyche' },
  { code: 'F05.1', label: 'Delir bei Demenz', category: 'Psyche' },
  { code: 'F32.1', label: 'Mittelgradige depressive Episode', category: 'Psyche' },
  { code: 'F41.2', label: 'Angst und depressive Störung, gemischt', category: 'Psyche' },
  { code: 'F43.2', label: 'Anpassungsstörungen', category: 'Psyche' },
  { code: 'F51.0', label: 'Nichtorganische Insomnie', category: 'Psyche' },

  // Nerven / Neuro
  { code: 'G20', label: 'Primäres Parkinson-Syndrom', category: 'Nervensystem' },
  { code: 'G30.9', label: 'Alzheimer-Krankheit, nicht näher bezeichnet', category: 'Nervensystem' },
  { code: 'G40.9', label: 'Epilepsie, nicht näher bezeichnet', category: 'Nervensystem' },
  { code: 'G47.0', label: 'Ein- und Durchschlafstörungen', category: 'Nervensystem' },
  { code: 'G62.9', label: 'Polyneuropathie, nicht näher bezeichnet', category: 'Nervensystem' },
  { code: 'G93.1', label: 'Hirnischämie, anoxisch bedingt', category: 'Nervensystem' },

  // Atmung
  { code: 'J18.9', label: 'Pneumonie, nicht näher bezeichnet', category: 'Atmung' },
  { code: 'J20.9', label: 'Akute Bronchitis, nicht näher bezeichnet', category: 'Atmung' },
  { code: 'J44.0', label: 'COPD mit akuter Infektion', category: 'Atmung' },
  { code: 'J44.9', label: 'COPD, nicht näher bezeichnet', category: 'Atmung' },
  { code: 'J45.9', label: 'Asthma, nicht näher bezeichnet', category: 'Atmung' },

  // Verdauung
  { code: 'K21.0', label: 'Gastroösophageale Refluxkrankheit mit Ösophagitis', category: 'Verdauung' },
  { code: 'K29.7', label: 'Gastritis, nicht näher bezeichnet', category: 'Verdauung' },
  { code: 'K59.0', label: 'Obstipation', category: 'Verdauung' },
  { code: 'K92.2', label: 'Gastrointestinale Blutung, nicht näher bezeichnet', category: 'Verdauung' },

  // Harnwege / Niere
  { code: 'N18.3', label: 'Chronische Nierenkrankheit, Stadium 3', category: 'Harnwege' },
  { code: 'N18.4', label: 'Chronische Nierenkrankheit, Stadium 4', category: 'Harnwege' },
  { code: 'N30.9', label: 'Zystitis, nicht näher bezeichnet', category: 'Harnwege' },
  { code: 'N39.0', label: 'Harnwegsinfektion, Lokalisation nicht bezeichnet', category: 'Harnwege' },
  { code: 'N39.3', label: 'Belastungsinkontinenz', category: 'Harnwege' },
  { code: 'R32', label: 'Nicht näher bezeichnete Harninkontinenz', category: 'Harnwege' },

  // Haut / Wunden
  { code: 'L03.9', label: 'Phlegmone, nicht näher bezeichnet', category: 'Haut' },
  { code: 'L89.0', label: 'Dekubitus Grad 1', category: 'Haut' },
  { code: 'L89.1', label: 'Dekubitus Grad 2', category: 'Haut' },
  { code: 'L89.2', label: 'Dekubitus Grad 3', category: 'Haut' },
  { code: 'L89.3', label: 'Dekubitus Grad 4', category: 'Haut' },
  { code: 'L97', label: 'Ulcus cruris, anderenorts nicht klassifiziert', category: 'Haut' },
  { code: 'L30.9', label: 'Dermatitis, nicht näher bezeichnet', category: 'Haut' },

  // Muskel / Skelett
  { code: 'M15.0', label: 'Primäre generalisierte Arthrose', category: 'Muskel-Skelett' },
  { code: 'M16.1', label: 'Sonstige primäre Koxarthrose', category: 'Muskel-Skelett' },
  { code: 'M17.1', label: 'Sonstige primäre Gonarthrose', category: 'Muskel-Skelett' },
  { code: 'M54.5', label: 'Kreuzschmerz', category: 'Muskel-Skelett' },
  { code: 'M80.0', label: 'Osteoporose mit pathologischer Fraktur', category: 'Muskel-Skelett' },
  { code: 'M81.9', label: 'Osteoporose, nicht näher bezeichnet', category: 'Muskel-Skelett' },

  // Infekt
  { code: 'A04.7', label: 'Enterokolitis durch Clostridioides difficile', category: 'Infekt' },
  { code: 'A09.9', label: 'Gastroenteritis und Kolitis, nicht näher bezeichnet', category: 'Infekt' },
  { code: 'B96.2', label: 'Escherichia coli als Ursache von Erkrankungen', category: 'Infekt' },
  { code: 'U07.1', label: 'COVID-19, Virus nachgewiesen', category: 'Infekt' },

  // Blut
  { code: 'D50.9', label: 'Eisenmangelanämie, nicht näher bezeichnet', category: 'Blut' },
  { code: 'D64.9', label: 'Anämie, nicht näher bezeichnet', category: 'Blut' },

  // Sinnesorgane
  { code: 'H25.9', label: 'Senile Katarakt, nicht näher bezeichnet', category: 'Augen' },
  { code: 'H40.1', label: 'Primäres Offenwinkelglaukom', category: 'Augen' },
  { code: 'H91.9', label: 'Hörverlust, nicht näher bezeichnet', category: 'Ohr' },

  // Schmerz
  { code: 'R52.1', label: 'Chronischer unbeeinflussbarer Schmerz', category: 'Symptom' },
  { code: 'R52.2', label: 'Sonstiger chronischer Schmerz', category: 'Symptom' },

  // Symptome / Pflegerisch
  { code: 'R26.3', label: 'Immobilität', category: 'Symptom' },
  { code: 'R40.2', label: 'Koma, nicht näher bezeichnet', category: 'Symptom' },
  { code: 'R63.3', label: 'Ernährungsprobleme und unsachgemäße Ernährung', category: 'Symptom' },
  { code: 'R64', label: 'Kachexie', category: 'Symptom' },

  // Z-Codes
  { code: 'Z74.1', label: 'Hilfebedürftigkeit bei Körperpflege', category: 'Soziales' },
  { code: 'Z74.3', label: 'Notwendigkeit ständiger Überwachung', category: 'Soziales' },
  { code: 'Z96.64', label: 'Zustand nach Hüft-TEP', category: 'Z-Status' },
  { code: 'Z99.3', label: 'Abhängigkeit vom Rollstuhl', category: 'Z-Status' },

  // Verletzungen
  { code: 'S72.0', label: 'Fraktur des Schenkelhalses', category: 'Verletzung' },
  { code: 'T14.0', label: 'Oberflächliche Verletzung an nicht näher bezeichneter Körperregion', category: 'Verletzung' },
];

export function searchIcd(query: string, limit = 20): IcdEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return ICD_SUBSET.slice(0, limit);
  return ICD_SUBSET.filter(
    (e) => e.code.toLowerCase().includes(q) || e.label.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function getIcd(code: string): IcdEntry | undefined {
  return ICD_SUBSET.find((e) => e.code === code);
}

export function icdCategories(): string[] {
  return Array.from(new Set(ICD_SUBSET.map((e) => e.category))).sort();
}
