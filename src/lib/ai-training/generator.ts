/**
 * Dataset Generator for CareAI Fine-Tuning Datasets
 *
 * Deterministic pseudo-random generation from seed.
 * No PII — all names are fictional archetypes ("Bewohner A", "Bewohnerin B").
 */

import type { DatasetEntry, DatasetName } from "./types";

// Simple deterministic PRNG (mulberry32) — reproducible across runs
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

// ----------------------------- VARIATION POOLS -----------------------------

const SIS_THEMEN = [
  { id: 1, name: "Kognitive und kommunikative Fähigkeiten" },
  { id: 2, name: "Mobilität und Beweglichkeit" },
  { id: 3, name: "Krankheitsbezogene Anforderungen und Belastungen" },
  { id: 4, name: "Selbstversorgung" },
  { id: 5, name: "Leben in sozialen Beziehungen" },
  { id: 6, name: "Wohnen/Häuslichkeit" },
] as const;

const SIS_EXAMPLE_TEXTS = [
  "Bewohnerin wirkt heute zeitlich desorientiert, erkennt jedoch vertraute Gesichter.",
  "Gangbild unsicher, nutzt Rollator, benötigt Hilfe beim Aufstehen.",
  "Diabetische Stoffwechsellage stabil, Blutzucker heute morgen 142 mg/dl.",
  "Beim Waschen passiv, akzeptiert Unterstützung ohne Widerstand.",
  "Besuch der Tochter, Gespräch angeregt, Bewohner lächelte mehrfach.",
  "Zimmer ordentlich, Pflanzen gegossen, Bewohnerin achtet auf Privatsphäre.",
  "Herr A. zeigt heute vermehrte Unruhe am Nachmittag, läuft Flur auf und ab.",
  "Transfer Bett-Rollstuhl mit 1 Person möglich, Mobilisation gemäß Expertenstandard.",
  "Medikation ASS 100 mg pünktlich verabreicht, keine unerwünschten Wirkungen.",
  "Benötigt Anleitung beim Ankleiden, Reihenfolge der Kleidungsstücke unklar.",
  "Spielte heute Vormittag mit Mitbewohner Mensch-ärgere-dich-nicht.",
  "Rutschmatte im Badezimmer neu platziert nach Beinahe-Sturz gestern.",
  "Frau M. spricht vom verstorbenen Mann, wirkt traurig aber nicht verzweifelt.",
  "Gehstrecke heute ca. 30 Meter, mit Gehstock, Pausen nötig.",
  "Schmerzen im rechten Knie VAS 4/10, Paracetamol 500 verabreicht um 14:00.",
  "Nahrungsaufnahme Mittag: Suppe vollständig, Hauptgericht Hälfte gegessen.",
  "Teilnahme an Sitzgymnastik, gute Laune, interagierte mit Gruppe.",
  "Rufanlage am Bett geprüft, funktionsfähig, Lichtschalter erreichbar.",
];

function sisSampleToThema(txt: string): (typeof SIS_THEMEN)[number] {
  // Keyword-driven mapping for realism
  const t = txt.toLowerCase();
  if (/(desorient|erkennt|spricht|unruhe|traurig|verzweif)/.test(t)) return SIS_THEMEN[0];
  if (/(gang|rollator|transfer|mobilis|gehstrecke|aufsteh|gehstock)/.test(t)) return SIS_THEMEN[1];
  if (/(blutzucker|ass|medikation|paracetamol|schmerz|stoffwechsel)/.test(t)) return SIS_THEMEN[2];
  if (/(waschen|ankleid|nahrungsaufnahme|mittag|wasch)/.test(t)) return SIS_THEMEN[3];
  if (/(besuch|mitbewohn|sitzgymn|tochter|gespräch|gruppe)/.test(t)) return SIS_THEMEN[4];
  if (/(zimmer|rutschmatte|rufanlage|pflanzen|privatsph)/.test(t)) return SIS_THEMEN[5];
  return SIS_THEMEN[3];
}

// ----------------------------- SIS CLASSIFICATION -----------------------------

