// Haupt-Generator. Deterministisch ueber `seed`, sodass die gleiche Eingabe
// stets das gleiche Dataset produziert (wichtig fuer Tests/Demos).

import type {
  SampleBewohner, SampleBericht, SampleDataset, SampleMassnahme, SampleMedikation,
  SampleSIS, SampleVitalwert, SampleWunde, SampleWundeSnapshot, DatasetStats,
  Geschlecht, Pflegegrad,
} from "./types";
import { VORNAMEN_MAENNLICH, VORNAMEN_WEIBLICH, NACHNAMEN, STATIONEN, ZIMMER_NUMMERN } from "./names";
import { ALTER_VERTEILUNG, GESCHLECHT_VERTEILUNG, HERKUNFT, KONFESSIONEN, PG_VERTEILUNG } from "./demographics";
import { ALLERGIEN, DIAGNOSEN, TYPISCHE_MEDIKAMENTE } from "./diagnoses";

// ---- Mulberry32 PRNG (deterministisch, klein, schnell) ---------------------
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

class Rng {
  private r: () => number;
  constructor(seed: number) { this.r = mulberry32(seed); }
  next() { return this.r(); }
  int(min: number, max: number) { return Math.floor(this.r() * (max - min + 1)) + min; }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.r() * arr.length)]; }
  weighted<T>(items: { wert?: T; pg?: T; geschlecht?: T; range?: [number, number]; gewicht: number }[]): { wert?: T; pg?: T; geschlecht?: T; range?: [number, number] } {
    const total = items.reduce((s, i) => s + i.gewicht, 0);
    let roll = this.r() * total;
    for (const it of items) { roll -= it.gewicht; if (roll <= 0) return it; }
    return items[items.length - 1];
  }
  bool(p = 0.5) { return this.r() < p; }
}

