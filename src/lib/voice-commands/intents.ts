import type { VoiceIntent } from "./types";

/**
 * 30+ Intents fuer die CareAI-Pflegesoftware.
 * Regex-basiert — keine LLM-Abhaengigkeit, alles client-seitig.
 */

// Helper — word boundaries, case-insensitive, UTF-8-friendly
const r = (pattern: string) => new RegExp(pattern, "iu");

export const intents: VoiceIntent[] = [
  // Navigation
  {
    id: "nav.dashboard",
    category: "navigation",
    description: "Zum Dashboard navigieren",
    examples: ["Dashboard", "Startseite", "Uebersicht"],
    patterns: [r("^(dashboard|startseite|uebersicht|übersicht|home)$")],
    action: () => ({ matched: true, speak: "Dashboard", navigate: "/app" }),
  },
  {
    id: "nav.residents",
    category: "navigation",
    description: "Zur Bewohner-Liste",
    examples: ["Bewohner", "Bewohnerliste", "Klienten"],
    patterns: [r("^(bewohner|bewohnerliste|klienten|patienten)(\\s?(liste|öffnen|oeffnen))?$")],
    action: () => ({ matched: true, speak: "Bewohner-Liste", navigate: "/app/residents" }),
  },
  {
    id: "nav.settings",
    category: "navigation",
    description: "Zu den Einstellungen",
    examples: ["Einstellungen", "Settings"],
    patterns: [r("^(einstellungen|settings|konfiguration)$")],
    action: () => ({ matched: true, speak: "Einstellungen", navigate: "/admin/settings" }),
  },
  {
    id: "nav.help",
    category: "navigation",
    description: "Hilfe-Seite",
    examples: ["Hilfe", "Anleitung"],
    patterns: [r("^(hilfe|anleitung|help)$")],
    action: () => ({ matched: true, speak: "Hilfe", navigate: "/help" }),
  },
  {
    id: "nav.handover",
    category: "shortcut",
    description: "Uebergabe",
    examples: ["Uebergabe", "Schichtuebergabe"],
    patterns: [r("^(ü|ue)bergabe$"), r("^schicht(ü|ue)bergabe$")],
    action: () => ({ matched: true, speak: "Uebergabe", navigate: "/app/handover" }),
  },
  {
    id: "nav.schedule",
    category: "shortcut",
    description: "Dienstplan",
    examples: ["Dienstplan"],
    patterns: [r("^dienstplan$")],
    action: () => ({ matched: true, speak: "Dienstplan", navigate: "/admin/schedule" }),
  },

  // Resident search
  {
    id: "resident.open",
    category: "resident",
    description: "Bewohner oeffnen",
    examples: ["Frau Mueller oeffnen", "Herr Gruber anzeigen"],
    patterns: [
      r("^(frau|herr)\\s+(\\p{L}+)(\\s+(öffnen|oeffnen|anzeigen|aufrufen))?$"),
      r("^bewohner(in)?\\s+(\\p{L}+)(\\s+(öffnen|oeffnen|anzeigen))?$"),
    ],
    action: (ctx) => {
      const name = ctx.groups.find((g) => g && g.length > 2 && !/öffnen|oeffnen|anzeigen|aufrufen/i.test(g));
      return {
        matched: true,
        speak: `Suche nach ${name ?? "Bewohner"}`,
        event: { type: "voice:search-resident", payload: { query: name } },
        navigate: `/app/search?q=${encodeURIComponent(name ?? "")}`,
      };
    },
  },

  // Pflegebericht
  {
    id: "report.new",
    category: "report",
    description: "Neuer Pflegebericht",
    examples: ["Neuer Bericht fuer Frau Mueller", "Bericht anlegen"],
    patterns: [
      r("^neuer\\s+bericht(\\s+f(ü|ue)r\\s+(.+))?$"),
      r("^bericht\\s+anlegen(\\s+f(ü|ue)r\\s+(.+))?$"),
    ],
    action: (ctx) => ({
      matched: true,
      speak: "Neuer Bericht wird geoeffnet",
      event: { type: "voice:new-report", payload: { for: ctx.groups[ctx.groups.length - 1] } },
    }),
  },
  {
    id: "report.finish",
    category: "report",
    description: "Bericht abschliessen",
    examples: ["Bericht abschliessen", "Bericht fertig"],
    patterns: [r("^bericht\\s+(abschlie(ss|ß)en|fertig|beenden)$")],
    action: () => ({ matched: true, speak: "Bericht abgeschlossen", event: { type: "voice:finish-report" } }),
  },
  {
    id: "report.sign",
    category: "report",
    description: "Bericht signieren",
    examples: ["Bericht signieren", "Unterschreiben"],
    patterns: [r("^(bericht\\s+)?(signieren|unterschreiben)$")],
    action: () => ({ matched: true, speak: "Signatur angefordert", event: { type: "voice:sign-report" } }),
  },

  // Vitals
  {
    id: "vital.pulse",
    category: "vital",
    description: "Puls eintragen",
    examples: ["Puls 82", "Herzfrequenz 78"],
    patterns: [r("^(puls|herzfrequenz)\\s+(\\d{2,3})$")],
    action: (ctx) => ({
      matched: true,
      speak: `Puls ${ctx.groups[1]} gespeichert`,
      event: { type: "voice:vital", payload: { kind: "pulse", value: Number(ctx.groups[1]) } },
    }),
  },
  {
    id: "vital.bp",
    category: "vital",
    description: "Blutdruck eintragen",
    examples: ["Blutdruck 130 ueber 80"],
    patterns: [r("^(blutdruck|rr)\\s+(\\d{2,3})\\s+(ü|ue)ber\\s+(\\d{2,3})$")],
    action: (ctx) => {
      const sys = Number(ctx.groups[1]);
      const dia = Number(ctx.groups[3]);
      return {
        matched: true,
        speak: `Blutdruck ${sys} zu ${dia} gespeichert`,
        event: { type: "voice:vital", payload: { kind: "bp", systolic: sys, diastolic: dia } },
      };
    },
  },
  {
    id: "vital.weight",
    category: "vital",
    description: "Gewicht eintragen",
    examples: ["Gewicht 67 Kilo", "Gewicht 72,5 Kilo"],
    patterns: [r("^gewicht\\s+(\\d{2,3}([,.]\\d+)?)\\s?(kg|kilo|kilogramm)?$")],
    action: (ctx) => {
      const kg = Number(ctx.groups[0].replace(",", "."));
      return {
        matched: true,
        speak: `Gewicht ${kg} Kilo gespeichert`,
        event: { type: "voice:vital", payload: { kind: "weight", value: kg } },
      };
    },
  },
  {
    id: "vital.temp",
    category: "vital",
    description: "Temperatur eintragen",
    examples: ["Temperatur 37,2"],
    patterns: [r("^(temperatur|fieber)\\s+(\\d{2}([,.]\\d)?)$")],
    action: (ctx) => ({
      matched: true,
      speak: `Temperatur ${ctx.groups[1]} Grad gespeichert`,
      event: { type: "voice:vital", payload: { kind: "temperature", value: Number(ctx.groups[1].replace(",", ".")) } },
    }),
  },
  {
    id: "vital.sat",
    category: "vital",
    description: "Sauerstoffsaettigung",
    examples: ["Sauerstoff 96", "SpO2 94"],
    patterns: [r("^(sauerstoff|spo2|sättigung|saettigung)\\s+(\\d{2,3})$")],
    action: (ctx) => ({
      matched: true,
      speak: `Sauerstoffsaettigung ${ctx.groups[1]} Prozent`,
      event: { type: "voice:vital", payload: { kind: "spo2", value: Number(ctx.groups[1]) } },
    }),
  },

  // Medication
  {
    id: "med.given",
    category: "medication",
    description: "Medikament bestaetigt",
    examples: ["Paracetamol gegeben", "Ramipril bestaetigt"],
    patterns: [
      r("^(\\p{L}+)\\s+(gegeben|verabreicht|best(ä|ae)tigt)$"),
      r("^(\\p{L}+)\\s+(\\d+)\\s?(mg|mcg|ml|g|ie)\\s+um\\s+(\\d{1,2})\\s+uhr\\s+best(ä|ae)tigt$"),
    ],
    action: (ctx) => ({
      matched: true,
      speak: `${ctx.groups[0]} dokumentiert`,
      event: { type: "voice:medication-given", payload: { med: ctx.groups[0] } },
    }),
  },
  {
    id: "med.refuse",
    category: "medication",
    description: "Medikament verweigert",
    examples: ["Medikament verweigert", "Paracetamol abgelehnt"],
    patterns: [r("^(\\p{L}+\\s+)?(verweigert|abgelehnt|nicht genommen)$")],
    action: (ctx) => ({
      matched: true,
      speak: "Verweigerung dokumentiert",
      event: { type: "voice:medication-refused", payload: { med: ctx.groups[0]?.trim() } },
    }),
  },

  // Massnahmen
  {
    id: "measure.done",
    category: "measure",
    description: "Massnahme erledigt",
    examples: ["Mobilisation erledigt", "Lagerung fertig"],
    patterns: [r("^(\\p{L}+)\\s+(erledigt|fertig|abgeschlossen|durchgef(ü|ue)hrt)$")],
    action: (ctx) => ({
      matched: true,
      speak: `${ctx.groups[0]} dokumentiert`,
      event: { type: "voice:measure-done", payload: { measure: ctx.groups[0] } },
    }),
  },
  {
    id: "measure.next",
    category: "measure",
    description: "Naechste Massnahme",
    examples: ["Naechste Massnahme", "Weiter"],
    patterns: [r("^(n(ä|ae)chste\\s+ma(ss|ß)nahme|weiter|n(ä|ae)chste)$")],
    action: () => ({ matched: true, speak: "Naechste Massnahme", event: { type: "voice:measure-next" } }),
  },

  // Emergency
  {
    id: "emergency.generic",
    category: "emergency",
    description: "Notfall ausloesen",
    examples: ["Notfall", "Hilfe"],
    patterns: [r("^(notfall|notruf)$")],
    action: () => ({
      matched: true,
      speak: "Notfall ausgeloest — Team wird benachrichtigt",
      event: { type: "voice:emergency" },
      navigate: "/app/emergency",
    }),
  },
  {
    id: "emergency.fall",
    category: "emergency",
    description: "Sturz melden",
    examples: ["Sturz bei Frau Mueller"],
    patterns: [r("^sturz(\\s+bei\\s+(.+))?$")],
    action: (ctx) => ({
      matched: true,
      speak: "Sturz dokumentiert, PDL informiert",
      event: { type: "voice:fall", payload: { resident: ctx.groups[1] } },
    }),
  },
  {
    id: "emergency.call-doc",
    category: "emergency",
    description: "Arzt rufen",
    examples: ["Arzt rufen", "Hausarzt anrufen"],
    patterns: [r("^(arzt|hausarzt|doktor)\\s+(rufen|anrufen|benachrichtigen)$")],
    action: () => ({
      matched: true,
      speak: "Arzt wird informiert",
      event: { type: "voice:call-doctor" },
    }),
  },

  // Shortcuts
  {
    id: "shortcut.shift-report",
    category: "shortcut",
    description: "Schichtbericht",
    examples: ["Schichtbericht"],
    patterns: [r("^schichtbericht$")],
    action: () => ({ matched: true, speak: "Schichtbericht", event: { type: "voice:shift-report" } }),
  },
  {
    id: "shortcut.search",
    category: "shortcut",
    description: "Suche oeffnen",
    examples: ["Suche", "Suchen"],
    patterns: [r("^(suche|suchen)$")],
    action: () => ({ matched: true, speak: "Suche", event: { type: "voice:open-search" } }),
  },
  {
    id: "shortcut.save",
    category: "shortcut",
    description: "Speichern",
    examples: ["Speichern", "Sichern"],
    patterns: [r("^(speichern|sichern)$")],
    action: () => ({ matched: true, speak: "Gespeichert", event: { type: "voice:save" } }),
  },
  {
    id: "shortcut.cancel",
    category: "shortcut",
    description: "Abbrechen",
    examples: ["Abbrechen", "Zurueck"],
    patterns: [r("^(abbrechen|zur(ü|ue)ck|schlie(ss|ß)en)$")],
    action: () => ({ matched: true, speak: "Abgebrochen", event: { type: "voice:cancel" } }),
  },
  {
    id: "shortcut.print",
    category: "shortcut",
    description: "Drucken",
    examples: ["Drucken"],
    patterns: [r("^drucken$")],
    action: () => ({ matched: true, speak: "Druckdialog", event: { type: "voice:print" } }),
  },
  {
    id: "shortcut.export",
    category: "shortcut",
    description: "Exportieren",
    examples: ["Export", "Exportieren"],
    patterns: [r("^(export|exportieren)$")],
    action: () => ({ matched: true, speak: "Export gestartet", event: { type: "voice:export" } }),
  },
  {
    id: "shortcut.help",
    category: "shortcut",
    description: "Voice-Tutorial",
    examples: ["Was kann ich sagen", "Voice Hilfe"],
    patterns: [r("^(was\\s+kann\\s+ich\\s+sagen|voice\\s+hilfe|befehle|kommandos)$")],
    action: () => ({ matched: true, speak: "Tutorial wird geoeffnet", event: { type: "voice:tutorial" } }),
  },
];