function generateSisClassification(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const entries: DatasetEntry[] = [];
  const variations = [
    (s: string) => s,
    (s: string) => s.replace("Bewohnerin", "Frau B."),
    (s: string) => s.replace("Bewohner", "Herr A."),
    (s: string) => `Schichtbericht: ${s}`,
    (s: string) => `Beobachtung: ${s} Keine weiteren Auffälligkeiten.`,
    (s: string) => `${s} Rücksprache mit PDL erfolgt.`,
    (s: string) => `Frühdienst: ${s}`,
    (s: string) => `Spätdienst: ${s} Dokumentiert in Pflegeverlauf.`,
  ];

  for (let i = 0; i < count; i++) {
    const base = pick(SIS_EXAMPLE_TEXTS, rnd);
    const vari = pick(variations, rnd);
    const input = vari(base);
    const thema = sisSampleToThema(base);
    const confidence: "high" | "medium" | "low" =
      rnd() > 0.2 ? "high" : rnd() > 0.5 ? "medium" : "low";
    entries.push({
      id: `sis-${String(i + 1).padStart(4, "0")}`,
      input,
      output: `Themenfeld ${thema.id}: ${thema.name}`,
      confidence_hint: confidence,
      meta: { dataset: "sis-classification", seed, tags: ["sis", `tf${thema.id}`] },
    });
  }
  return entries;
}

// ----------------------------- VITAL ANOMALY -----------------------------

function generateVitalAnomaly(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const entries: DatasetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const days = 3 + Math.floor(rnd() * 4);
    const isAnomaly = rnd() < 0.55;
    const isCritical = isAnomaly && rnd() < 0.3;

    const sysBase = 120 + Math.floor(rnd() * 30);
    const values: Array<{ d: number; sys: number; dia: number; puls: number; spo2: number }> = [];
    for (let d = 0; d < days; d++) {
      const drift = isAnomaly ? (isCritical ? -d * 9 : -d * 5) : Math.floor(rnd() * 4 - 2);
      values.push({
        d: d + 1,
        sys: sysBase + drift,
        dia: 70 + Math.floor(rnd() * 10) + Math.floor(drift / 2),
        puls: 72 + Math.floor(rnd() * 15) + (isAnomaly ? d * 2 : 0),
        spo2: 97 - (isCritical ? d : 0),
      });
    }

    const input = `Vitalwerte-Trend ${days} Tage: ${values
      .map((v) => `Tag ${v.d}: RR ${v.sys}/${v.dia}, Puls ${v.puls}, SpO2 ${v.spo2}%`)
      .join("; ")}`;

    let output: string;
    if (isCritical) {
      output =
        "Einschätzung: kritisch. Kontinuierlicher RR-Abfall kombiniert mit Tachykardie und SpO2-Abnahme deutet auf mögliche Exsikkose oder beginnende Infektion. Sofortige ärztliche Rücksprache empfohlen, Flüssigkeitsstatus prüfen.";
    } else if (isAnomaly) {
      output =
        "Einschätzung: auffällig. Leichte Abwärtstendenz des Blutdrucks über mehrere Tage bei stabiler Sauerstoffsättigung. Engmaschige Kontrolle, Trink-Protokoll führen, Ursachen evaluieren.";
    } else {
      output =
        "Einschätzung: normal. Werte innerhalb üblicher Schwankungsbreite, keine pathologische Tendenz erkennbar. Routine-Monitoring fortsetzen.";
    }

    entries.push({
      id: `vit-${String(i + 1).padStart(4, "0")}`,
      input,
      output,
      confidence_hint: isCritical ? "high" : isAnomaly ? "medium" : "high",
      meta: {
        dataset: "vital-anomaly-detection",
        seed,
        tags: isCritical ? ["critical"] : isAnomaly ? ["anomaly"] : ["normal"],
      },
    });
  }
  return entries;
}

// ----------------------------- MEDICATION INTERACTION -----------------------------

