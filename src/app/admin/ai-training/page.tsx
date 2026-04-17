import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export const metadata = { title: "AI-Training Datasets · CareAI" };
export const dynamic = "force-dynamic";

interface IndexEntry {
  name: string;
  file: string;
  sampleCount: number;
  sizeKb: number;
  piiFindings: number;
  piiScanPassed: boolean;
  seed: number;
  lastGenerated: string;
}

function readIndex(): IndexEntry[] {
  const path = resolve(process.cwd(), "content/ai-training/_index.json");
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf8")) as IndexEntry[];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function pickSampleLine(file: string): string | null {
  const path = resolve(process.cwd(), "content/ai-training", file);
  if (!existsSync(path)) return null;
  try {
    const content = readFileSync(path, "utf8");
    const firstLine = content.split("\n")[0];
    return firstLine || null;
  } catch {
    return null;
  }
}

export default function AiTrainingAdminPage() {
  const index = readIndex();
  const total = index.reduce((sum, e) => sum + e.sampleCount, 0);
  const totalKb = index.reduce((sum, e) => sum + e.sizeKb, 0);
  const piiTotal = index.reduce((sum, e) => sum + e.piiFindings, 0);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">AI-Training Datasets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Synthetische, DSGVO-konforme Fine-Tuning-Datasets für pflege-spezialisierte LLMs. Deterministisch generiert via Seed.
          Exportformate: HuggingFace (JSONL), OpenAI Fine-Tune, Anthropic Message-Format.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-4 gap-4">
        <Kpi label="Datasets" value={String(index.length)} />
        <Kpi label="Samples gesamt" value={total.toLocaleString("de-DE")} />
        <Kpi label="Größe gesamt" value={`${totalKb.toFixed(1)} KB`} />
        <Kpi
          label="PII-Funde"
          value={String(piiTotal)}
          variant={piiTotal === 0 ? "good" : "bad"}
        />
      </section>

      <section className="mb-8 rounded-lg border bg-card p-4">
        <h2 className="mb-3 font-semibold">Aktionen</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <code className="rounded bg-muted px-2 py-1">node src/lib/ai-training/build-datasets.mjs</code>
          <span className="text-muted-foreground">— regenerieren</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Export in OpenAI/Anthropic Format über <code>src/lib/ai-training/exporter.ts</code>.
          ZIP-Download wird im zweiten Release ergänzt.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Datasets</h2>
        <div className="space-y-3">
          {index.map((e) => {
            const sample = pickSampleLine(e.file);
            return (
              <article key={e.name} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{e.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {e.sampleCount} Samples · {e.sizeKb} KB · Seed {e.seed} · zuletzt {formatDate(e.lastGenerated)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={e.piiScanPassed ? "good" : "bad"}>
                      {e.piiScanPassed ? "PII-Scan OK" : `${e.piiFindings} PII`}
                    </Badge>
                    <Badge variant="neutral">80/10/10 Split</Badge>
                  </div>
                </div>
                {sample && (
                  <details className="mt-3 text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Beispiel-Sample ansehen</summary>
                    <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-[11px]">{sample}</pre>
                  </details>
                )}
              </article>
            );
          })}
          {index.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Keine Datasets gefunden. Bitte Generator ausführen:{" "}
              <code>node src/lib/ai-training/build-datasets.mjs</code>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, variant = "neutral" }: { label: string; value: string; variant?: "neutral" | "good" | "bad" }) {
  const color =
    variant === "good" ? "text-emerald-600" : variant === "bad" ? "text-red-600" : "text-foreground";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-serif text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode; variant: "good" | "bad" | "neutral" }) {
  const cls =
    variant === "good"
      ? "bg-emerald-100 text-emerald-800"
      : variant === "bad"
        ? "bg-red-100 text-red-800"
        : "bg-muted text-muted-foreground";
  return <span className={`rounded px-2 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}
