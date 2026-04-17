import type { Bundesland, FacilitySize, PeerGroup, QualityIndicator, TraegerType } from "./types";

/**
 * 10 QI nach § 113 SGB XI (Stand 2026, IGES-Systematik).
 * Vereinfachte Labels für UI-Zwecke — Detail-Beschreibungen im Modal.
 */
export const QIS: QualityIndicator[] = [
  {
    id: "qi-01", code: "QI-1", label: "Erhaltene Mobilität",
    description: "Anteil Bewohner:innen mit erhaltener oder verbesserter Mobilität über 6 Monate (Barthel-Index Mobilitätsdomäne).",
    unit: "percent", higherIsBetter: true,
    source: "§ 113 SGB XI, IGES-Methodenhandbuch 2023",
    improvementHints: [
      "Bewegungsförderung durch wöchentliche Gruppengymnastik",
      "Sturzrisiko-Assessment bei Aufnahme und quartalsweise wiederholen",
      "Individuelle Mobilisierungspläne je Bewohner:in",
    ],
  },
  {
    id: "qi-02", code: "QI-2", label: "Erhaltene Selbständigkeit Alltagsverrichtungen",
    description: "Anteil Bewohner:innen mit erhaltener/verbesserter Selbständigkeit bei Körperpflege, Ernährung, Toilette.",
    unit: "percent", higherIsBetter: true,
    source: "§ 113 SGB XI, Modul 4 NBA",
    improvementHints: ["Aktivierende Pflege statt ersetzende Pflege dokumentieren", "Individuelle Ressourcen-Analyse je Pflegevisite"],
  },
  {
    id: "qi-03", code: "QI-3", label: "Dekubitusentstehung",
    description: "Anteil neu aufgetretener Dekubitus Kategorie 2-4 im Beobachtungszeitraum.",
    unit: "percent", higherIsBetter: false,
    source: "Expertenstandard Dekubitusprophylaxe (DNQP 2017)",
    improvementHints: ["Braden-Skala bei Aufnahme + bei Verschlechterung", "Hautinspektion dokumentieren", "Positionierungsplan bei Risikopersonen"],
  },
  {
    id: "qi-04", code: "QI-4", label: "Schwerwiegende Sturzfolgen",
    description: "Anzahl Stürze mit Fraktur oder Klinikeinweisung je 1000 Belegtage.",
    unit: "per1000", higherIsBetter: false,
    source: "Expertenstandard Sturzprophylaxe (DNQP 2022)",
    improvementHints: ["Sturzrisiko-Assessment (Downton)", "Umgebungscheck (Beleuchtung, Teppiche, Hilfsmittel)", "Krafttraining je Bewohner:in"],
  },
  {
    id: "qi-05", code: "QI-5", label: "Unbeabsichtigter Gewichtsverlust",
    description: "Anteil Bewohner:innen mit ≥5% Gewichtsverlust in 3 Monaten oder ≥10% in 6 Monaten.",
    unit: "percent", higherIsBetter: false,
    source: "Expertenstandard Ernährungsmanagement (DNQP 2017)",
    improvementHints: ["MNA-SF bei Aufnahme + quartalsweise", "BMI-Verlauf dokumentieren", "Ernährungs-Assessment bei Risikopersonen"],
  },
  {
    id: "qi-06", code: "QI-6", label: "Durchführung Integrationsgespräche",
    description: "Anteil Neu-Einzüge mit dokumentiertem Integrationsgespräch binnen 14 Tagen.",
    unit: "percent", higherIsBetter: true,
    source: "§ 113 SGB XI QPR 2023",
    improvementHints: ["Standardisiertes Einzugs-Interview-Formular", "Terminvereinbarung innerhalb 72h automatisieren"],
  },
  {
    id: "qi-07", code: "QI-7", label: "Anwendung Gurte (Fixierung)",
    description: "Anteil Bewohner:innen mit mechanischer Fixierung. Niedrigere Quote = höhere Qualität.",
    unit: "percent", higherIsBetter: false,
    source: "Leitlinie FEM (Werdenfelser Weg)",
    improvementHints: ["Alternativen-Prüfung verpflichtend dokumentieren", "Multiprofessionelle Fallbesprechung vor Fixierungsentscheidung"],
  },
  {
    id: "qi-08", code: "QI-8", label: "Aktualität Schmerzeinschätzung",
    description: "Anteil Bewohner:innen mit gültiger Schmerzeinschätzung (≤ 30 Tage alt).",
    unit: "percent", higherIsBetter: true,
    source: "Expertenstandard Schmerzmanagement (DNQP 2020)",
    improvementHints: ["Numerische Rating-Skala (NRS) + BESD bei Demenz", "Re-Assessment nach Schmerzmedikation innerhalb 2h"],
  },
  {
    id: "qi-09", code: "QI-9", label: "Einsatz Freiheitsentziehender Maßnahmen",
    description: "Anteil Bewohner:innen mit gerichtlich genehmigten FEM.",
    unit: "percent", higherIsBetter: false,
    source: "§ 1906 BGB, § 284 ABGB",
    improvementHints: ["Regelmäßige Ethik-Fallbesprechungen", "FEM-Reduktionsprogramm (z.B. Werdenfelser Weg)"],
  },
  {
    id: "qi-10", code: "QI-10", label: "Versorgung Harnkontinenz",
    description: "Anteil Bewohner:innen mit Kontinenzprofil und individueller Maßnahmenplanung.",
    unit: "percent", higherIsBetter: true,
    source: "Expertenstandard Kontinenzförderung (DNQP 2014)",
    improvementHints: ["Kontinenz-Assessment binnen 14 Tagen nach Einzug", "Toilettentraining dokumentieren"],
  },
];