const MED_COMBINATIONS = [
  { a: "Mirtazapin 15mg", b: "Tramadol 50mg", risk: "Serotonin-Syndrom-Risiko (PRISCUS)", level: "B" },
  { a: "Warfarin 5mg", b: "Ibuprofen 400mg", risk: "Erhöhte Blutungsneigung", level: "A" },
  { a: "Digoxin 0.25mg", b: "Furosemid 40mg", risk: "Hypokaliämie, Digoxin-Toxizität", level: "A" },
  { a: "Metformin 850mg", b: "Kontrastmittel iv", risk: "Laktatazidose-Risiko", level: "B" },
  { a: "Diazepam 5mg", b: "Oxycodon 10mg", risk: "Atemdepression (FORTA D)", level: "A" },
  { a: "Amiodaron 200mg", b: "Simvastatin 40mg", risk: "Myopathie-Risiko erhöht", level: "B" },
  { a: "ASS 100mg", b: "Clopidogrel 75mg", risk: "Duale Thrombozytenaggregationshemmung prüfen", level: "C" },
  { a: "Lisinopril 10mg", b: "Spironolacton 25mg", risk: "Hyperkaliämie-Risiko", level: "B" },
  { a: "Quetiapin 100mg", b: "Escitalopram 10mg", risk: "QT-Zeit-Verlängerung (PRISCUS)", level: "B" },
  { a: "L-Thyroxin 100µg", b: "Calciumcarbonat 500mg", risk: "Resorption vermindert — 4h Abstand", level: "C" },
  { a: "Levodopa 100/25mg", b: "Haloperidol 1mg", risk: "Parkinson-Verschlechterung", level: "A" },
  { a: "Rivaroxaban 20mg", b: "Diclofenac 75mg", risk: "Blutungsrisiko signifikant erhöht", level: "A" },
  { a: "Metoprolol 47.5mg", b: "Verapamil 80mg", risk: "Bradykardie, AV-Blockierung", level: "A" },
  { a: "Sertralin 50mg", b: "Ibuprofen 400mg", risk: "GI-Blutungsrisiko erhöht", level: "B" },
  { a: "Glimepirid 2mg", b: "Prednisolon 20mg", risk: "Hypoglykämie-Risiko", level: "B" },
];

function generateMedicationInteraction(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const entries: DatasetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const combo = pick(MED_COMBINATIONS, rnd);
    const additionalMeds = rnd() > 0.5 ? `, zusätzlich ${pick(MED_COMBINATIONS, rnd).a}` : "";
    entries.push({
      id: `med-${String(i + 1).padStart(4, "0")}`,
      input: `Medikation prüfen: ${combo.a} + ${combo.b}${additionalMeds}`,
      output: `Warnung Stufe ${combo.level}: ${combo.risk}. Referenz: PRISCUS-2.0 / FORTA-Liste. Rücksprache mit verordnendem Arzt empfohlen, ggf. Alternativen evaluieren.`,
      confidence_hint: combo.level === "A" ? "high" : "medium",
      meta: {
        dataset: "medication-interaction",
        seed,
        tags: ["medication", `level-${combo.level}`],
      },
    });
  }
  return entries;
}

// ----------------------------- CARE REPORT GENERATION -----------------------------

function generateCareReport(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const entries: DatasetEntry[] = [];
  const keywords = [
    ["unruhig nachts", "Schlafstörung", "Orientierung zeitlich"],
    ["Sturz Zimmer", "keine Verletzung", "Vitalparameter stabil"],
    ["Wundverband gewechselt", "Sakrum Grad 2", "Granulationsgewebe"],
    ["Mobilisation Rollator", "30m gegangen", "keine Schmerzen"],
    ["Blutzucker erhöht", "250 mg/dl", "Korrekturinsulin gegeben"],
    ["Besuch Angehörige", "Gemütszustand positiv", "appetitlich gegessen"],
    ["Ablehnung Körperpflege", "validierend kommuniziert", "Teilwäsche toleriert"],
    ["Schmerzen Knie", "VAS 6", "Paracetamol verabreicht"],
    ["Fieber 38.4", "Rücksprache Hausarzt", "Urinstix unauffällig"],
    ["Dekubitusprophylaxe", "Lagerungsplan aktuell", "2h-Intervall"],
  ];
  for (let i = 0; i < count; i++) {
    const kw = pick(keywords, rnd);
    const input = `Stichworte: ${kw.join(", ")}. Bitte vollständigen Pflegebericht formulieren.`;
    const output = expandKeywords(kw, rnd);
    entries.push({
      id: `rep-${String(i + 1).padStart(4, "0")}`,
      input,
      output,
      confidence_hint: "medium",
      meta: { dataset: "care-report-generation", seed, tags: ["report-gen"] },
    });
  }
  return entries;
}

