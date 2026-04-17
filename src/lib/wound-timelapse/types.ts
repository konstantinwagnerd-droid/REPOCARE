// Wunden-Timelapse-Viewer — Typen.

export type WoundGrade = 1 | 2 | 3 | 4;
export type ExudateLevel = "kein" | "gering" | "mittel" | "stark";

export interface WoundSnapshot {
  id: string;
  date: string;       // ISO yyyy-mm-dd
  grade: WoundGrade;
  laengeMm: number;
  breiteMm: number;
  tiefeMm: number;
  flaecheMm2: number; // laenge * breite
  exudate: ExudateLevel;
  notes: string;
  photoUrl: string;   // platzhalter / data-URL
  author: string;
}

export interface WoundCase {
  id: string;
  bewohnerId: string;
  bewohnerName: string;
  lokalisation: string;
  ersterkennung: string;
  abgeschlossenAm?: string;
  snapshots: WoundSnapshot[];
}

export interface WoundComparison {
  von: WoundSnapshot;
  bis: WoundSnapshot;
  tageDifferenz: number;
  delta: {
    laengeMm: number;
    breiteMm: number;
    tiefeMm: number;
    flaecheMm2: number;
    grade: number;
  };
  trend: "heilend" | "stabil" | "verschlechtert";
}

export interface HealingProgress {
  woundId: string;
  startGrade: WoundGrade;
  currentGrade: WoundGrade;
  startFlaeche: number;
  currentFlaeche: number;
  flaechenReduktionPct: number;
  durationDays: number;
  score: number; // 0..100, höher = besser
  prognose: string;
}