/**
 * Referenzwerte (Peer-Medians) je Dimension. Mock-Daten,
 * plausibel kalibriert auf veröffentlichte QPR-Auswertungen.
 */
interface RefBase {
  qiId: string;
  median: number;
  mean: number;
  sd: number;
}

function baseRefs(): Record<string, RefBase> {
  return {
    "qi-01": { qiId: "qi-01", median: 68, mean: 66.8, sd: 8 },
    "qi-02": { qiId: "qi-02", median: 72, mean: 71.4, sd: 7 },
    "qi-03": { qiId: "qi-03", median: 4.1, mean: 4.3, sd: 1.8 },
    "qi-04": { qiId: "qi-04", median: 3.2, mean: 3.5, sd: 1.4 },
    "qi-05": { qiId: "qi-05", median: 6.8, mean: 7.1, sd: 2.2 },
    "qi-06": { qiId: "qi-06", median: 92, mean: 89.6, sd: 6 },
    "qi-07": { qiId: "qi-07", median: 2.1, mean: 2.4, sd: 1.5 },
    "qi-08": { qiId: "qi-08", median: 88, mean: 86.2, sd: 6.5 },
    "qi-09": { qiId: "qi-09", median: 6.5, mean: 6.8, sd: 2.1 },
    "qi-10": { qiId: "qi-10", median: 84, mean: 82.1, sd: 7.2 },
  };
}

const REGION_SHIFT: Record<Bundesland, number> = {
  "Wien": 1.5, "Niederösterreich": 0.8, "Oberösterreich": 1.2, "Steiermark": 0.5, "Tirol": 0.6,
  "Bayern": 1.0, "Baden-Württemberg": 1.1, "Nordrhein-Westfalen": -0.4, "Hamburg": 0.9, "Berlin": -0.8,
};

const SIZE_SHIFT: Record<FacilitySize, number> = { klein: 0.8, mittel: 0, gross: -0.3 };
const TRAEGER_SHIFT: Record<TraegerType, number> = { public: -0.2, church: 0.6, private: -0.8, nonprofit: 0.4 };

export function referenceFor(
  qiId: string,
  bundesland: Bundesland,
  size: FacilitySize,
  traeger: TraegerType,
): RefBase {
  const base = baseRefs()[qiId];
  if (!base) throw new Error(`Unbekannter QI ${qiId}`);
  const qi = QIS.find((q) => q.id === qiId)!;
  const higher = qi.higherIsBetter;
  const shift = (REGION_SHIFT[bundesland] + SIZE_SHIFT[size] + TRAEGER_SHIFT[traeger]) * (higher ? 1 : -1);
  const factor = qi.unit === "percent" ? 1 : 0.3;
  return {
    qiId,
    median: Math.max(0, base.median + shift * factor),
    mean: Math.max(0, base.mean + shift * factor),
    sd: base.sd,
  };
}

export const BUNDESLAENDER: Bundesland[] = [
  "Wien", "Niederösterreich", "Oberösterreich", "Steiermark", "Tirol",
  "Bayern", "Baden-Württemberg", "Nordrhein-Westfalen", "Hamburg", "Berlin",
];

export const SIZES: { id: FacilitySize; label: string }[] = [
  { id: "klein", label: "Klein (<50 Betten)" },
  { id: "mittel", label: "Mittel (50–150 Betten)" },
  { id: "gross", label: "Groß (>150 Betten)" },
];

export const TRAEGER: { id: TraegerType; label: string }[] = [
  { id: "public", label: "Öffentlich" },
  { id: "church", label: "Kirchlich / Diakonisch" },
  { id: "private", label: "Privat" },
  { id: "nonprofit", label: "Gemeinnützig" },
];

export function makePeerGroup(bundesland: Bundesland, size: FacilitySize, traeger: TraegerType): PeerGroup {
  return {
    id: `${bundesland}-${size}-${traeger}`.toLowerCase().replace(/\s+/g, "-"),
    label: `${bundesland} · ${SIZES.find((s) => s.id === size)?.label} · ${TRAEGER.find((t) => t.id === traeger)?.label}`,
    bundesland, size, traegerType: traeger,
    sampleN: 18 + Math.floor(((bundesland.length + size.length + traeger.length) * 7) % 42),
  };
}