// ---- Hilfsfunktionen --------------------------------------------------------
function isoDateOffsetDays(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function birthdateForAge(age: number, rng: Rng): string {
  const today = new Date();
  const year = today.getFullYear() - age;
  const month = rng.int(1, 12);
  const day = rng.int(1, 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const BERICHT_VORLAGEN: Record<string, string[]> = {
  pflege: [
    "Bewohner:in heute kooperativ bei der Koerperpflege. Hautzustand unauffaellig.",
    "Teilkoerperpflege mit Unterstuetzung durchgefuehrt. Mund- und Zahnpflege erfolgt.",
    "Mobilisation an die Bettkante problemlos moeglich. Keine Schmerzen geaeussert.",
    "Lagerung nach Schema durchgefuehrt. Druckstellen gepuelft, Hautpflege mit Lipoderm.",
    "Bewohner:in wirkt heute orientierter, hat eigenstaendig nach Wuenschen gefragt.",
  ],
  medizinisch: [
    "RR-Kontrolle: Werte im Zielbereich. Medikation nach Plan verabreicht.",
    "BZ-Tagesprofil unauffaellig: 112 / 154 / 138. Insulingabe nach Schema.",
    "Wunde am Steissbein: leichte Granulation, Verbandwechsel mit Hydrokolloid.",
    "Marcoumar-Spiegel im Zielbereich (INR 2,4). Naechste Kontrolle in 14 Tagen.",
    "Hausarztvisite: Medikation unveraendert. Empfehlung: Mobilisation steigern.",
  ],
  sozial: [
    "Bewohner:in nahm an der Singgruppe teil, hat sich sichtlich gefreut.",
    "Besuch der Tochter, Aufenthalt im Garten. Stimmung gehoben.",
    "Andacht in der Kapelle. Bewohner:in hat aktiv mitgebetet.",
    "Spaziergang im Innenhof, danach Lesen der Tageszeitung.",
    "Beim Mittagessen mit Tischnachbarn lebhaftes Gespraech ueber alte Zeiten.",
  ],
  ernaehrung: [
    "Mahlzeiten vollstaendig eingenommen. Trinkmenge: 1300 ml.",
    "Appetit reduziert, Kostform wurde auf passierte Kost umgestellt.",
    "Bewohner:in hat selbstaendig gegessen. Lieblingsgericht Kaiserschmarren genossen.",
    "Trinkprotokoll unter Soll (900 ml). Anreichen forciert, Saft suess gereicht.",
    "Schluckdiagnostik durchgefuehrt: Konsistenzstufe 3 weiterhin gut moeglich.",
  ],
  sturz: [
    "Sturzereignis im Zimmer (Zeuge: PFK). Keine Verletzungen, RR/Puls stabil.",
    "Beinahesturz beim Aufstehen — Bewohner:in konnte sich am Bettgitter halten.",
    "Sturzprophylaxe-Massnahmen aktualisiert: Niederflurbett + Bewegungsmelder.",
  ],
};

const SCHICHTEN: ("frueh" | "spaet" | "nacht")[] = ["frueh", "spaet", "nacht"];

const PFLEGEKRAEFTE = [
  "S. Huber, DGKP", "M. Mayer, PFA", "T. Bauer, DGKP", "L. Steiner, PFA",
  "C. Hofer, DGKP", "A. Wagner, PA", "K. Schmid, DGKP", "P. Lechner, PFA",
];

// ---- Bewohner --------------------------------------------------------------
function makeBewohner(id: string, rng: Rng): SampleBewohner {
  const geschlecht = (rng.weighted(GESCHLECHT_VERTEILUNG).geschlecht ?? "weiblich") as Geschlecht;
  const altersBereich = rng.weighted(ALTER_VERTEILUNG).range as [number, number];
  const alter = rng.int(altersBereich[0], altersBereich[1]);
  const pg = (rng.weighted(PG_VERTEILUNG).pg ?? 3) as Pflegegrad;
  const vorname = rng.pick(geschlecht === "weiblich" ? VORNAMEN_WEIBLICH : VORNAMEN_MAENNLICH);
  const nachname = rng.pick(NACHNAMEN);
  const station = rng.pick(STATIONEN);
  const zimmer = `${station}-${rng.pick(ZIMMER_NUMMERN)}`;
  const einzugTageZurueck = rng.int(30, 365 * 5);

  // Diagnosen ziehen (gewichtet ueber haeufigkeit)
  const diagnosen: string[] = [];
  for (const d of DIAGNOSEN) {
    if (rng.next() < d.haeufigkeit * (pg >= 3 ? 1.15 : 0.85)) {
      diagnosen.push(`${d.bezeichnung} (${d.icd10})`);
    }
  }
  // Sicherstellen: mindestens 3, maximal 12 Diagnosen
  while (diagnosen.length < 3) diagnosen.push(`${rng.pick(DIAGNOSEN).bezeichnung}`);
  diagnosen.length = Math.min(diagnosen.length, 12);

  const allergien: string[] = [];
  if (rng.bool(0.35)) allergien.push(rng.pick(ALLERGIEN));
  if (rng.bool(0.10)) allergien.push(rng.pick(ALLERGIEN));

  return {
    id,
    vorname, nachname,
    geburtsdatum: birthdateForAge(alter, rng),
    alter, geschlecht,
    zimmer, pflegegrad: pg,
    einzugsdatum: isoDateOffsetDays(einzugTageZurueck),
    diagnosen, allergien,
    bezugspflege: rng.pick(PFLEGEKRAEFTE),
    konfession: rng.weighted(KONFESSIONEN).wert as string,
    herkunftsland: rng.weighted(HERKUNFT).wert as string,
  };
}

function makeSIS(b: SampleBewohner, rng: Rng): SampleSIS {
  return {
    bewohnerId: b.id,
    letzteAktualisierung: isoDateOffsetDays(rng.int(7, 60)),
    themenfelder: {
      "Kognitive und kommunikative Faehigkeiten":
        b.diagnosen.some((d) => d.includes("Demenz"))
          ? "Mittelgradige kognitive Einschraenkung. Kurzzeitgedaechtnis stark eingeschraenkt, Langzeitgedaechtnis teils erhalten. Sprache klar, aber Wortfindungsstoerungen."
          : "Kognitiv weitgehend orientiert. Kommunikation klar und situationsgerecht moeglich.",
      "Mobilitaet":
        b.pflegegrad >= 4
          ? "Vollstaendige Uebernahme bei Transfer. Rollstuhlversorgung. Lagerungswechsel alle 3h."
          : "Mobil mit Rollator/Gehstock. Treppensteigen mit Hilfe moeglich. Sturzrisiko erhoeht.",
      "Krankheitsbezogene Anforderungen und Belastungen":
        `Hauptdiagnosen: ${b.diagnosen.slice(0, 3).join("; ")}. Regelmaessige Kontrollen erforderlich.`,
      "Selbstversorgung":
        b.pflegegrad >= 4
          ? "Komplette Uebernahme aller Verrichtungen. Mund-/Zahnpflege durch Personal."
          : "Teilweise Uebernahme: An- und Auskleiden mit Hilfe, Koerperpflege groesstenteils selbstaendig.",
      "Leben in sozialen Beziehungen":
        rng.bool(0.7)
          ? "Regelmaessiger Kontakt zu Familie. Nimmt gern an Gruppenangeboten teil."
          : "Eher zurueckgezogen. Wenig Familienkontakt. Einzelangebote sinnvoll.",
      "Haushaltsfuehrung / Lebensbereiche":
        "Im Heimkontext nicht aktiv. Selbstbestimmung bei Tagesablauf wird respektiert.",
    },
  };
}

function makeMassnahmen(b: SampleBewohner, rng: Rng): SampleMassnahme[] {
  const out: SampleMassnahme[] = [];
  const baseMassnahmen = [
    { titel: "Grundpflege", intervall: "taeglich" as const },
    { titel: "Medikamentengabe nach Plan", intervall: "taeglich" as const },
    { titel: "Vitalzeichenkontrolle", intervall: rng.bool(0.5) ? "taeglich" as const : "woechentlich" as const },
    { titel: "Mobilisation/Transfer", intervall: "taeglich" as const },
    { titel: "Sturzprophylaxe", intervall: "taeglich" as const },
  ];
  if (b.diagnosen.some((d) => d.includes("Diabetes"))) {
    baseMassnahmen.push({ titel: "BZ-Kontrolle nach Schema", intervall: "taeglich" as const });
  }
  if (b.diagnosen.some((d) => d.includes("Demenz"))) {
    baseMassnahmen.push({ titel: "10-Minuten-Aktivierung", intervall: "taeglich" as const });
  }
  if (b.diagnosen.some((d) => d.includes("Inkontinenz"))) {
    baseMassnahmen.push({ titel: "Inkontinenzversorgung", intervall: "taeglich" as const });
  }
  if (b.diagnosen.some((d) => d.includes("Dekubitus"))) {
    baseMassnahmen.push({ titel: "Lagerung nach Plan", intervall: "taeglich" as const });
    baseMassnahmen.push({ titel: "Wunddokumentation", intervall: "woechentlich" as const });
  }
  baseMassnahmen.forEach((m, i) => out.push({
    id: `${b.id}-m${i}`, bewohnerId: b.id,
    titel: m.titel, intervall: m.intervall,
    verantwortlich: rng.pick(PFLEGEKRAEFTE),
    letzteDurchfuehrung: isoDateOffsetDays(rng.int(0, 3)),
  }));
  return out;
}

function makeBerichte(b: SampleBewohner, rng: Rng, tage = 90): SampleBericht[] {
  const out: SampleBericht[] = [];
  const kategorien: ("pflege" | "medizinisch" | "sozial" | "ernaehrung" | "sturz")[] =
    ["pflege", "pflege", "pflege", "medizinisch", "sozial", "ernaehrung"];
  for (let d = 0; d < tage; d++) {
    // 1-3 Berichte pro Tag, nach PG abhaengig
    const anzahl = b.pflegegrad >= 4 ? rng.int(2, 3) : rng.int(1, 2);
    for (let i = 0; i < anzahl; i++) {
      const kat = rng.bool(0.04) ? "sturz" : rng.pick(kategorien);
      const vorlagen = BERICHT_VORLAGEN[kat];
      out.push({
        id: `${b.id}-b${d}-${i}`, bewohnerId: b.id,
        datum: isoDateOffsetDays(d),
        schicht: rng.pick(SCHICHTEN),
        autor: rng.pick(PFLEGEKRAEFTE),
        text: rng.pick(vorlagen),
        kategorie: kat,
      });
    }
  }
  return out;
}

function makeVitalwerte(b: SampleBewohner, rng: Rng, tage = 30): SampleVitalwert[] {
  const out: SampleVitalwert[] = [];
  // Basiswerte + leichte Drift
  let sys = rng.int(115, 145);
  let dia = rng.int(70, 90);
  let puls = rng.int(60, 85);
  for (let d = 0; d < tage; d++) {
    sys += rng.int(-5, 5); sys = Math.max(95, Math.min(180, sys));
    dia += rng.int(-3, 3); dia = Math.max(55, Math.min(105, dia));
    puls += rng.int(-4, 4); puls = Math.max(50, Math.min(110, puls));
    out.push({
      bewohnerId: b.id, datum: isoDateOffsetDays(d),
      systole: sys, diastole: dia, puls,
      temperatur: 36.4 + rng.next() * 0.8,
      gewichtKg: rng.bool(0.2) ? 55 + rng.int(0, 35) : undefined,
      schmerzNRS: rng.bool(0.3) ? rng.int(0, 5) : undefined,
    });
  }
  return out;
}

function makeMedikation(b: SampleBewohner, rng: Rng): SampleMedikation[] {
  const anzahl = Math.min(TYPISCHE_MEDIKAMENTE.length, b.pflegegrad >= 4 ? rng.int(8, 12) : rng.int(4, 8));
  const indices = new Set<number>();
  while (indices.size < anzahl) indices.add(rng.int(0, TYPISCHE_MEDIKAMENTE.length - 1));
  return Array.from(indices).map((i) => {
    const m = TYPISCHE_MEDIKAMENTE[i];
    return {
      bewohnerId: b.id,
      praeparat: m.praeparat, staerke: m.staerke,
      schema: rng.pick(["1-0-0-0", "1-0-1-0", "1-1-1-1", "0-0-0-1", "1-0-0-1"]),
      indikation: m.indikation,
      seit: isoDateOffsetDays(rng.int(30, 1000)),
    };
  });
}

const WUND_LOKALISATIONEN = [
  "Steissbein (Sakrum)", "Ferse links", "Ferse rechts",
  "Trochanter major links", "Trochanter major rechts",
  "Unterschenkel links (Ulcus cruris venosum)", "Sitzbein",
];

function makeWunden(b: SampleBewohner, rng: Rng): SampleWunde[] {
  const hatWunde = rng.next() < (b.pflegegrad >= 4 ? 0.32 : b.pflegegrad >= 3 ? 0.14 : 0.04);
  if (!hatWunde) return [];
  const anzahl = rng.bool(0.85) ? 1 : 2;
  const out: SampleWunde[] = [];
  for (let w = 0; w < anzahl; w++) {
    const tageVerlauf = rng.int(21, 84);
    const startGrad = rng.int(2, 4) as 2 | 3 | 4;
    const heilend = rng.bool(0.65);
    const snapshots: SampleWundeSnapshot[] = [];
    let laenge = rng.int(15, 50), breite = rng.int(10, 35), tiefe = rng.int(2, 12);
    let grad: 1 | 2 | 3 | 4 = startGrad;
    for (let s = 0; s <= tageVerlauf; s += 7) {
      // Heilung verbessert Werte; Verschlechterung umgekehrt
      if (heilend) {
        laenge = Math.max(2, laenge - rng.int(0, 4));
        breite = Math.max(2, breite - rng.int(0, 3));
        tiefe = Math.max(0, tiefe - rng.int(0, 2));
        if (s > tageVerlauf * 0.6 && grad > 1) grad = (grad - 1) as 1 | 2 | 3 | 4;
      } else {
        laenge += rng.int(-1, 3); breite += rng.int(-1, 2); tiefe += rng.int(-1, 1);
      }
      snapshots.push({
        datum: isoDateOffsetDays(tageVerlauf - s),
        grad: grad as 1 | 2 | 3 | 4,
        laengeMm: laenge, breiteMm: breite, tiefeMm: Math.max(0, tiefe),
        exsudat: rng.pick(["kein", "gering", "mittel", "stark"]),
        notiz: heilend
          ? rng.pick([
            "Granulation deutlich, Wundrand sauber.",
            "Epithelisierung beginnt am Rand.",
            "Wunde ruhig, kein Geruch, kein Belag.",
          ])
          : rng.pick([
            "Belag leicht gelblich, Reinigung mit Prontosan.",
            "Geringer Exsudat, Verband haelt 48h.",
            "Wundumgebung gerei, Hautschutz aufgetragen.",
          ]),
        fotoPlatzhalter: `wound-${b.id}-${w}-${s}.jpg`,
      });
    }
    out.push({
      id: `${b.id}-w${w}`, bewohnerId: b.id,
      lokalisation: rng.pick(WUND_LOKALISATIONEN),
      ersterkennung: snapshots[snapshots.length - 1].datum,
      abgeschlossenAm: heilend && grad === 1 ? snapshots[0].datum : undefined,
      snapshots: snapshots.reverse(), // chronologisch alt -> neu
    });
  }
  return out;
}

// ---- Hauptfunktion ---------------------------------------------------------
export function generateDataset(opts: {
  anzahl: number;
  seed: number;
  szenarioId: string;
  berichteTage?: number;
  vitalTage?: number;
}): SampleDataset {
  const rng = new Rng(opts.seed);
  const ds: SampleDataset = {
    bewohner: [], sis: [], massnahmen: [], berichte: [], vitalwerte: [], medikation: [], wunden: [],
    meta: {
      generiertAm: new Date().toISOString(),
      seed: opts.seed,
      szenarioId: opts.szenarioId,
      anzahlBewohner: opts.anzahl,
    },
  };
  for (let i = 0; i < opts.anzahl; i++) {
    const id = `BW-${String(i + 1).padStart(4, "0")}`;
    const b = makeBewohner(id, rng);
    ds.bewohner.push(b);
    ds.sis.push(makeSIS(b, rng));
    ds.massnahmen.push(...makeMassnahmen(b, rng));
    ds.berichte.push(...makeBerichte(b, rng, opts.berichteTage ?? 90));
    ds.vitalwerte.push(...makeVitalwerte(b, rng, opts.vitalTage ?? 30));
    ds.medikation.push(...makeMedikation(b, rng));
    ds.wunden.push(...makeWunden(b, rng));
  }
  return ds;
}

// ---- Statistik -------------------------------------------------------------
export function computeStats(ds: SampleDataset): DatasetStats {
  const altersGruppen: Record<string, number> = {
    "65-74": 0, "75-79": 0, "80-84": 0, "85-89": 0, "90-94": 0, "95+": 0,
  };
  const pgZ: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const gz: Record<string, number> = { weiblich: 0, maennlich: 0, divers: 0 };
  const diagZ: Record<string, number> = {};
  let mitWunden = 0;
  for (const b of ds.bewohner) {
    if (b.alter < 75) altersGruppen["65-74"]++;
    else if (b.alter < 80) altersGruppen["75-79"]++;
    else if (b.alter < 85) altersGruppen["80-84"]++;
    else if (b.alter < 90) altersGruppen["85-89"]++;
    else if (b.alter < 95) altersGruppen["90-94"]++;
    else altersGruppen["95+"]++;
    pgZ[b.pflegegrad]++;
    gz[b.geschlecht]++;
    for (const d of b.diagnosen) {
      const key = d.split(" (")[0];
      diagZ[key] = (diagZ[key] ?? 0) + 1;
    }
  }
  for (const w of ds.wunden) {
    mitWunden++;
    void w;
  }
  // distinct bewohner mit wunden:
  mitWunden = new Set(ds.wunden.map((w) => w.bewohnerId)).size;
  const topDiagnosen = Object.entries(diagZ)
    .map(([diagnose, anzahl]) => ({ diagnose, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl)
    .slice(0, 10);
  const n = Math.max(1, ds.bewohner.length);
  return {
    anzahlBewohner: ds.bewohner.length,
    altersverteilung: Object.entries(altersGruppen).map(([gruppe, anzahl]) => ({ gruppe, anzahl })),
    pgVerteilung: ([1, 2, 3, 4, 5] as const).map((pg) => ({ pg, anzahl: pgZ[pg] })),
    geschlechtVerteilung: (["weiblich", "maennlich", "divers"] as const).map((g) => ({ geschlecht: g, anzahl: gz[g] })),
    durchschnittBerichteProBewohner: Math.round((ds.berichte.length / n) * 10) / 10,
    durchschnittDiagnosenProBewohner: Math.round((ds.bewohner.reduce((s, b) => s + b.diagnosen.length, 0) / n) * 10) / 10,
    anteilMitWunden: Math.round((mitWunden / n) * 1000) / 1000,
    topDiagnosen,
  };
}