function expandKeywords(kw: string[], _rnd: () => number): string {
  return (
    `Im Verlauf der Schicht wurde beobachtet: ${kw[0]}. ${kw[1]}. ${kw[2]}. ` +
    `Pflegerische Maßnahmen wurden gemäß Expertenstandard durchgeführt. ` +
    `Dokumentation erfolgt im Pflegeverlauf, Rücksprache mit PDL wurde geführt.`
  );
}

// ----------------------------- VOICE TRANSCRIPTION CORRECTIONS -----------------------------

function generateVoiceCorrections(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const pairs: Array<[string, string]> = [
    ["dekubitus grad zwei am sakrum", "Dekubitus Grad 2 am Sakrum"],
    ["er zieht os 100 milligram", "ASS 100 mg"],
    ["bewohner hat fieber 38 komma 4", "Bewohner hat Fieber 38,4°C"],
    ["hat pris cuss", "PRISCUS"],
    ["s i s themenfeld 4", "SIS-Themenfeld 4"],
    ["vase sechs", "VAS 6"],
    ["rer 140 zu 90", "RR 140/90 mmHg"],
    ["sp o zwei 95 prozent", "SpO2 95%"],
    ["herr müller hat einen wund ver band wechsel bekommen", "Herr A. hat einen Wundverbandswechsel bekommen"],
    ["transfer bett roll stuhl mit einer person", "Transfer Bett-Rollstuhl mit 1 Person"],
    ["medikamenten gabe pünktlich keine nebenwirkungen", "Medikamentengabe pünktlich, keine Nebenwirkungen"],
    ["bz morgens 180 mg dl korrektur mit 6 i e alt insulin", "BZ morgens 180 mg/dl, Korrektur mit 6 IE Altinsulin"],
    ["glas go scale 15", "Glasgow Coma Scale 15"],
    ["tier ärztlich angeordnete maßnahmen durchgeführt", "Ärztlich angeordnete Maßnahmen durchgeführt"],
    ["exsi kose verdacht flüssig keits bilanz positiv", "Exsikkose-Verdacht, Flüssigkeitsbilanz positiv"],
  ];
  const entries: DatasetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const [raw, corrected] = pick(pairs, rnd);
    const rawWithNoise = rnd() > 0.6 ? `äh ${raw} ehm` : raw;
    entries.push({
      id: `voc-${String(i + 1).padStart(4, "0")}`,
      input: `Whisper-Transkript (roh): "${rawWithNoise}"`,
      output: corrected,
      confidence_hint: "high",
      meta: { dataset: "voice-transcription-corrections", seed, tags: ["asr-correction"] },
    });
  }
  return entries;
}

// ----------------------------- DEMENTIA VALIDATION -----------------------------

