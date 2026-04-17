import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Source = "medifox" | "dan" | "vivendi" | "senso" | "csv-generic";

interface Guide {
  title: string;
  summary: string;
  steps: Array<{ title: string; body: string }>;
  fields: string[];
  pitfalls: string[];
  sampleFile?: string;
}

const GUIDES: Record<Source, Guide> = {
  medifox: {
    title: "Medifox — Export-Anleitung",
    summary:
      `Medifox ist das am weitesten verbreitete Pflege-System in DE. Der Bewohner-Export läuft über die Verwaltungs-Administration.`,
    steps: [
      {
        title: "1. Als Administrator einloggen",
        body: `Nur Benutzer:innen mit Rolle "Administration" können Massendaten exportieren. Prüfe das vorab mit deiner PDL.`,
      },
      {
        title: `2. Menüpunkt "Datei → Exportieren"`,
        body: `Im Hauptmenü den Punkt "Datei" öffnen und "Exportieren → Bewohnerstamm" wählen.`,
      },
      {
        title: "3. Export-Konfiguration",
        body: `Format "CSV (Unicode, Semikolon)" wählen. Alle Felder inkl. Stammdaten, Diagnose, Medikation und Kontakte aktivieren.`,
      },
      {
        title: "4. Zeitraum eingrenzen",
        body: `"Alle aktiven Bewohner:innen" auswählen. Für historische Daten auch "Ausgezogen" bis 12 Monate zurück mit exportieren.`,
      },
      {
        title: "5. Datei speichern",
        body: "Datei lokal als `medifox-export-YYYY-MM-DD.csv` speichern. Typische Dateigröße: 50–500 KB für Häuser unter 80 Plätzen.",
      },
    ],
    fields: [
      "Vorname, Nachname, Geburtsdatum, Geschlecht",
      "Pflegegrad, Zimmer, Einzugsdatum, Austrittsdatum",
      "Versicherungsnummer (KVNR)",
      "Hauptdiagnose, Allergien, Medikation",
      "Angehöriger, AngehoerigerTelefon, Betreuer",
      "Notizen / Freitext",
    ],
    pitfalls: [
      `ANSI statt UTF-8 kann Umlaute zerstören — immer "Unicode" wählen.`,
      "Medifox exportiert das Geburtsdatum im Format TT.MM.JJJJ — CareAI wandelt das automatisch.",
      `Einzelne Filialen exportieren Pflegegrad als "PG 3" statt "3" — wir bereinigen das.`,
    ],
    sampleFile: "medifox-beispiel.csv",
  },
  dan: {
    title: "DAN (GES.SYS / PflegePlus) — Export-Anleitung",
    summary:
      "DAN bietet zwei Export-Wege: XML (empfohlen, vollständig) oder Tab-separierte CSV. Die XML-Variante ist präziser.",
    steps: [
      {
        title: `1. Modul "Stammdaten-Verwaltung"`,
        body: `Im Hauptmenü "Stammdaten → Verwaltung" öffnen. Nur Admin-Benutzer:innen haben hier Zugriff.`,
      },
      {
        title: `2. "Datenexport" wählen`,
        body: `Rechts oben "Datenexport" klicken. Export-Typ "Bewohner komplett" markieren.`,
      },
      {
        title: "3. Format XML wählen",
        body: "XML erhält Struktur und Umlaute zuverlässig. Nur wenn das Ziel-System ausdrücklich CSV verlangt, TSV nehmen.",
      },
      {
        title: "4. Optionen",
        body: `"Inkl. Diagnosen, Medikation, Kontakte" aktivieren. "Historische Datensätze" deaktivieren (können separat importiert werden).`,
      },
      {
        title: "5. Datei speichern",
        body: "Endung `.xml`. Bei TSV: `.tsv` oder `.txt`.",
      },
    ],
    fields: [
      "VName, NName, GebDat (ISO), Geschl",
      "PGrad (1–5), Zi (Zimmer), EinzDat",
      "VersNr",
      "Diagnose, Allergie, Medikation",
      "Kontakt, KontaktTel, Vormund",
      "Bemerkung",
    ],
    pitfalls: [
      "DAN nutzt oft Kürzel (VName statt Vorname) — die Mapping-Vorlage kennt das.",
      "Bei TSV kann es Zeilenumbrüche in Notiz-Feldern geben, die Spalten zerreißen. XML ist robuster.",
      `Das Feld "PGrad" kann "0" für "nicht festgestellt" enthalten — CareAI markiert das als Warnung.`,
    ],
    sampleFile: "dan-beispiel.xml",
  },
  vivendi: {
    title: "Vivendi PD — Export-Anleitung",
    summary:
      "Vivendi (Connext) nutzt eine klare XML-Struktur mit einem Root-Element <VivendiExport> und <Klient>-Elementen je Bewohner:in.",
    steps: [
      {
        title: `1. Modul "Vivendi Admin"`,
        body: `In der Vivendi-Oberfläche oben rechts "Admin" → "Stammdaten-Export".`,
      },
      {
        title: `2. Export-Profil "Vollständig"`,
        body: `"Export-Profil: Vollständig (inkl. Medizin/Kontakte)" wählen. Profil muss ggf. erst freigeschaltet werden.`,
      },
      {
        title: "3. Zielformat XML",
        body: "XML ist Standard. CSV gibt es nur als Teil-Export und deckt Medizin/Kontakte nicht ab.",
      },
      {
        title: "4. Datei speichern",
        body: "Namensschema automatisch: `VivendiExport_YYYYMMDD.xml`.",
      },
      {
        title: "5. Prüfsumme kontrollieren",
        body: "Vivendi zeigt nach dem Export eine Prüfsumme an. In CareAI später mit der detectedFields-Anzeige abgleichen.",
      },
    ],
    fields: [
      "Vorname, Nachname, Geburtstag (DE-Format)",
      "Geschlecht (weiblich/männlich/divers)",
      "Pflegegrad, Zimmernummer, AufnahmeDatum",
      "KVNummer",
      "Diagnose, Allergien, Medikamente",
      "Bezugsperson, BezugspersonTelefon, Betreuer",
      "Freitext",
    ],
    pitfalls: [
      `Vivendi schreibt "weiblich" statt "w" — unsere Normalisierung erkennt das.`,
      "CDATA-Blöcke in Freitext-Feldern werden korrekt ausgelesen.",
      "Vivendi exportiert nicht den Anrede-Titel (Dr., Prof.) — bei Bedarf nachpflegen.",
    ],
    sampleFile: "vivendi-beispiel.xml",
  },
  senso: {
    title: "SenSo / Sensopflege — Export-Anleitung",
    summary:
      "SenSo ist schlank — der Export ist ein einziger CSV-Button. Dafür kann das Mapping je nach SenSo-Version unterschiedlich sein.",
    steps: [
      {
        title: "1. Hauptmenü → Einstellungen → Export",
        body: `"Export" taucht nur für Admin-Rollen auf. Falls nicht sichtbar: bei IT nachfragen.`,
      },
      {
        title: `2. "Klienten komplett" anklicken`,
        body: "Ein Klick startet den Download als Semikolon-CSV.",
      },
      {
        title: "3. Encoding prüfen",
        body: "SenSo exportiert manchmal Windows-1252. Wenn Umlaute kaputt aussehen: Datei in Editor öffnen, als UTF-8 neu speichern.",
      },
      {
        title: "4. Spalten-Namen sind mit `K_` prefix",
        body: "Alle Klient-Felder starten mit `K_` (z. B. `K_Vorname`). Unser Mapping-Preset erkennt das automatisch.",
      },
      {
        title: "5. Sonderexport für Archiv",
        body: "Ehemalige Bewohner:innen (>12 Monate) liegen in einem separaten Archiv-Export — bei Bedarf separat importieren.",
      },
    ],
    fields: [
      "K_Vorname, K_Nachname, K_Geburtsdatum (ISO)",
      "K_Geschlecht, K_Pflegegrad, K_Zimmer",
      "K_Aufnahme, K_Versicherung",
      "K_Diagnose, K_Allergien, K_Medikation",
      "K_Notfall, K_NotfallTel, K_Betreuer",
      "K_Notiz",
    ],
    pitfalls: [
      "Umlaute: immer prüfen. Notfalls Datei in VSCode öffnen und als UTF-8 speichern.",
      "Einige ältere Versionen setzen keinen Header — CareAI zeigt dann leere Felder.",
      `"K_Pflegegrad" kann leer sein ("noch in Begutachtung") — wir markieren als Warnung.`,
    ],
    sampleFile: "senso-beispiel.csv",
  },
  "csv-generic": {
    title: "Allgemeines CSV — Manuelles Mapping",
    summary:
      "Du hast Daten in einer eigenen Tabelle oder aus einem System, das wir noch nicht direkt unterstützen? Exportiere als CSV und nutze das manuelle Mapping.",
    steps: [
      {
        title: "1. Export aus Quell-System",
        body: `Aus Excel: "Speichern unter → CSV UTF-8 (Trennzeichen-getrennt)". Semikolon bevorzugt.`,
      },
      {
        title: "2. Erste Zeile = Spaltennamen",
        body: "Die Datei muss in Zeile 1 die Spaltennamen enthalten. Keine Leer- oder Titel-Zeilen davor.",
      },
      {
        title: "3. Ein Datensatz pro Zeile",
        body: "Keine verbundenen Zellen. Zeilenumbrüche in Feldern nur, wenn der Wert in Anführungszeichen steht.",
      },
      {
        title: "4. Pflichtfelder sicherstellen",
        body: "Mindestens Nachname + Vorname. Alles andere ist optional, aber Pflegegrad + Geburtsdatum dringend empfohlen.",
      },
      {
        title: "5. Manuelles Mapping im Wizard",
        body: "CareAI zeigt dir alle erkannten Spalten. Ordne sie per Dropdown den Zielfeldern zu.",
      },
    ],
    fields: [
      "Du definierst die Spaltennamen selbst — das Mapping macht den Rest.",
    ],
    pitfalls: [
      "Excel speichert Geburtsdatum manchmal als Zahl (44562) — in Excel vorher als Text formatieren.",
      "Kommagetrenntes CSV in deutschsprachigem Excel kann zu Problemen führen — besser Semikolon nutzen.",
      `Pflegegrad darf kein Text sein ("Pflegegrad 3") — nur die Ziffer 1–5.`,
    ],
  },
};

export default async function AnleitungPage({
  params,
}: {
  params: Promise<{ source: string }>;
}) {
  const { source } = await params;
  const guide = GUIDES[source as Source];
  if (!guide) notFound();

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <Link
        href="/admin/migration"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Migrations-Wizard
      </Link>

      <header className="space-y-3">
        <Badge variant="outline">Export-Anleitung</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">{guide.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{guide.summary}</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Schritt für Schritt</h2>
        <div className="space-y-3">
          {guide.steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Welche Felder werden exportiert?</h2>
        <Card>
          <CardContent className="p-5">
            <ul className="space-y-2">
              {guide.fields.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Häufige Stolpersteine</h2>
        <Card>
          <CardContent className="p-5">
            <ul className="space-y-2">
              {guide.pitfalls.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {guide.sampleFile && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Beispieldatei zum Testen</h2>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <FileDown className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{guide.sampleFile}</p>
                <p className="text-xs text-muted-foreground">
                  20 fiktive Bewohner:innen zum Ausprobieren des Wizards. Liegt unter
                  <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">content/migration-samples/</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return (["medifox", "dan", "vivendi", "senso", "csv-generic"] as Source[]).map((s) => ({ source: s }));
}
