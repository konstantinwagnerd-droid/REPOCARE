/**
 * Pflege-Fachvokabular-Autokorrektur für Whisper-Transkripte.
 *
 * Quellen:
 * - Medikamente: Gelbe Liste / Rote Liste (Wirkstoffe & Handelsnamen, DE/AT)
 * - Diagnosen: ICD-10-GM (DIMDI/BfArM), gängige geriatrische Diagnosen
 * - Assessments: DNQP-Expertenstandards, gängige geriatrische Assessments
 * - NANDA-I: Pflegediagnosen-Taxonomie (NANDA International)
 * - FEM/Gesetze: HeimAufG (AT), BtMG, SGB V/XI (DE), Werdenfelser Weg
 *
 * Confidence-Konvention:
 * - 0.95–1.00 → sehr seltene/unmissverständliche Begriffe (auto-apply, grünes Chip)
 * - 0.80–0.94 → klare Fachtermini (auto-apply mit manueller Prüfung, grün)
 * - 0.70–0.79 → ambig — manuell bestätigen (gelbes Chip)
 */

export type VocabCategory =
  | "medikament"
  | "diagnose"
  | "assessment"
  | "anatomie"
  | "fem"
  | "gesetz"
  | "standard";

export interface VocabCorrection {
  /** Whisper-Fehlerpattern (Regex, möglichst spezifisch, mit Wortgrenzen). */
  pattern: RegExp;
  /** Kanonische Zielform. */
  correct: string;
  category: VocabCategory;
  /** 0.70–1.00 — je höher, desto sicherer (grün=auto, gelb=manuell). */
  confidence: number;
}

/**
 * Hinweis zu Regex-Patterns:
 *  - \b Wortgrenzen um False-Positives in längeren Wörtern zu vermeiden
 *  - `gi` (global + case-insensitive) — Pflegekräfte diktieren mal groß, mal klein
 *  - optionale Leer-/Bindestriche via `[- ]?` um Whisper-Wortzerteilung zu fangen
 */
