/**
 * Parser für KOTR/KOST-Rückmeldungen der Krankenkassen (§ 302 SGB V).
 *
 * KOTR = technische Bestätigung der DTA-Sendung
 * KOST = Zahlungsavis / Leistungs-Kosten-Aufstellung
 */

import type { KtaRueckmeldung, KtaFehler } from "./types";

const SEG_RE = /'(\r\n|\n|\r)?/;

function splitSegments(raw: string): string[] {
  return raw.split(SEG_RE).map((s) => s.trim()).filter(Boolean);
}

function parseAmountCent(dta: string): number {
  // "000000150,75" → 15075
  const [euro, cent] = dta.split(",");
  return parseInt(euro, 10) * 100 + parseInt((cent ?? "00").padEnd(2, "0"), 10);
}

function parseDate(dta: string): string {
  // "260418" → "2026-04-18"
  if (!/^\d{6}$/.test(dta)) return dta;
  return `20${dta.slice(0, 2)}-${dta.slice(2, 4)}-${dta.slice(4, 6)}`;
}

/**
 * Parst eine KTA-Rückmeldungs-Datei (KOTR oder KOST).
 */
export function parseKta(raw: string): KtaRueckmeldung {
  const segments = splitSegments(raw);
  let nachrichtenTyp: "KOTR" | "KOST" = "KOTR";
  let rechnungsNr = "";
  let status: KtaRueckmeldung["status"] = "akzeptiert";
  const fehler: KtaFehler[] = [];
  let zahlungsBetragCent: number | undefined;
  let zahlungsDatum: string | undefined;

  for (const seg of segments) {
    const parts = seg.split("+");
    const tag = parts[0];

    if (tag === "UNH") {
      const msg = parts[2]?.split(":")[0];
      if (msg === "KOTR" || msg === "KOST") nachrichtenTyp = msg;
    } else if (tag === "REC") {
      rechnungsNr = parts[2] ?? "";
    } else if (tag === "STA") {
      const code = parts[1] ?? "00";
      status =
        code === "00"
          ? "akzeptiert"
          : code === "01"
            ? "akzeptiert_mit_hinweisen"
            : code === "02"
              ? "teil_akzeptiert"
              : "abgelehnt";
    } else if (tag === "ERR" || tag === "FEH") {
      fehler.push({
        code: parts[1] ?? "",
        feldPfad: parts[2] || undefined,
        beschreibung: parts[3] ?? "",
        positionRef: parts[4] || undefined,
      });
    } else if (tag === "ZAH" || tag === "ZHT") {
      // ZAH: Zahlungs-Betrag + Datum (nur in KOST)
      if (parts[1]) zahlungsBetragCent = parseAmountCent(parts[1]);
      if (parts[2]) zahlungsDatum = parseDate(parts[2]);
    }
  }

  return { nachrichtenTyp, rechnungsNr, status, fehler, zahlungsBetragCent, zahlungsDatum };
}
