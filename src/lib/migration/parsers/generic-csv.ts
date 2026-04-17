/**
 * Universal-CSV-Parser mit RFC-4180-lightem Verhalten.
 * Unterstützt Semikolon- und Komma-getrennte Dateien (typisch DACH).
 * Handhabt einfache Anführungszeichen ("...") und Escape durch Verdopplung ("").
 */

import type { ParsedRecord, ParseResult, ValidationError } from "../types";

export interface CsvParseOptions {
  delimiter?: "," | ";" | "\t" | "auto";
  trimHeaders?: boolean;
  skipEmptyLines?: boolean;
}

function detectDelimiter(headerLine: string): "," | ";" | "\t" {
  const counts = {
    ";": (headerLine.match(/;/g) ?? []).length,
    ",": (headerLine.match(/,/g) ?? []).length,
    "\t": (headerLine.match(/\t/g) ?? []).length,
  };
  if (counts[";"] >= counts[","] && counts[";"] >= counts["\t"]) return ";";
  if (counts["\t"] > counts[","]) return "\t";
  return ",";
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}

export function parseGenericCsv(
  text: string,
  opts: CsvParseOptions = {},
): ParseResult {
  const errors: ValidationError[] = [];
  const rawLines = text.split(/\r?\n/);
  const lines = opts.skipEmptyLines !== false
    ? rawLines.filter((l) => l.trim().length > 0)
    : rawLines;

  if (lines.length < 2) {
    return {
      source: "csv-generic",
      totalRecords: 0,
      detectedFields: [],
      records: [],
      parseErrors: [{
        row: 0,
        severity: "error",
        code: "CSV_EMPTY",
        message: "Datei enthält keine Zeilen oder nur Header.",
      }],
    };
  }

  const delimiter = opts.delimiter && opts.delimiter !== "auto"
    ? opts.delimiter
    : detectDelimiter(lines[0]);

  const headers = splitCsvLine(lines[0], delimiter).map((h) =>
    opts.trimHeaders !== false ? h.trim() : h
  );

  const records: ParsedRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i], delimiter);
    if (cols.length !== headers.length) {
      errors.push({
        row: i,
        severity: "warning",
        code: "CSV_COLUMN_COUNT",
        message: `Zeile ${i} hat ${cols.length} Spalten, erwartet ${headers.length}.`,
      });
    }
    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => {
      raw[h] = (cols[idx] ?? "").trim();
    });
    records.push({ raw, row: i });
  }

  return {
    source: "csv-generic",
    totalRecords: records.length,
    detectedFields: headers,
    records,
    parseErrors: errors,
  };
}
