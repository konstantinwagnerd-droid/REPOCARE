// 50 typische Pflegeheim-Diagnosen mit relativen Haeufigkeiten.
// Quelle: Heimaerztestatistik, ICD-10-Hauptkapitel adaptiert.

export interface DiagnoseEintrag {
  bezeichnung: string;
  icd10: string;
  haeufigkeit: number; // Anteil der Bewohner mit dieser Diagnose
  kategorie: "neurologisch" | "kardiovaskulaer" | "psychisch" | "endokrin" | "muskuloskelettal" | "uro" | "respiratorisch" | "sonstiges";
}

export const DIAGNOSEN: DiagnoseEintrag[] = [
  // Neurologisch
  { bezeichnung: "Demenz vom Alzheimer-Typ", icd10: "F00.9", haeufigkeit: 0.42, kategorie: "neurologisch" },
  { bezeichnung: "Vaskulaere Demenz", icd10: "F01.9", haeufigkeit: 0.18, kategorie: "neurologisch" },
  { bezeichnung: "Morbus Parkinson", icd10: "G20", haeufigkeit: 0.12, kategorie: "neurologisch" },
  { bezeichnung: "Apoplex (Z.n.)", icd10: "I69.4", haeufigkeit: 0.20, kategorie: "neurologisch" },
  { bezeichnung: "Polyneuropathie", icd10: "G62.9", haeufigkeit: 0.14, kategorie: "neurologisch" },
  { bezeichnung: "Epilepsie", icd10: "G40.9", haeufigkeit: 0.05, kategorie: "neurologisch" },
  { bezeichnung: "Restless-Legs-Syndrom", icd10: "G25.81", haeufigkeit: 0.08, kategorie: "neurologisch" },

  // Kardiovaskulaer
  { bezeichnung: "Arterielle Hypertonie", icd10: "I10", haeufigkeit: 0.68, kategorie: "kardiovaskulaer" },
  { bezeichnung: "Vorhofflimmern", icd10: "I48.9", haeufigkeit: 0.32, kategorie: "kardiovaskulaer" },
  { bezeichnung: "Herzinsuffizienz NYHA II-III", icd10: "I50.13", haeufigkeit: 0.30, kategorie: "kardiovaskulaer" },
  { bezeichnung: "Koronare Herzkrankheit", icd10: "I25.9", haeufigkeit: 0.28, kategorie: "kardiovaskulaer" },
  { bezeichnung: "PAVK", icd10: "I73.9", haeufigkeit: 0.15, kategorie: "kardiovaskulaer" },
  { bezeichnung: "Z.n. Myokardinfarkt", icd10: "I25.2", haeufigkeit: 0.10, kategorie: "kardiovaskulaer" },
  { bezeichnung: "Chronisch venoese Insuffizienz", icd10: "I87.2", haeufigkeit: 0.22, kategorie: "kardiovaskulaer" },

  // Psychisch
  { bezeichnung: "Depression", icd10: "F32.9", haeufigkeit: 0.35, kategorie: "psychisch" },
  { bezeichnung: "Angststoerung", icd10: "F41.9", haeufigkeit: 0.15, kategorie: "psychisch" },
  { bezeichnung: "Schlafstoerung", icd10: "G47.9", haeufigkeit: 0.40, kategorie: "psychisch" },
  { bezeichnung: "Anpassungsstoerung", icd10: "F43.2", haeufigkeit: 0.10, kategorie: "psychisch" },
  { bezeichnung: "Z.n. Suchterkrankung Alkohol", icd10: "F10.20", haeufigkeit: 0.06, kategorie: "psychisch" },

  // Endokrin
  { bezeichnung: "Diabetes mellitus Typ 2", icd10: "E11.9", haeufigkeit: 0.34, kategorie: "endokrin" },
  { bezeichnung: "Hypothyreose", icd10: "E03.9", haeufigkeit: 0.18, kategorie: "endokrin" },
  { bezeichnung: "Hyperthyreose", icd10: "E05.9", haeufigkeit: 0.04, kategorie: "endokrin" },
  { bezeichnung: "Adipositas", icd10: "E66.9", haeufigkeit: 0.12, kategorie: "endokrin" },
  { bezeichnung: "Mangelernaehrung", icd10: "E46", haeufigkeit: 0.18, kategorie: "endokrin" },
  { bezeichnung: "Vitamin-D-Mangel", icd10: "E55.9", haeufigkeit: 0.45, kategorie: "endokrin" },

  // Muskuloskelettal
  { bezeichnung: "Coxarthrose beidseits", icd10: "M16.0", haeufigkeit: 0.30, kategorie: "muskuloskelettal" },
  { bezeichnung: "Gonarthrose", icd10: "M17.9", haeufigkeit: 0.32, kategorie: "muskuloskelettal" },
  { bezeichnung: "Osteoporose", icd10: "M81.9", haeufigkeit: 0.40, kategorie: "muskuloskelettal" },
  { bezeichnung: "Z.n. Schenkelhalsfraktur", icd10: "S72.0", haeufigkeit: 0.18, kategorie: "muskuloskelettal" },
  { bezeichnung: "Lumbalgie chronisch", icd10: "M54.5", haeufigkeit: 0.22, kategorie: "muskuloskelettal" },
  { bezeichnung: "Rheumatoide Arthritis", icd10: "M06.9", haeufigkeit: 0.06, kategorie: "muskuloskelettal" },
  { bezeichnung: "Sarkopenie", icd10: "M62.50", haeufigkeit: 0.28, kategorie: "muskuloskelettal" },

  // Urogenital
  { bezeichnung: "Harninkontinenz", icd10: "R32", haeufigkeit: 0.55, kategorie: "uro" },
  { bezeichnung: "Stuhlinkontinenz", icd10: "R15", haeufigkeit: 0.25, kategorie: "uro" },
  { bezeichnung: "Chronische Niereninsuffizienz Stad. III", icd10: "N18.3", haeufigkeit: 0.20, kategorie: "uro" },
  { bezeichnung: "Benigne Prostatahyperplasie", icd10: "N40", haeufigkeit: 0.15, kategorie: "uro" },
  { bezeichnung: "Rezidivierende Harnwegsinfekte", icd10: "N39.0", haeufigkeit: 0.20, kategorie: "uro" },

  // Respiratorisch
  { bezeichnung: "COPD GOLD II-III", icd10: "J44.1", haeufigkeit: 0.18, kategorie: "respiratorisch" },
  { bezeichnung: "Asthma bronchiale", icd10: "J45.9", haeufigkeit: 0.08, kategorie: "respiratorisch" },
  { bezeichnung: "Schlafapnoe-Syndrom", icd10: "G47.30", haeufigkeit: 0.10, kategorie: "respiratorisch" },
  { bezeichnung: "Z.n. Pneumonie", icd10: "J18.9", haeufigkeit: 0.15, kategorie: "respiratorisch" },

  // Sonstiges
  { bezeichnung: "Visusminderung beidseits", icd10: "H54.2", haeufigkeit: 0.42, kategorie: "sonstiges" },
  { bezeichnung: "Schwerhoerigkeit beidseits", icd10: "H91.9", haeufigkeit: 0.38, kategorie: "sonstiges" },
  { bezeichnung: "Sturzneigung", icd10: "R29.6", haeufigkeit: 0.30, kategorie: "sonstiges" },
  { bezeichnung: "Dekubitus Grad I-II (anamn.)", icd10: "L89.1", haeufigkeit: 0.12, kategorie: "sonstiges" },
  { bezeichnung: "Dysphagie", icd10: "R13.10", haeufigkeit: 0.18, kategorie: "sonstiges" },
  { bezeichnung: "Obstipation chronisch", icd10: "K59.0", haeufigkeit: 0.45, kategorie: "sonstiges" },
  { bezeichnung: "Anaemie", icd10: "D64.9", haeufigkeit: 0.22, kategorie: "sonstiges" },
  { bezeichnung: "Z.n. Mamma-Ca", icd10: "Z85.3", haeufigkeit: 0.05, kategorie: "sonstiges" },
  { bezeichnung: "Z.n. Prostata-Ca", icd10: "Z85.46", haeufigkeit: 0.03, kategorie: "sonstiges" },
  { bezeichnung: "Glaukom", icd10: "H40.9", haeufigkeit: 0.14, kategorie: "sonstiges" },
];