function generateDementiaValidation(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const pool: Array<{ situation: string; response: string }> = [
    {
      situation: "Bewohnerin möchte nach Hause zu ihrem verstorbenen Mann.",
      response: `Validierend antworten: „Sie vermissen Ihren Mann sehr, das spüre ich. Erzählen Sie mir von ihm?" Gefühl aufgreifen, nicht korrigieren.`,
    },
    {
      situation: "Bewohner hält Pflegekraft für seine Tochter.",
      response: `Nicht korrigieren. Rolle nutzen: „Sie denken grade an Ihre Tochter, das ist schön. Soll ich Ihnen helfen?"`,
    },
    {
      situation: "Bewohnerin ist überzeugt, dass jemand ihr Geld gestohlen hat.",
      response: `Gefühl ernst nehmen: „Es macht Ihnen Sorgen, etwas verloren zu haben. Lassen Sie uns zusammen schauen." Gemeinsam suchen, nicht widersprechen.`,
    },
    {
      situation: "Bewohner will zur Arbeit gehen, ist aber 88 Jahre alt.",
      response: `Lebensleistung würdigen: „Sie haben immer verantwortungsvoll gearbeitet. Was war Ihr Beruf?" Ablenkung über biografisch positive Erinnerung.`,
    },
    {
      situation: "Bewohnerin verweigert Körperpflege mit Aggression.",
      response: `Respektieren, Pause machen. Später mit anderer Pflegekraft oder Teilwäsche versuchen. „Ist in Ordnung, wir machen das später."`,
    },
    {
      situation: "Bewohner ruft ständig um Hilfe, ohne erkennbaren Grund.",
      response: `Präsenz geben, Hand halten, Ruhe ausstrahlen. Bedürfnis hinter dem Ruf erkunden (Durst? Einsamkeit? Schmerz?). Nicht ignorieren.`,
    },
    {
      situation: "Bewohnerin singt alte Lieder aus ihrer Kindheit.",
      response: `Mitmachen oder ruhig zuhören. Biografisch wertvoller Moment, ermutigen. „Das ist ein schönes Lied. Kennen Sie noch mehr davon?"`,
    },
    {
      situation: "Bewohner glaubt, im Krieg zu sein.",
      response: `Realitätstest nicht erzwingen. Sicherheit geben: „Hier sind Sie sicher. Ich bin bei Ihnen." Gefühl der Bedrohung anerkennen, Umgebung beruhigen.`,
    },
    {
      situation: "Bewohnerin zieht sich wiederholt aus und sucht etwas.",
      response: `Suche validieren: „Sie suchen etwas Wichtiges. Was brauchen Sie grade?" Eventuell Toilettengang, Unwohlsein. Angebot: „Soll ich helfen?"`,
    },
    {
      situation: "Bewohner schimpft auf das Essen, obwohl er es früher mochte.",
      response: `Nicht diskutieren. „Schmeckt heute nicht, oder? Möchten Sie etwas anderes probieren?" Alternative anbieten, Selbstbestimmung bewahren.`,
    },
  ];
  const entries: DatasetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const item = pick(pool, rnd);
    entries.push({
      id: `dem-${String(i + 1).padStart(4, "0")}`,
      input: `Situation: ${item.situation} Wie reagieren Sie validations-therapeutisch?`,
      output: item.response,
      confidence_hint: "high",
      meta: { dataset: "dementia-validation-prompts", seed, tags: ["validation", "dementia"] },
    });
  }
  return entries;
}

// ----------------------------- INCIDENT POSTMORTEM -----------------------------

function generateIncidentPostmortem(count: number, seed: number): DatasetEntry[] {
  const rnd = mulberry32(seed);
  const types = [
    "Sturz mit Femurfraktur",
    "Medikationsfehler (falsche Dosis)",
    "Verwechslung Bewohner bei Medikamentengabe",
    "Dekubitus-Neubildung Grad 3",
    "Beinahe-Sturz im Bad",
    "Fehlende Dokumentation bei MDK-Prüfung",
    "Ausfall Kommunikationssystem 4h",
    "Hygiene-Vorfall (unterlassene Händedesinfektion)",
    "Dehydrations-Notfall",
    "Weglauf-Situation dementer Bewohner",
  ];
  const entries: DatasetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const type = pick(types, rnd);
    const datum = `2026-${String(Math.floor(rnd() * 4) + 1).padStart(2, "0")}-${String(Math.floor(rnd() * 28) + 1).padStart(2, "0")}`;
    const inputObj = {
      datum,
      ort: `Wohnbereich ${pick(["A", "B", "C"], rnd)}`,
      typ: type,
      schwere: pick(["gering", "moderat", "schwer"], rnd),
      betroffen: "Bewohner:in (pseudonymisiert)",
      beobachtet_von: "Pflegefachkraft (pseudonymisiert)",
    };
    entries.push({
      id: `inc-${String(i + 1).padStart(4, "0")}`,
      input: `Incident-Daten: ${JSON.stringify(inputObj)}. Erstelle Postmortem-Draft.`,
      output: postmortemTemplate(type, inputObj),
      confidence_hint: "medium",
      meta: { dataset: "incident-postmortem-drafting", seed, tags: ["incident", "postmortem"] },
    });
  }
  return entries;
}

