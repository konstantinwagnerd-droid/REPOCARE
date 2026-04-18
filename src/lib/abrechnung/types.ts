/**
 * Abrechnungs-Typen für § 302 SGB V (DE) und § 105 SGB XI.
 *
 * Siehe docs/research/krankenkassen-abrechnung.md für Details zur Datenstruktur.
 */

/** 9-stellige Institutions-Kennzeichen (ARGE-IK vergeben). */
export type IkNumber = string & { readonly __brand: "IkNumber" };

export type AbrechnungsTyp = "SGB_V_HKP" | "SGB_XI" | "AT_LANDESSOZIAL" | "AT_OEGK";

export type NachrichtenTyp = "SLGA" | "SLLA" | "PLGA" | "PLAA" | "KOTR" | "KOST";

/** Funktionsgruppe FKT: 01 Erst-, 02 Nach-, 03 Gutschrift. */
export type FktCode = "01" | "02" | "03";

/** Eine einzelne abrechenbare Leistung einer Pflegekraft für eine:n Versicherte:n. */
export interface InvoicePosition {
  /** CareAI-interne ID der Service-Record. */
  serviceRecordId: string;
  /** Datum der Leistungserbringung (YYYY-MM-DD). */
  datum: string;
  /** Positionsnummer aus dem Leistungskatalog (z.B. "31300"). */
  positionsNr: string;
  /** Leistungsmenge (meist 1 je Einsatz, bei Woche-Pauschalen = Anzahl Wochen). */
  menge: number;
  /** Einzelpreis in Cent. */
  einzelpreisCent: number;
  /** Versicherten-Nr der Krankenkasse. */
  versichertenNr: string;
  /** Name Versicherte:r. */
  versichertenName: string;
  /** IK des Kostenträgers (Kasse). */
  kostentraegerIk: IkNumber;
  /** Freitext für besondere Hinweise. */
  hinweis?: string;
}

/** Deckblatt-Zusammenfassung einer DTA-Sendung (SLGA-Daten). */
export interface DtaHeader {
  /** Sender-IK (Pflegedienst/Heim). */
  senderIk: IkNumber;
  /** Empfänger-IK (Kasse oder Datenannahmestelle). */
  empfaengerIk: IkNumber;
  /** Eindeutige Dateinummer (fortlaufend). */
  dateiNr: number;
  /** Funktionsgruppe. */
  fkt: FktCode;
  /** Rechnungs-Nummer (bis 20 Zeichen). */
  rechnungsNr: string;
  /** Zeitraum (von/bis in YYYY-MM-DD). */
  zeitraumVon: string;
  zeitraumBis: string;
}

/** Komplette DTA-Sendung (SLGA + SLLA-Positionen). */
export interface DtaRecord {
  header: DtaHeader;
  positionen: InvoicePosition[];
  /** Errechneter Gesamt-Bruttobetrag in Cent. */
  gesamtbetragCent: number;
}

/** Parsed KOTR/KOST Rückmeldung der Kasse. */
export interface KtaRueckmeldung {
  nachrichtenTyp: "KOTR" | "KOST";
  rechnungsNr: string;
  status: "akzeptiert" | "akzeptiert_mit_hinweisen" | "teil_akzeptiert" | "abgelehnt";
  fehler: KtaFehler[];
  zahlungsBetragCent?: number;
  zahlungsDatum?: string;
}

export interface KtaFehler {
  code: string;
  feldPfad?: string;
  beschreibung: string;
  positionRef?: string;
}

/** Katalogeintrag aus dem offiziellen Positionsnummernverzeichnis. */
export interface Leistungskatalog_Eintrag {
  positionsNr: string;
  kurzBezeichnung: string;
  beschreibung: string;
  abrechnungsBasis: "pauschale" | "je_leistung" | "je_tag" | "je_woche";
  standardPreisCent?: number;
  gueltigAb: string;
  gueltigBis?: string;
  /** Zuordnung zu CareAI-Feature (z.B. "wunddoku") für automatische Abrechnungs-Vorschläge. */
  careaiTrigger?: string[];
}