export const ALLERGIEN = [
  "Penicillin", "Sulfonamide", "Aspirin", "Latex", "Pflaster (Pflasterkleber)",
  "Jod (Kontrastmittel)", "Erdbeeren", "Nuesse", "Hausstaubmilben", "Pollen",
];

export const TYPISCHE_MEDIKAMENTE: { praeparat: string; staerke: string; indikation: string }[] = [
  { praeparat: "Ramipril", staerke: "5 mg", indikation: "Hypertonie" },
  { praeparat: "Bisoprolol", staerke: "2,5 mg", indikation: "Herzinsuffizienz" },
  { praeparat: "Furosemid", staerke: "40 mg", indikation: "Diuretikum" },
  { praeparat: "Marcoumar", staerke: "3 mg", indikation: "Antikoagulation" },
  { praeparat: "Eliquis", staerke: "5 mg", indikation: "Vorhofflimmern" },
  { praeparat: "Metformin", staerke: "500 mg", indikation: "Diabetes mell. II" },
  { praeparat: "Pantoprazol", staerke: "40 mg", indikation: "Magenschutz" },
  { praeparat: "Levothyroxin", staerke: "75 ug", indikation: "Hypothyreose" },
  { praeparat: "Donepezil", staerke: "10 mg", indikation: "Demenz" },
  { praeparat: "Risperidon", staerke: "0,5 mg", indikation: "Unruhe" },
  { praeparat: "Mirtazapin", staerke: "15 mg", indikation: "Depression/Schlaf" },
  { praeparat: "Pregabalin", staerke: "75 mg", indikation: "Polyneuropathie" },
  { praeparat: "Movicol", staerke: "1 Btl.", indikation: "Obstipation" },
  { praeparat: "Vitamin D3", staerke: "1000 IE", indikation: "Vitamin-D-Mangel" },
  { praeparat: "Calcium", staerke: "500 mg", indikation: "Osteoporose" },
  { praeparat: "Novalgin", staerke: "500 mg", indikation: "Schmerz" },
  { praeparat: "Tramadol", staerke: "50 mg", indikation: "Schmerz" },
  { praeparat: "Tiotropium", staerke: "18 ug", indikation: "COPD" },
];