function postmortemTemplate(type: string, data: Record<string, string>): string {
  return (
    `# Postmortem: ${type}\n\n` +
    `## Zusammenfassung\nAm ${data.datum} in ${data.ort} ereignete sich folgender Vorfall: ${type}. Schweregrad: ${data.schwere}.\n\n` +
    `## Zeitlicher Ablauf\n- Erkennung: durch ${data.beobachtet_von}\n- Sofortmaßnahmen: eingeleitet gemäß SOP\n- Ärztliche Rücksprache: erfolgt\n- Angehörigeninformation: dokumentiert\n\n` +
    `## Ursachenanalyse (5-Why)\n1. Warum trat der Vorfall auf? — Prozess-/Organisations-/Umgebungsfaktor zu prüfen.\n2. Warum wurde der Risikofaktor nicht erkannt? — Assessment-Lücke?\n3. Warum war das Assessment lückenhaft? — Schulungsstand / Zeitdruck?\n4. Warum bestand Zeitdruck? — Personalsituation?\n5. Warum die Personalsituation? — strukturelle Ursachen.\n\n` +
    `## Gegenmaßnahmen\n- Kurzfristig: Nachschulung Betroffene Schicht\n- Mittelfristig: Prozess-Review, Aktualisierung SOP\n- Langfristig: Monitoring-Indikator im QM-System etablieren\n\n` +
    `## Verantwortliche\n- QMB: Review innerhalb 72h\n- PDL: Information Team\n- Heimleitung: Freigabe des Postmortems\n\n` +
    `## Lessons Learned\nPflicht-Review im nächsten Qualitätszirkel. Dokumentation zu Audit-Zwecken archiviert.`
  );
}

// ----------------------------- PUBLIC API -----------------------------

export interface DatasetSpec {
  name: DatasetName;
  count: number;
  seed: number;
}

export const DEFAULT_SPECS: DatasetSpec[] = [
  { name: "sis-classification", count: 500, seed: 1001 },
  { name: "vital-anomaly-detection", count: 300, seed: 2001 },
  { name: "medication-interaction", count: 200, seed: 3001 },
  { name: "care-report-generation", count: 400, seed: 4001 },
  { name: "voice-transcription-corrections", count: 200, seed: 5001 },
  { name: "dementia-validation-prompts", count: 150, seed: 6001 },
  { name: "incident-postmortem-drafting", count: 100, seed: 7001 },
];

export function generate(spec: DatasetSpec): DatasetEntry[] {
  switch (spec.name) {
    case "sis-classification":
      return generateSisClassification(spec.count, spec.seed);
    case "vital-anomaly-detection":
      return generateVitalAnomaly(spec.count, spec.seed);
    case "medication-interaction":
      return generateMedicationInteraction(spec.count, spec.seed);
    case "care-report-generation":
      return generateCareReport(spec.count, spec.seed);
    case "voice-transcription-corrections":
      return generateVoiceCorrections(spec.count, spec.seed);
    case "dementia-validation-prompts":
      return generateDementiaValidation(spec.count, spec.seed);
    case "incident-postmortem-drafting":
      return generateIncidentPostmortem(spec.count, spec.seed);
  }
}

export function generateAll(): Record<DatasetName, DatasetEntry[]> {
  const out: Partial<Record<DatasetName, DatasetEntry[]>> = {};
  for (const spec of DEFAULT_SPECS) {
    out[spec.name] = generate(spec);
  }
  return out as Record<DatasetName, DatasetEntry[]>;
}
