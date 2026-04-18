/**
 * PRISCUS 2.0 — Liste potentiell inadäquater Medikamente (PIM) bei ≥65 Jahren.
 *
 * Quelle: PRISCUS 2.0 (Mann N-K et al., 2023), https://priscus2-0.de
 * Diese Implementierung ist eine Auswahl der wichtigsten Substanzen (Top ~60).
 * Für klinische Entscheidungen: immer aktuelle Vollliste konsultieren.
 */

export type PriscusBewertung = "vermeiden" | "bedingt" | "anpassen";

export interface PriscusEintrag {
  wirkstoff: string;
  atc?: string;
  priscus_bewertung: PriscusBewertung;
  begruendung: string;
  alternative?: string;
  klasse: string; // z.B. "Benzodiazepin", "TCA", "NSAR", "Anticholinergikum"
}

export const PRISCUS_LISTE: PriscusEintrag[] = [
  // ═══════════ Benzodiazepine & Z-Substanzen (Sturz, Delir, Abhängigkeit) ═══════════
  { wirkstoff: "Diazepam", atc: "N05BA01", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin (lang)",
    begruendung: "Lange HWZ (bis 200h), kumuliert bei Älteren, erhöht Sturz- und Delirrisiko.",
    alternative: "Lorazepam kurz (max. 2 Wochen) oder nicht-pharmakologisch." },
  { wirkstoff: "Bromazepam", atc: "N05BA08", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin",
    begruendung: "Kumulation, Sturz, kognitive Beeinträchtigung.", alternative: "Kurzwirksame Alternativen in niedriger Dosis." },
  { wirkstoff: "Chlordiazepoxid", atc: "N05BA02", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin (lang)",
    begruendung: "Sehr lange HWZ, hohes Kumulationsrisiko." },
  { wirkstoff: "Clobazam", atc: "N05BA09", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin (lang)",
    begruendung: "Kumulation, Sedierung." },
  { wirkstoff: "Flurazepam", atc: "N05CD01", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin (lang)",
    begruendung: "HWZ >50h, Hang-over, Sturz." },
  { wirkstoff: "Nitrazepam", atc: "N05CD02", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin (lang)",
    begruendung: "Lange Wirkdauer, Sturz-/Delirrisiko.", alternative: "Zopiclon max. 4 Wochen, niedrig dosiert." },
  { wirkstoff: "Lorazepam", atc: "N05BA06", priscus_bewertung: "bedingt", klasse: "Benzodiazepin",
    begruendung: "Bei akuter Angst/Agitation OK, aber max. 2–4 Wochen, niedrig dosiert (<=0.5mg).",
    alternative: "Niedrigste Dosis, keine Dauertherapie." },
  { wirkstoff: "Zolpidem", atc: "N05CF02", priscus_bewertung: "bedingt", klasse: "Z-Substanz",
    begruendung: "Sturz, Amnesie, Abhängigkeit bei Dauertherapie.", alternative: "Max. 4 Wochen, <=5mg." },
  { wirkstoff: "Zopiclon", atc: "N05CF01", priscus_bewertung: "bedingt", klasse: "Z-Substanz",
    begruendung: "Sturzrisiko, Abhängigkeit.", alternative: "Max. 4 Wochen, <=3.75mg." },

  // ═══════════ Trizyklische Antidepressiva (anticholinerg, QT) ═══════════
  { wirkstoff: "Amitriptylin", atc: "N06AA09", priscus_bewertung: "vermeiden", klasse: "TCA",
    begruendung: "Stark anticholinerg (Verwirrtheit, Harnverhalt, Mundtrockenheit), QT-Verlängerung, Sturz.",
    alternative: "Mirtazapin, SSRI (Sertralin, Citalopram) — bei Schmerz: Duloxetin." },
  { wirkstoff: "Doxepin", atc: "N06AA12", priscus_bewertung: "vermeiden", klasse: "TCA",
    begruendung: "Stark anticholinerg, sedierend, Sturz.", alternative: "Mirtazapin, SSRI." },
  { wirkstoff: "Imipramin", atc: "N06AA02", priscus_bewertung: "vermeiden", klasse: "TCA",
    begruendung: "Anticholinerg, kardiotoxisch.", alternative: "SSRI." },
  { wirkstoff: "Clomipramin", atc: "N06AA04", priscus_bewertung: "vermeiden", klasse: "TCA",
    begruendung: "Anticholinerg, epileptogen.", alternative: "SSRI." },
  { wirkstoff: "Trimipramin", atc: "N06AA06", priscus_bewertung: "vermeiden", klasse: "TCA",
    begruendung: "Stark sedierend, anticholinerg." },

  // ═══════════ Antihistaminika der 1. Generation (anticholinerg, Delir) ═══════════
  { wirkstoff: "Diphenhydramin", atc: "R06AA02", priscus_bewertung: "vermeiden", klasse: "Antihistaminikum (1. Gen)",
    begruendung: "Stark anticholinerg, sedierend, Delir. Häufig als OTC-Schlafmittel verkauft.",
    alternative: "Nicht-pharmakologisch, Melatonin." },
  { wirkstoff: "Doxylamin", atc: "R06AA09", priscus_bewertung: "vermeiden", klasse: "Antihistaminikum (1. Gen)",
    begruendung: "Anticholinerg, Hangover, Sturz." },
  { wirkstoff: "Hydroxyzin", atc: "N05BB01", priscus_bewertung: "vermeiden", klasse: "Antihistaminikum",
    begruendung: "QT-Verlängerung, anticholinerg." },
  { wirkstoff: "Promethazin", atc: "R06AD02", priscus_bewertung: "vermeiden", klasse: "Phenothiazin",
    begruendung: "Stark sedierend, anticholinerg, EPS." },

  // ═══════════ NSAR (GI, kardial, renal) ═══════════
  { wirkstoff: "Indomethacin", atc: "M01AB01", priscus_bewertung: "vermeiden", klasse: "NSAR",
    begruendung: "Hohes GI-Blutungs-, kardiovaskuläres und ZNS-Risiko (Kopfschmerz, Verwirrtheit).",
    alternative: "Paracetamol, Metamizol, ggf. Ibuprofen kurzfristig + PPI." },
  { wirkstoff: "Phenylbutazon", priscus_bewertung: "vermeiden", klasse: "NSAR",
    begruendung: "Agranulozytose-Risiko, GI-Blutung." },
  { wirkstoff: "Piroxicam", atc: "M01AC01", priscus_bewertung: "vermeiden", klasse: "NSAR",
    begruendung: "Lange HWZ, GI-Blutung.", alternative: "Ibuprofen oder Naproxen kurzfristig mit PPI." },
  { wirkstoff: "Ketoprofen", atc: "M01AE03", priscus_bewertung: "vermeiden", klasse: "NSAR",
    begruendung: "GI-Risiko erhöht." },
  { wirkstoff: "Ketorolac", atc: "M01AB15", priscus_bewertung: "vermeiden", klasse: "NSAR",
    begruendung: "Hohes GI-Risiko." },
  { wirkstoff: "Etoricoxib", atc: "M01AH05", priscus_bewertung: "bedingt", klasse: "COX-2",
    begruendung: "Kardiovaskuläre Risiken, RR-Anstieg.", alternative: "Kurze Therapie, niedrigste wirksame Dosis." },

  // ═══════════ Anticholinergika (Delir, Harnverhalt) ═══════════
  { wirkstoff: "Oxybutynin", atc: "G04BD04", priscus_bewertung: "vermeiden", klasse: "Anticholinergikum (Urologie)",
    begruendung: "ZNS-gängig, Delir, kognitive Beeinträchtigung.",
    alternative: "Mirabegron, Solifenacin (weniger ZNS-gängig)." },
  { wirkstoff: "Tolterodin", atc: "G04BD07", priscus_bewertung: "bedingt", klasse: "Anticholinergikum",
    begruendung: "Geringer ZNS-Eintritt, aber trotzdem Mundtrockenheit, Obstipation." },
  { wirkstoff: "Biperiden", atc: "N04AA02", priscus_bewertung: "vermeiden", klasse: "Anticholinergikum (Parkinson)",
    begruendung: "Delir, kognitive Beeinträchtigung.", alternative: "L-DOPA-Dosis optimieren." },

  // ═══════════ Antiarrhythmika / Kardiaka ═══════════
  { wirkstoff: "Digoxin", atc: "C01AA05", priscus_bewertung: "anpassen", klasse: "Herzglykosid",
    begruendung: "Enge therapeutische Breite, Nephrotoxizität kritisch. Zieltalspiegel 0.5–0.8 ng/ml.",
    alternative: "Dosis an GFR anpassen; bei VHF: Betablocker bevorzugen." },
  { wirkstoff: "Amiodaron", atc: "C01BD01", priscus_bewertung: "bedingt", klasse: "Antiarrhythmikum",
    begruendung: "QT-Verlängerung, Schilddrüse, Lunge, Leber. Regelmäßiges Monitoring.",
    alternative: "Bei VHF: Dronedaron oder rein frequenzkontrollierend." },
  { wirkstoff: "Sotalol", atc: "C07AA07", priscus_bewertung: "bedingt", klasse: "Betablocker/Antiarrhythmikum",
    begruendung: "QT-Verlängerung, renal eliminiert.", alternative: "Metoprolol, Bisoprolol." },
  { wirkstoff: "Flecainid", atc: "C01BC04", priscus_bewertung: "vermeiden", klasse: "Antiarrhythmikum",
    begruendung: "Proarrhythmogen bei struktureller Herzerkrankung.", alternative: "Amiodaron (mit Vorsicht) oder Frequenzkontrolle." },

  // ═══════════ Antihypertensiva mit hohem Sturzrisiko ═══════════
  { wirkstoff: "Clonidin", atc: "C02AC01", priscus_bewertung: "vermeiden", klasse: "zentrales Antihypertensivum",
    begruendung: "Orthostase, Sedierung, Rebound bei Absetzen, Sturz.",
    alternative: "ACE-Hemmer, ARB, Thiazid niedrig dosiert." },
  { wirkstoff: "Methyldopa", atc: "C02AB02", priscus_bewertung: "vermeiden", klasse: "zentrales Antihypertensivum",
    begruendung: "Sedierung, Depression, Leber.", alternative: "ACE-Hemmer/ARB." },
  { wirkstoff: "Doxazosin", atc: "C02CA04", priscus_bewertung: "bedingt", klasse: "Alpha-Blocker",
    begruendung: "Orthostatische Hypotonie, Sturz. BPH-Indikation: Tamsulosin bevorzugen." },
  { wirkstoff: "Nifedipin (nicht retard)", atc: "C08CA05", priscus_bewertung: "vermeiden", klasse: "CCB (kurz)",
    begruendung: "Plötzlicher RR-Abfall, Reflextachykardie.", alternative: "Amlodipin, Lercanidipin." },

  // ═══════════ Antipsychotika (EPS, Sturz, Mortalität bei Demenz) ═══════════
  { wirkstoff: "Haloperidol (>2mg/d)", atc: "N05AD01", priscus_bewertung: "bedingt", klasse: "Antipsychotikum",
    begruendung: "EPS, QT-Verlängerung. Bei Delir: niedrige Dosen (0.5–1mg) kurzfristig akzeptabel.",
    alternative: "Risperidon niedrig, Quetiapin, nicht-pharmakologisch." },
  { wirkstoff: "Olanzapin", atc: "N05AH03", priscus_bewertung: "bedingt", klasse: "Antipsychotikum (atypisch)",
    begruendung: "Metabolische NW, Sturz. Bei Demenz: erhöhte Mortalität (Black-Box-Warnung)." },
  { wirkstoff: "Clozapin", atc: "N05AH02", priscus_bewertung: "vermeiden", klasse: "Antipsychotikum",
    begruendung: "Agranulozytose, orthostat. Hypotonie, anticholinerg." },
  { wirkstoff: "Perphenazin", priscus_bewertung: "vermeiden", klasse: "Phenothiazin",
    begruendung: "EPS, Sedierung, anticholinerg." },

  // ═══════════ Opioide mit problematischem Profil ═══════════
  { wirkstoff: "Pethidin", atc: "N02AB02", priscus_bewertung: "vermeiden", klasse: "Opioid",
    begruendung: "Neurotoxischer Metabolit Norpethidin, Delir, Krämpfe.",
    alternative: "Morphin, Hydromorphon, Oxycodon niedrig dosiert." },
  { wirkstoff: "Pentazocin", priscus_bewertung: "vermeiden", klasse: "Opioid",
    begruendung: "ZNS-NW, Agitation, Halluzinationen." },
  { wirkstoff: "Tramadol (Hochdosis)", atc: "N02AX02", priscus_bewertung: "bedingt", klasse: "Opioid/Serotonin",
    begruendung: "Serotonin-Syndrom mit SSRI/SNRI/MAO, Krampfschwelle senkend.",
    alternative: "Niedrig dosieren; Kombinationen prüfen; retard bevorzugen." },

  // ═══════════ Muskelrelaxantien ═══════════
  { wirkstoff: "Tetrazepam", priscus_bewertung: "vermeiden", klasse: "Benzodiazepin-MR",
    begruendung: "BZD-Profil, Sedierung, Sturz." },
  { wirkstoff: "Baclofen (>30mg)", atc: "M03BX01", priscus_bewertung: "bedingt", klasse: "Muskelrelaxans",
    begruendung: "ZNS-NW, renal eliminiert." },
  { wirkstoff: "Methocarbamol", priscus_bewertung: "vermeiden", klasse: "Muskelrelaxans",
    begruendung: "Sedierung, Sturz." },

  // ═══════════ Sonstige ═══════════
  { wirkstoff: "Metoclopramid (Dauertherapie)", atc: "A03FA01", priscus_bewertung: "bedingt", klasse: "Antiemetikum",
    begruendung: "EPS, Spätdyskinesien bei Dauertherapie >12 Wochen.", alternative: "Domperidon kurz, Ondansetron." },
  { wirkstoff: "Glibenclamid", atc: "A10BB01", priscus_bewertung: "vermeiden", klasse: "Sulfonylharnstoff",
    begruendung: "Hohes Hypoglykämierisiko, lange HWZ.", alternative: "Gliclazid, Metformin, DPP4-Inhibitor." },
  { wirkstoff: "Theophyllin", atc: "R03DA04", priscus_bewertung: "vermeiden", klasse: "Methylxanthin",
    begruendung: "Enge therapeutische Breite, Interaktionen, Tachyarrhythmien.",
    alternative: "Inhalative Therapie optimieren." },
  { wirkstoff: "Colchicin (Niereninsuffizienz)", atc: "M04AC01", priscus_bewertung: "anpassen", klasse: "Gicht",
    begruendung: "Myopathie, Neuropathie bei GFR <30. Dosis anpassen." },
  { wirkstoff: "Chlortalidon (>25mg)", atc: "C03BA04", priscus_bewertung: "bedingt", klasse: "Diuretikum",
    begruendung: "Hyponatriämie, Hypokaliämie, Sturz. <=12.5mg bevorzugen." },
  { wirkstoff: "Nitrofurantoin (GFR<30)", atc: "J01XE01", priscus_bewertung: "vermeiden", klasse: "Antibiotikum",
    begruendung: "Lungenfibrose, Polyneuropathie bei eingeschränkter Nierenfunktion.", alternative: "Fosfomycin Einzeldosis." },
];

/**
 * Liefert PRISCUS-Eintrag anhand Wirkstoff-Namen (case-insensitive, Teilmatch).
 * Testet nicht nur exact match sondern auch "Amitriptylin 25mg" → "Amitriptylin".
 */
export function lookupPriscus(wirkstoff: string): PriscusEintrag | undefined {
  const needle = wirkstoff.toLowerCase().trim();
  return PRISCUS_LISTE.find((e) => {
    const name = e.wirkstoff.toLowerCase().split(" ")[0]; // "Nifedipin (nicht retard)" → "nifedipin"
    return needle.includes(name) || name.includes(needle);
  });
}
