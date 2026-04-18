/**
 * AMTS Interaktions-Engine — bekannte relevante Medikamenten-Paarungen bei Älteren.
 *
 * Quellen (paraphrasiert, nicht kopiert):
 *   - ABDA-Datenbank (Interaktionen, Mechanismus)
 *   - PRISCUS 2.0 Risikowarnungen
 *   - FORTA 2023
 *   - Beers 2023 (Second Opinion)
 *
 * Regeln:
 *   - Jede Interaktion doppelseitig (A→B und B→A erkennen).
 *   - Gruppen-Matching: "SSRI" matched Sertralin, Citalopram, Escitalopram, Paroxetin, Fluoxetin.
 */

export type Severity = "hoch" | "mittel" | "niedrig";

export interface InteractionDefinition {
  /** Pattern A — Wirkstoff-Name oder Klassen-Label (lowercase match). */
  a: string[];
  /** Pattern B — Wirkstoff-Name oder Klassen-Label. */
  b: string[];
  severity: Severity;
  mechanismus: string;
  empfehlung: string;
  quelle: "ABDA" | "PRISCUS" | "FORTA" | "Beers" | "Fachinformation";
}

// Wirkstoff-Klassen-Gruppen für Matching.
const GROUPS: Record<string, string[]> = {
  ssri: ["sertralin", "citalopram", "escitalopram", "paroxetin", "fluoxetin", "fluvoxamin"],
  snri: ["venlafaxin", "duloxetin", "milnacipran"],
  tca: ["amitriptylin", "doxepin", "imipramin", "clomipramin", "trimipramin", "nortriptylin"],
  mao: ["tranylcypromin", "moclobemid", "rasagilin", "selegilin"],
  nsar: ["ibuprofen", "diclofenac", "naproxen", "indomethacin", "piroxicam", "ketoprofen", "ketorolac", "etoricoxib", "meloxicam"],
  vka: ["phenprocoumon", "warfarin", "acenocoumarol"],
  doak: ["apixaban", "rivaroxaban", "edoxaban", "dabigatran"],
  opioid: ["morphin", "oxycodon", "hydromorphon", "fentanyl", "tramadol", "tilidin", "tapentadol", "buprenorphin", "pethidin"],
  benzodiazepin: ["diazepam", "lorazepam", "oxazepam", "bromazepam", "alprazolam", "clonazepam", "flurazepam", "nitrazepam", "temazepam"],
  z_substanz: ["zolpidem", "zopiclon", "zaleplon"],
  betablocker: ["metoprolol", "bisoprolol", "carvedilol", "atenolol", "propranolol", "nebivolol", "sotalol"],
  ace: ["ramipril", "lisinopril", "enalapril", "captopril", "perindopril"],
  arb: ["candesartan", "valsartan", "losartan", "telmisartan", "irbesartan", "olmesartan"],
  thiazid: ["hydrochlorothiazid", "chlortalidon", "indapamid"],
  schleifendiuretikum: ["furosemid", "torasemid", "bumetanid"],
  kaliumsparer: ["spironolacton", "eplerenon", "amilorid", "triamteren"],
  statin: ["simvastatin", "atorvastatin", "rosuvastatin", "pravastatin", "fluvastatin"],
  makrolid: ["clarithromycin", "erythromycin", "azithromycin"],
  chinolon: ["ciprofloxacin", "levofloxacin", "moxifloxacin", "norfloxacin"],
  triptan: ["sumatriptan", "zolmitriptan", "rizatriptan", "naratriptan"],
  anticholinergikum: ["amitriptylin", "doxepin", "oxybutynin", "tolterodin", "diphenhydramin", "doxylamin", "promethazin", "biperiden", "hydroxyzin"],
  qt_verlaengerer: ["haloperidol", "amiodaron", "sotalol", "citalopram", "escitalopram", "clarithromycin", "moxifloxacin", "domperidon", "ondansetron", "methadon", "quetiapin"],
  ppi: ["omeprazol", "pantoprazol", "esomeprazol", "lansoprazol"],
  sulfonylharnstoff: ["glibenclamid", "gliclazid", "glimepirid", "glipizid"],
  schilddruese: ["l-thyroxin", "levothyroxin"],
};

