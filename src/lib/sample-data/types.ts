// Types for the advanced sample-data generator.
// Kept independent from existing seed/db schemas — this is purely synthetic
// in-memory demo data (used for previews, exports and stress tests).

export type Geschlecht = "weiblich" | "maennlich" | "divers";

export type Pflegegrad = 1 | 2 | 3 | 4 | 5;

export interface SampleBewohner {
  id: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string; // ISO yyyy-mm-dd
  alter: number;
  geschlecht: Geschlecht;
  zimmer: string;
  pflegegrad: Pflegegrad;
  einzugsdatum: string;
  diagnosen: string[];
  allergien: string[];
  bezugspflege: string;
  konfession?: string;
  herkunftsland: string;
}

export interface SampleSIS {
  bewohnerId: string;
  themenfelder: Record<string, string>; // 6 Themenfelder SIS
  letzteAktualisierung: string;
}

export interface SampleMassnahme {
  id: string;
  bewohnerId: string;
  titel: string;
  intervall: "taeglich" | "woechentlich" | "monatlich" | "bei_bedarf";
  verantwortlich: string;
  letzteDurchfuehrung: string;
}

export interface SampleBericht {
  id: string;
  bewohnerId: string;
  datum: string;
  schicht: "frueh" | "spaet" | "nacht";
  autor: string;
  text: string;
  kategorie: "pflege" | "medizinisch" | "sozial" | "ernaehrung" | "sturz";
}

export interface SampleVitalwert {
  bewohnerId: string;
  datum: string;
  systole: number;
  diastole: number;
  puls: number;
  temperatur: number;
  gewichtKg?: number;
  schmerzNRS?: number;
}

export interface SampleMedikation {
  bewohnerId: string;
  praeparat: string;
  staerke: string;
  schema: string; // z.B. "1-0-1-0"
  indikation: string;
  seit: string;
}

export interface SampleWundeSnapshot {
  datum: string;
  grad: 1 | 2 | 3 | 4;
  laengeMm: number;
  breiteMm: number;
  tiefeMm: number;
  exsudat: "kein" | "gering" | "mittel" | "stark";
  notiz: string;
  fotoPlatzhalter: string;
}

export interface SampleWunde {
  id: string;
  bewohnerId: string;
  lokalisation: string;
  ersterkennung: string;
  abgeschlossenAm?: string;
  snapshots: SampleWundeSnapshot[];
}

export interface SampleDataset {
  bewohner: SampleBewohner[];
  sis: SampleSIS[];
  massnahmen: SampleMassnahme[];
  berichte: SampleBericht[];
  vitalwerte: SampleVitalwert[];
  medikation: SampleMedikation[];
  wunden: SampleWunde[];
  meta: {
    generiertAm: string;
    seed: number;
    szenarioId: string;
    anzahlBewohner: number;
  };
}

export interface DatasetStats {
  anzahlBewohner: number;
  altersverteilung: { gruppe: string; anzahl: number }[];
  pgVerteilung: { pg: Pflegegrad; anzahl: number }[];
  geschlechtVerteilung: { geschlecht: Geschlecht; anzahl: number }[];
  durchschnittBerichteProBewohner: number;
  durchschnittDiagnosenProBewohner: number;
  anteilMitWunden: number; // 0..1
  topDiagnosen: { diagnose: string; anzahl: number }[];
}
