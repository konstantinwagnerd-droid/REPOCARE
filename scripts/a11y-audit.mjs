#!/usr/bin/env node
/**
 * Standalone A11y audit runner.
 * Usage: node scripts/a11y-audit.mjs [--json] [--html output.html]
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { writeFileSync } from "node:fs";
import path from "node:path";

// Use tsx to import TS modules at runtime
try {
  register("tsx/esm", pathToFileURL("./"));
} catch { /* tsx not required if running .js output */ }

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const htmlIdx = args.indexOf("--html");
const htmlOut = htmlIdx !== -1 ? args[htmlIdx + 1] : null;

const { runAudit } = await import("../src/lib/a11y-audit/runner.ts");
const { toMarkdown, toHtml } = await import("../src/lib/a11y-audit/reporter.ts");

const result = runAudit({ root: process.cwd() });

if (jsonOnly) {
  process.stdout.write(JSON.stringify(result, null, 2));
} else {
  process.stdout.write(toMarkdown(result));
}

if (htmlOut) {
  writeFileSync(path.resolve(htmlOut), toHtml(result), "utf8");
  process.stderr.write(`\nHTML report written to ${htmlOut}\n`);
}

process.stderr.write(`\nSummary: ${result.summary.total} violations (${result.summary.critical} critical, ${result.summary.serious} serious) in ${result.filesScanned} files.\n`);
process.exit(result.summary.critical > 0 ? 1 : 0);