function matchesTerm(wirkstoff: string, term: string): boolean {
  const w = wirkstoff.toLowerCase();
  const t = term.toLowerCase();
  // Klassen-Match
  if (GROUPS[t]) return GROUPS[t].some((n) => w.includes(n));
  // Einzel-Match
  return w.includes(t) || t.includes(w.split(" ")[0]);
}

function matchesAny(wirkstoff: string, patterns: string[]): boolean {
  return patterns.some((p) => matchesTerm(wirkstoff, p));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Interaktions-Regeln (>=30 klinisch relevante Paarungen bei Älteren)
// ═══════════════════════════════════════════════════════════════════════════════

export const INTERACTIONS: InteractionDefinition[] = [
  // ─── Serotonerges Syndrom ──────────────────────────────────────────────
  { a: ["ssri"], b: ["mao"], severity: "hoch",
    mechanismus: "Additive serotonerge Wirkung → Serotonin-Syndrom (Hyperthermie, Rigor, Myoklonus).",
    empfehlung: "Kombination kontraindiziert. Wash-out 14 Tage bei MAO-Umstellung.",
    quelle: "Fachinformation" },
  { a: ["snri"], b: ["mao"], severity: "hoch",
    mechanismus: "Serotonin-Syndrom-Risiko.",
    empfehlung: "Kontraindiziert.", quelle: "Fachinformation" },
  { a: ["ssri"], b: ["tramadol"], severity: "mittel",
    mechanismus: "Beide serotonerg + Krampfschwelle senkend.",
    empfehlung: "Nur bei fehlender Alternative; engmaschige klinische Beobachtung.", quelle: "ABDA" },
  { a: ["ssri"], b: ["triptan"], severity: "mittel",
    mechanismus: "Serotonerge Potenzierung.", empfehlung: "Monitoring; Patient aufklären.", quelle: "ABDA" },

  // ─── Blutung / Antikoagulation ──────────────────────────────────────────
  { a: ["vka"], b: ["nsar"], severity: "hoch",
    mechanismus: "Verdrängung aus Eiweißbindung + GI-Schleimhautschaden → stark erhöhte Blutungsneigung.",
    empfehlung: "Vermeiden. Paracetamol oder Metamizol bevorzugen. Falls unvermeidbar: PPI + INR-Kontrolle.",
    quelle: "ABDA" },
  { a: ["vka"], b: ["makrolid"], severity: "hoch",
    mechanismus: "CYP3A4-Hemmung → erhöhter Phenprocoumon/Warfarin-Spiegel, INR-Anstieg.",
    empfehlung: "Azithromycin bevorzugen, INR engmaschig kontrollieren.", quelle: "ABDA" },
  { a: ["vka"], b: ["chinolon"], severity: "hoch",
    mechanismus: "CYP-Hemmung + Darmflora-Veränderung → INR-Anstieg.",
    empfehlung: "INR nach 3 Tagen kontrollieren, Dosis ggf. reduzieren.", quelle: "ABDA" },
  { a: ["doak"], b: ["nsar"], severity: "hoch",
    mechanismus: "Additive Blutungsneigung (GI + Plättchenhemmung).",
    empfehlung: "Vermeiden; Alternative: Paracetamol, Metamizol.", quelle: "PRISCUS" },
  { a: ["vka", "doak"], b: ["ssri"], severity: "mittel",
    mechanismus: "SSRI hemmen Thrombozytenaggregation → Blutungsrisiko.",
    empfehlung: "Gastroprotektion (PPI) erwägen; Blutungszeichen beobachten.", quelle: "ABDA" },
  { a: ["dabigatran"], b: ["verapamil", "amiodaron"], severity: "mittel",
    mechanismus: "P-Glykoprotein-Hemmung → erhöhte Dabigatran-Spiegel.",
    empfehlung: "Dabigatran-Dosis reduzieren oder Alternative.", quelle: "Fachinformation" },

  // ─── QT-Verlängerung ────────────────────────────────────────────────────
  { a: ["qt_verlaengerer"], b: ["qt_verlaengerer"], severity: "hoch",
    mechanismus: "Additive QT-Verlängerung → Torsade de pointes.",
    empfehlung: "EKG vor und unter Therapie; Kombinationen möglichst vermeiden.", quelle: "Fachinformation" },
  { a: ["amiodaron"], b: ["digoxin"], severity: "hoch",
    mechanismus: "Verdopplung der Digoxin-Spiegel durch P-gp-Hemmung.",
    empfehlung: "Digoxin-Dosis halbieren, Spiegel kontrollieren.", quelle: "ABDA" },

  // ─── Hyperkaliämie ──────────────────────────────────────────────────────
  { a: ["ace", "arb"], b: ["kaliumsparer"], severity: "mittel",
    mechanismus: "Additive Kalium-Retention → Hyperkaliämie.",
    empfehlung: "K+ und Kreatinin alle 2–4 Wochen kontrollieren.", quelle: "ABDA" },
  { a: ["ace", "arb"], b: ["nsar"], severity: "mittel",
    mechanismus: "Reduktion des renalen Blutflusses → akutes Nierenversagen, Hyperkaliämie ('Triple Whammy' mit Diuretikum).",
    empfehlung: "NSAR kurzfristig mit Monitoring; bei Diuretikum zusätzlich: vermeiden.", quelle: "ABDA" },

  // ─── Sturz / Sedierung (ZNS) ────────────────────────────────────────────
  { a: ["benzodiazepin", "z_substanz"], b: ["opioid"], severity: "hoch",
    mechanismus: "Additive Atemdepression + Sedierung → Atemstillstandsrisiko, Sturz.",
    empfehlung: "Möglichst vermeiden; wenn nötig: niedrigste Dosen, Monitoring.",
    quelle: "PRISCUS" },
  { a: ["benzodiazepin"], b: ["benzodiazepin"], severity: "hoch",
    mechanismus: "Doppelverordnung Benzodiazepin → Kumulation, Delir, Sturz.",
    empfehlung: "Nur eine Substanz; langsam absetzen.", quelle: "PRISCUS" },
  { a: ["anticholinergikum"], b: ["anticholinergikum"], severity: "hoch",
    mechanismus: "Kumulative anticholinerge Last (Anticholinergic Burden).",
    empfehlung: "Anticholinergic Burden Score < 3 halten; Umstellen auf nicht-anticholinerge Alternativen.",
    quelle: "PRISCUS" },

  // ─── Nephrotoxizität ────────────────────────────────────────────────────
  { a: ["metformin"], b: ["kontrastmittel", "rtg-kontrastmittel"], severity: "hoch",
    mechanismus: "Laktatazidose-Risiko bei akutem Nierenversagen durch KM.",
    empfehlung: "Metformin 48h vor und nach KM pausieren; Kreatinin vor Wiederaufnahme.",
    quelle: "Fachinformation" },
  { a: ["nsar"], b: ["schleifendiuretikum", "thiazid"], severity: "mittel",
    mechanismus: "Reduktion der Diuretika-Wirkung + renale Dekompensation.",
    empfehlung: "NSAR meiden; wenn nötig: Kreatinin-Monitoring.", quelle: "ABDA" },

  // ─── CYP3A4-Interaktionen ──────────────────────────────────────────────
  { a: ["makrolid"], b: ["statin"], severity: "hoch",
    mechanismus: "CYP3A4-Hemmung → erhöhte Statin-Spiegel, Rhabdomyolyse.",
    empfehlung: "Statin pausieren oder Azithromycin (kein CYP-Einfluss) verwenden.", quelle: "ABDA" },
  { a: ["simvastatin"], b: ["amiodaron"], severity: "mittel",
    mechanismus: "CYP3A4-Hemmung, Myopathie-Risiko.",
    empfehlung: "Simvastatin max. 20 mg/d oder auf Pravastatin/Rosuvastatin umstellen.", quelle: "Fachinformation" },

  // ─── Hypoglykämie ──────────────────────────────────────────────────────
  { a: ["sulfonylharnstoff"], b: ["betablocker"], severity: "mittel",
    mechanismus: "Betablocker maskiert Hypoglykämie-Symptome (Tachykardie, Tremor).",
    empfehlung: "Patient aufklären, häufigere BZ-Messung; selektive Betablocker bevorzugen.", quelle: "ABDA" },
  { a: ["ace"], b: ["sulfonylharnstoff"], severity: "niedrig",
    mechanismus: "Verstärkte Insulin-Sensitivität → Hypoglykämie.",
    empfehlung: "BZ-Monitoring bei Therapiebeginn.", quelle: "ABDA" },

  // ─── Schilddrüse / Resorption ──────────────────────────────────────────
  { a: ["schilddruese"], b: ["calcium", "eisen", "ppi"], severity: "niedrig",
    mechanismus: "Resorptionshemmung von L-Thyroxin.",
    empfehlung: "Abstand >=4h halten.", quelle: "ABDA" },
  { a: ["schilddruese"], b: ["ppi"], severity: "niedrig",
    mechanismus: "Reduzierte Magensäure → reduzierte L-Thyroxin-Resorption.",
    empfehlung: "TSH nach 6–8 Wochen kontrollieren.", quelle: "Fachinformation" },

  // ─── Elektrolyte / Digoxin ─────────────────────────────────────────────
  { a: ["digoxin"], b: ["schleifendiuretikum", "thiazid"], severity: "mittel",
    mechanismus: "Hypokaliämie verstärkt Digoxin-Toxizität.",
    empfehlung: "K+ im oberen Normbereich halten; ggf. Kaliumsubstitution.", quelle: "ABDA" },

  // ─── Sturzrisiko / Orthostase ──────────────────────────────────────────
  { a: ["doxazosin", "terazosin"], b: ["thiazid", "schleifendiuretikum"], severity: "mittel",
    mechanismus: "Additive Hypotonie, Orthostase → Sturzrisiko.",
    empfehlung: "Alpha-Blocker meiden oder niedrig einschleichen.", quelle: "PRISCUS" },

  // ─── Lithium ────────────────────────────────────────────────────────────
  { a: ["lithium"], b: ["ace", "arb", "nsar", "thiazid"], severity: "hoch",
    mechanismus: "Reduzierte renale Clearance → Lithium-Intoxikation.",
    empfehlung: "Spiegel engmaschig; Dosisreduktion; Alternativen prüfen.", quelle: "Fachinformation" },

  // ─── Spezielle ältere-spezifische Warnungen ────────────────────────────
  { a: ["tramadol"], b: ["ssri", "snri"], severity: "mittel",
    mechanismus: "Serotonin-Syndrom + Krampfschwelle.",
    empfehlung: "Alternative Analgetika prüfen (Paracetamol, Tilidin).", quelle: "FORTA" },
  { a: ["clopidogrel"], b: ["omeprazol", "esomeprazol"], severity: "mittel",
    mechanismus: "CYP2C19-Hemmung → reduzierte Clopidogrel-Aktivierung.",
    empfehlung: "Pantoprazol bevorzugen.", quelle: "Fachinformation" },
];

export interface InteractionFinding {
  medikament_a: string;
  medikament_b: string;
  severity: Severity;
  mechanismus: string;
  empfehlung: string;
  quelle: string;
}

/**
 * Prüft eine Liste von Wirkstoffen auf bekannte Interaktionen.
 * Jedes Paar wird genau einmal gemeldet (symmetrisch: dedupe).
 */
export function checkInteractions(wirkstoffe: string[]): InteractionFinding[] {
  const findings: InteractionFinding[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < wirkstoffe.length; i++) {
    for (let j = 0; j < wirkstoffe.length; j++) {
      if (i === j) continue;
      const a = wirkstoffe[i];
      const b = wirkstoffe[j];
      const pairKey = [a, b].sort().join("||");

      for (const rule of INTERACTIONS) {
        if (matchesAny(a, rule.a) && matchesAny(b, rule.b)) {
          const ruleKey = pairKey + "::" + rule.mechanismus;
          if (seen.has(ruleKey)) continue;
          seen.add(ruleKey);
          findings.push({
            medikament_a: a,
            medikament_b: b,
            severity: rule.severity,
            mechanismus: rule.mechanismus,
            empfehlung: rule.empfehlung,
            quelle: rule.quelle,
          });
        }
      }
    }
  }

  // Sortieren: hoch → mittel → niedrig
  const order: Record<Severity, number> = { hoch: 0, mittel: 1, niedrig: 2 };
  findings.sort((x, y) => order[x.severity] - order[y.severity]);
  return findings;
}