export const PFLEGE_CORRECTIONS: VocabCorrection[] = [
  // ─────────────────────────────────────────────────────────────────
  // MEDIKAMENTE (Wirkstoffe + gängige Handelsnamen, DE/AT)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bpanto[- ]?prasol\b/gi, correct: "Pantoprazol", category: "medikament", confidence: 0.95 },
  { pattern: /\bome[- ]?prasol\b/gi, correct: "Omeprazol", category: "medikament", confidence: 0.95 },
  { pattern: /\bmeta[- ]?(profol|prolol|brolol)\b/gi, correct: "Metoprolol", category: "medikament", confidence: 0.9 },
  { pattern: /\bbiso[- ]?prolol\b/gi, correct: "Bisoprolol", category: "medikament", confidence: 0.95 },
  { pattern: /\bdigitalisch(e|es|er|en)?\b/gi, correct: "Digitalis", category: "medikament", confidence: 0.85 },
  { pattern: /\bdigo[- ]?xin\b/gi, correct: "Digoxin", category: "medikament", confidence: 0.95 },
  { pattern: /\bmar[- ]?cumar\b/gi, correct: "Marcumar", category: "medikament", confidence: 0.9 },
  { pattern: /\bvaliu\b/gi, correct: "Valium", category: "medikament", confidence: 0.9 },
  { pattern: /\btra[- ]?madol\b/gi, correct: "Tramadol", category: "medikament", confidence: 0.95 },
  { pattern: /\bnova[- ]?min[- ]?sulfon\b/gi, correct: "Novaminsulfon", category: "medikament", confidence: 0.95 },
  { pattern: /\bno[- ]?valgin\b/gi, correct: "Novalgin", category: "medikament", confidence: 0.9 },
  { pattern: /\bl[- ]?thy?roxin\b/gi, correct: "L-Thyroxin", category: "medikament", confidence: 0.9 },
  { pattern: /\btora[- ]?se?mid\b/gi, correct: "Torasemid", category: "medikament", confidence: 0.9 },
  { pattern: /\bfuro[- ]?se?mid\b/gi, correct: "Furosemid", category: "medikament", confidence: 0.9 },
  { pattern: /\bam[- ]?lo[- ]?dipin\b/gi, correct: "Amlodipin", category: "medikament", confidence: 0.9 },
  { pattern: /\b(a[- ]?s[- ]?s|a\.s\.s\.)\b/gi, correct: "ASS", category: "medikament", confidence: 0.8 },
  { pattern: /\brami[- ]?pril\b/gi, correct: "Ramipril", category: "medikament", confidence: 0.95 },
  { pattern: /\bmet[- ]?formin\b/gi, correct: "Metformin", category: "medikament", confidence: 0.95 },
  { pattern: /\bmor[- ]?phium\b/gi, correct: "Morphium", category: "medikament", confidence: 0.95 },
  { pattern: /\bfenta[- ]?nyl\b/gi, correct: "Fentanyl", category: "medikament", confidence: 0.95 },
  { pattern: /\bti[- ]?li[- ]?din\b/gi, correct: "Tilidin", category: "medikament", confidence: 0.9 },
  { pattern: /\bo(x|ck)y[- ]?codon\b/gi, correct: "Oxycodon", category: "medikament", confidence: 0.9 },
  { pattern: /\bibu[- ]?profen\b/gi, correct: "Ibuprofen", category: "medikament", confidence: 0.95 },
  { pattern: /\bpara[- ]?cetamol\b/gi, correct: "Paracetamol", category: "medikament", confidence: 0.95 },
  { pattern: /\bdexa[- ]?methason\b/gi, correct: "Dexamethason", category: "medikament", confidence: 0.95 },
  { pattern: /\bcorti[- ]?son\b/gi, correct: "Cortison", category: "medikament", confidence: 0.9 },
  { pattern: /\bhepa[- ]?rin\b/gi, correct: "Heparin", category: "medikament", confidence: 0.9 },
  { pattern: /\bclo[- ]?pido[- ]?grel\b/gi, correct: "Clopidogrel", category: "medikament", confidence: 0.95 },
  { pattern: /\bsim[- ]?va[- ]?statin\b/gi, correct: "Simvastatin", category: "medikament", confidence: 0.95 },
  { pattern: /\bcipro[- ]?flo?xacin\b/gi, correct: "Ciprofloxacin", category: "medikament", confidence: 0.95 },
  { pattern: /\bri[- ]?vo?[- ]?roxaban\b/gi, correct: "Rivaroxaban", category: "medikament", confidence: 0.95 },
  { pattern: /\bapi[- ]?xaban\b/gi, correct: "Apixaban", category: "medikament", confidence: 0.95 },
  { pattern: /\bquet(i|hi)[- ]?a?pin\b/gi, correct: "Quetiapin", category: "medikament", confidence: 0.9 },
  { pattern: /\brisperi?[- ]?don\b/gi, correct: "Risperidon", category: "medikament", confidence: 0.9 },
  { pattern: /\bhalo[- ]?peri?[- ]?dol\b/gi, correct: "Haloperidol", category: "medikament", confidence: 0.9 },

  // ─────────────────────────────────────────────────────────────────
  // DIAGNOSEN (ICD-10-GM, gängige geriatrische Diagnosen)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bdeka[- ]?bitus\b/gi, correct: "Dekubitus", category: "diagnose", confidence: 0.98 },
  { pattern: /\bal[- ]?t?zheimer\b/gi, correct: "Alzheimer", category: "diagnose", confidence: 0.9 },
  { pattern: /\bpark[- ]?inson\b/gi, correct: "Parkinson", category: "diagnose", confidence: 0.9 },
  { pattern: /\bdia[- ]?betes mel[- ]?litus\b/gi, correct: "Diabetes mellitus", category: "diagnose", confidence: 0.9 },
  { pattern: /\b(c\.?o\.?p\.?d\.?|ze[- ]?o[- ]?pe[- ]?de)\b/gi, correct: "COPD", category: "diagnose", confidence: 0.85 },
  { pattern: /\b(k[- ]?h[- ]?k|ka[- ]?ha[- ]?ka)\b/gi, correct: "KHK", category: "diagnose", confidence: 0.8 },
  { pattern: /\bkoronare? herz[- ]?krankheit\b/gi, correct: "Koronare Herzkrankheit", category: "diagnose", confidence: 0.95 },
  { pattern: /\bde[- ]?menz\b/gi, correct: "Demenz", category: "diagnose", confidence: 0.95 },
  { pattern: /\bapo[- ]?plex\b/gi, correct: "Apoplex", category: "diagnose", confidence: 0.95 },
  { pattern: /\bpneu[- ]?monie\b/gi, correct: "Pneumonie", category: "diagnose", confidence: 0.95 },
  { pattern: /\bsep[- ]?sis\b/gi, correct: "Sepsis", category: "diagnose", confidence: 0.9 },
  { pattern: /\bre[- ]?flux\b/gi, correct: "Reflux", category: "diagnose", confidence: 0.85 },
  { pattern: /\bosteo[- ]?po?rose\b/gi, correct: "Osteoporose", category: "diagnose", confidence: 0.95 },
  { pattern: /\bdy?s[- ]?phagie\b/gi, correct: "Dysphagie", category: "diagnose", confidence: 0.95 },
  { pattern: /\bin[- ]?konti[- ]?nenz\b/gi, correct: "Inkontinenz", category: "diagnose", confidence: 0.9 },
  { pattern: /\bvi[- ]?tium\b/gi, correct: "Vitium", category: "diagnose", confidence: 0.75 },
  { pattern: /\bar[- ]?throse\b/gi, correct: "Arthrose", category: "diagnose", confidence: 0.95 },
  { pattern: /\bhemi[- ]?pa?[- ]?rese\b/gi, correct: "Hemiparese", category: "diagnose", confidence: 0.95 },
  { pattern: /\baph[- ]?asie\b/gi, correct: "Aphasie", category: "diagnose", confidence: 0.9 },
  { pattern: /\bexsik[- ]?kose\b/gi, correct: "Exsikkose", category: "diagnose", confidence: 0.95 },
  { pattern: /\bdeli[- ]?r(ium)?\b/gi, correct: "Delir", category: "diagnose", confidence: 0.85 },
  { pattern: /\bchronis?ch(e|es|er|en)? herz[- ]?(in)?[- ]?suffi[- ]?zienz\b/gi, correct: "chronische Herzinsuffizienz", category: "diagnose", confidence: 0.9 },
  { pattern: /\bharn[- ]?wegs[- ]?in[- ]?fekt(ion)?\b/gi, correct: "Harnwegsinfekt", category: "diagnose", confidence: 0.95 },
  { pattern: /\bpoly[- ]?neuro[- ]?pathie\b/gi, correct: "Polyneuropathie", category: "diagnose", confidence: 0.95 },

  // ─────────────────────────────────────────────────────────────────
  // ASSESSMENTS (DNQP & gängige Skalen)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bbraten[- ]?skala\b/gi, correct: "Braden-Skala", category: "assessment", confidence: 0.98 },
  { pattern: /\bbraden[- ]?skala\b/gi, correct: "Braden-Skala", category: "assessment", confidence: 0.99 },
  { pattern: /\bti[- ]?netti([- ]?test)?\b/gi, correct: "Tinetti-Test", category: "assessment", confidence: 0.9 },
  { pattern: /\b(em[- ]?em[- ]?es[- ]?de?|m\.?m\.?s\.?e\.?)\b/gi, correct: "MMSE", category: "assessment", confidence: 0.8 },
  { pattern: /\bbarthel([- ]?index)?\b/gi, correct: "Barthel-Index", category: "assessment", confidence: 0.95 },
  { pattern: /\bnorton[- ]?skala\b/gi, correct: "Norton-Skala", category: "assessment", confidence: 0.95 },
  { pattern: /\bza[- ]?rit\b/gi, correct: "Zarit", category: "assessment", confidence: 0.75 },
  { pattern: /\bpai[- ]?nad\b/gi, correct: "PAINAD", category: "assessment", confidence: 0.9 },
  { pattern: /\bbe[- ]?es[- ]?de?\b/gi, correct: "BESD", category: "assessment", confidence: 0.75 },
  { pattern: /\b(e[- ]?c[- ]?pa|ec[- ]?pa)\b/gi, correct: "ECPA", category: "assessment", confidence: 0.75 },
  { pattern: /\bdown[- ]?ton\b/gi, correct: "Downton", category: "assessment", confidence: 0.85 },
  { pattern: /\b(mo[- ]?ca|m\.?o\.?c\.?a\.?)\b/gi, correct: "MoCA", category: "assessment", confidence: 0.8 },
  { pattern: /\bdem[- ]?tect\b/gi, correct: "DemTect", category: "assessment", confidence: 0.9 },
  { pattern: /\buhren[- ]?test\b/gi, correct: "Uhrentest", category: "assessment", confidence: 0.9 },
  { pattern: /\btimed[- ]?up[- ]?(and[- ]?)?go\b/gi, correct: "Timed Up and Go", category: "assessment", confidence: 0.95 },
  { pattern: /\b(vas|v\.?a\.?s\.?)[- ]?skala\b/gi, correct: "VAS-Skala", category: "assessment", confidence: 0.8 },

  // ─────────────────────────────────────────────────────────────────
  // ANATOMIE / LOKALISATION (Dekubitus-Prädilektionsstellen etc.)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bsak[- ]?rum\b/gi, correct: "Sakrum", category: "anatomie", confidence: 0.9 },
  { pattern: /\btro[- ]?chan[- ]?ter\b/gi, correct: "Trochanter", category: "anatomie", confidence: 0.9 },
  { pattern: /\bglu[- ]?teal[- ]?region\b/gi, correct: "Glutealregion", category: "anatomie", confidence: 0.95 },
  { pattern: /\bmal[- ]?leo[- ]?lus\b/gi, correct: "Malleolus", category: "anatomie", confidence: 0.9 },
  { pattern: /\bfersen[- ]?region\b/gi, correct: "Fersenregion", category: "anatomie", confidence: 0.9 },
  { pattern: /\boc?ci[- ]?put\b/gi, correct: "Occiput", category: "anatomie", confidence: 0.85 },
  { pattern: /\btho[- ]?rax\b/gi, correct: "Thorax", category: "anatomie", confidence: 0.9 },
  { pattern: /\bab[- ]?domen\b/gi, correct: "Abdomen", category: "anatomie", confidence: 0.9 },
  { pattern: /\bster[- ]?num\b/gi, correct: "Sternum", category: "anatomie", confidence: 0.9 },
  { pattern: /\bscap[- ]?ula\b/gi, correct: "Scapula", category: "anatomie", confidence: 0.85 },

  // ─────────────────────────────────────────────────────────────────
  // FEM (Freiheitsentziehende Maßnahmen)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bwehr[- ]?(den|dem|denn) ?fälls?[- ]?her\b/gi, correct: "Werdenfelser", category: "fem", confidence: 0.95 },
  { pattern: /\bwerden[- ]?felser( weg)?\b/gi, correct: "Werdenfelser Weg", category: "fem", confidence: 0.95 },
  { pattern: /\bbett[- ]?gitter\b/gi, correct: "Bettgitter", category: "fem", confidence: 0.9 },
  { pattern: /\bbauch[- ]?gurt\b/gi, correct: "Bauchgurt", category: "fem", confidence: 0.9 },
  { pattern: /\bfi(x|cks)[- ]?ierung\b/gi, correct: "Fixierung", category: "fem", confidence: 0.9 },
  { pattern: /\bsteck[- ]?tisch\b/gi, correct: "Stecktisch", category: "fem", confidence: 0.85 },

  // ─────────────────────────────────────────────────────────────────
  // GESETZE / PARAGRAPHEN
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bparagra(ph|f)?\s*113\s*b\b/gi, correct: "§113b SGB XI", category: "gesetz", confidence: 0.85 },
  { pattern: /\bparagra(ph|f)?\s*302\b/gi, correct: "§302 SGB V", category: "gesetz", confidence: 0.85 },
  { pattern: /\bbe[- ]?tem[- ]?ge\b/gi, correct: "BtMG", category: "gesetz", confidence: 0.9 },
  { pattern: /\bheim[- ]?auf[- ]?ge?\b/gi, correct: "HeimAufG", category: "gesetz", confidence: 0.9 },
  { pattern: /\bs[- ]?g[- ]?b\s*(elf|11|xi)\b/gi, correct: "SGB XI", category: "gesetz", confidence: 0.9 },
  { pattern: /\bs[- ]?g[- ]?b\s*(fünf|5|v)\b/gi, correct: "SGB V", category: "gesetz", confidence: 0.9 },

  // ─────────────────────────────────────────────────────────────────
  // STANDARDS / TAXONOMIEN (DNQP, NANDA-I, ICD)
  // ─────────────────────────────────────────────────────────────────
  { pattern: /\bdienst[- ]?kuh[- ]?pe\b/gi, correct: "DNQP", category: "standard", confidence: 0.9 },
  { pattern: /\b(d\.?n\.?q\.?p\.?|de[- ]?en[- ]?ku[- ]?pe)\b/gi, correct: "DNQP", category: "standard", confidence: 0.85 },
  { pattern: /\bnan[- ]?da\s?[- ]?(eins|1|i)\b/gi, correct: "NANDA-I", category: "standard", confidence: 0.9 },
  { pattern: /\bi[- ]?c[- ]?d\s*10\b/gi, correct: "ICD-10", category: "standard", confidence: 0.9 },
  { pattern: /\bi[- ]?c[- ]?f\b/gi, correct: "ICF", category: "standard", confidence: 0.75 },
  { pattern: /\bex[- ]?per[- ]?ten[- ]?standard\b/gi, correct: "Expertenstandard", category: "standard", confidence: 0.9 },
  { pattern: /\bsis\s?[- ]?(bogen)?\b/gi, correct: "SIS", category: "standard", confidence: 0.7 },
];

/**
 * Liefert alle Korrekturen einer Kategorie — praktisch für Dictionary-Audits / UI-Filter.
 */
export function correctionsByCategory(category: VocabCategory): VocabCorrection[] {
  return PFLEGE_CORRECTIONS.filter((c) => c.category === category);
}

/**
 * Stats (Anzahl pro Kategorie) — nützlich für Debug/Doku.
 */
export function vocabularyStats(): Record<VocabCategory, number> & { total: number } {
  const stats: Record<string, number> = {
    medikament: 0,
    diagnose: 0,
    assessment: 0,
    anatomie: 0,
    fem: 0,
    gesetz: 0,
    standard: 0,
  };
  for (const c of PFLEGE_CORRECTIONS) stats[c.category]++;
  return { ...(stats as Record<VocabCategory, number>), total: PFLEGE_CORRECTIONS.length };
}
