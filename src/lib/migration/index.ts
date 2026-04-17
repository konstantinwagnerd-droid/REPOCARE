/**
 * Öffentliche API der Migration-Library.
 * Orchestriert Parser → Mapper → Validator → Loader → Reporter.
 */

import type {
  ImportOptions,
  ImportReport,
  MappingRule,
  MigrationSource,
  ParseResult,
  ValidationResult,
} from "./types";
import { parseGenericCsv } from "./parsers/generic-csv";
import { parseMedifox, medifoxDefaultMapping } from "./parsers/medifox";
import { parseDan, danDefaultMapping } from "./parsers/dan";
import { parseVivendi, vivendiDefaultMapping } from "./parsers/vivendi";
import { parseSenso, sensoDefaultMapping } from "./parsers/senso";
import { applyMapping } from "./mapper";
import { validateRecords } from "./validator";
import { runImport, type LoaderDeps } from "./loader";

export * from "./types";
export { formatReportText, formatReportCsv, summarizeReport } from "./reporter";
export { applyMapping, suggestMapping } from "./mapper";
export { validateRecords } from "./validator";
export { runImport } from "./loader";

export const SOURCES: Record<MigrationSource, { label: string; fileHint: string }> = {
  medifox: { label: "Medifox / Connext", fileHint: "CSV (UTF-8, Semikolon)" },
  dan: { label: "DAN (GES.SYS / PflegePlus)", fileHint: "XML oder TSV" },
  vivendi: { label: "Vivendi PD", fileHint: "XML (Vivendi-Export)" },
  senso: { label: "SenSo / Sensopflege", fileHint: "CSV (Semikolon)" },
  "csv-generic": { label: "Allgemeines CSV", fileHint: "CSV — manuelles Mapping" },
};

export function parseBySource(source: MigrationSource, text: string): ParseResult {
  switch (source) {
    case "medifox":
      return parseMedifox(text);
    case "dan":
      return parseDan(text);
    case "vivendi":
      return parseVivendi(text);
    case "senso":
      return parseSenso(text);
    case "csv-generic":
      return { ...parseGenericCsv(text), source: "csv-generic" };
  }
}

export function defaultMappingFor(source: MigrationSource): Array<{ source: string; target: string }> {
  switch (source) {
    case "medifox":
      return medifoxDefaultMapping;
    case "dan":
      return danDefaultMapping;
    case "vivendi":
      return vivendiDefaultMapping;
    case "senso":
      return sensoDefaultMapping;
    case "csv-generic":
      return [];
  }
}

/**
 * End-to-End-Orchestrator: nimmt rohen Text, Source + Mapping entgegen
 * und liefert Parse+Validation (ohne DB-Write) zurück.
 */
export function parseAndValidate(
  source: MigrationSource,
  text: string,
  rules: MappingRule[],
): {
  parse: ParseResult;
  validation: ValidationResult;
  mapped: ReturnType<typeof applyMapping>["mapped"];
} {
  const parse = parseBySource(source, text);
  const { mapped, errors: mapErrors } = applyMapping(parse.records, rules);
  const validation = validateRecords(mapped);
  validation.errors.push(...mapErrors);
  return { parse, validation, mapped };
}

export async function runFullImport(
  source: MigrationSource,
  text: string,
  rules: MappingRule[],
  opts: Omit<ImportOptions, "source" | "rules"> & { deps?: LoaderDeps },
): Promise<ImportReport> {
  const { mapped } = parseAndValidate(source, text, rules);
  const { deps, ...rest } = opts;
  return runImport(mapped, { ...rest, source, rules }, deps ?? {});
}
