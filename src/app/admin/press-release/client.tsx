"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generatePressRelease } from "@/lib/press-release/generator";
import { defaultBoilerplate, defaultContact } from "@/lib/press-release/templates";
import type { Template, TemplateId } from "@/lib/press-release/types";
import { toast } from "sonner";
import { Download, Copy, FileText, Check, X } from "lucide-react";

type Props = { templates: Template[] };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PressReleaseClient({ templates }: Props) {
  const [activeId, setActiveId] = useState<TemplateId>(templates[0].id);
  const active = useMemo(
    () => templates.find((t) => t.id === activeId)!,
    [templates, activeId],
  );

  const [values, setValues] = useState<Record<string, string>>({});

  // Re-seed defaults when template changes (but keep re-usable fields)
  useEffect(() => {
    setValues((prev) => ({
      dateline: prev.dateline ?? todayISO(),
      location: prev.location ?? "Wien",
      boilerplate: prev.boilerplate ?? defaultBoilerplate,
      contact: prev.contact ?? defaultContact,
      quote: prev.quote ?? "",
      quoteAuthor: prev.quoteAuthor ?? "Konstantin Wagner, Gründer & CEO",
    }));
  }, [activeId]);

  const result = useMemo(
    () => generatePressRelease({ templateId: activeId, values }),
    [activeId, values],
  );

  function update(key: string, v: string) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(result.markdown);
    toast.success("Markdown in Zwischenablage kopiert");
  }

  function downloadMarkdown() {
    const blob = new Blob([result.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pm-${activeId}-${todayISO()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Template-Auswahl */}
      <div className="flex flex-wrap gap-2">
        {templates.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={t.id === activeId ? "default" : "outline"}
            onClick={() => setActiveId(t.id)}
          >
            {t.title}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h2 className="font-semibold">{active.title}</h2>
              <p className="text-sm text-muted-foreground">{active.description}</p>
            </div>

            {active.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`f-${f.key}`}>
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </Label>
                {f.type === "textarea" || f.type === "quote" ? (
                  <Textarea
                    id={`f-${f.key}`}
                    rows={f.type === "quote" ? 3 : 4}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={`f-${f.key}`}
                    type={f.type === "date" ? "date" : "text"}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                )}
                {f.help && (
                  <p className="text-xs text-muted-foreground">{f.help}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preview + Quality */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Live-Preview
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {result.quality.wordCount} Wörter
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyMarkdown}>
                    <Copy className="w-4 h-4 mr-1" /> Kopieren
                  </Button>
                  <Button size="sm" onClick={downloadMarkdown}>
                    <Download className="w-4 h-4 mr-1" /> .md
                  </Button>
                </div>
              </div>
              <pre className="bg-muted/40 border rounded p-4 text-sm whitespace-pre-wrap font-sans max-h-[600px] overflow-auto">
                {result.markdown}
              </pre>
              <p className="text-xs text-muted-foreground">
                Hinweis: Für einen Word-Export (.docx) die Markdown-Datei in Word
                öffnen („Datei &gt; Öffnen“) oder via Pandoc konvertieren:
                <code className="ml-1">pandoc pm.md -o pm.docx</code>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Qualitäts-Score</h2>
                <Badge
                  variant={
                    result.quality.score >= 80
                      ? "success"
                      : result.quality.score >= 50
                        ? "warning"
                        : "outline"
                  }
                >
                  {result.quality.score} / 100
                </Badge>
              </div>
              <Progress value={result.quality.score} />
              <ul className="text-sm space-y-1.5">
                {result.quality.checks.map((c) => (
                  <li key={c.id} className="flex items-start gap-2">
                    {c.pass ? (
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={c.pass ? "" : "text-destructive"}>
                        {c.label}
                      </span>
                      {!c.pass && c.hint && (
                        <p className="text-xs text-muted-foreground">{c.hint}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
