"use client";

import { useState } from "react";
import { Copy, Check, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ExpertQuote {
  topic: string;
  quote: string;
  speaker: string;
  role: string;
}

export function QuoteBank({ quotes }: { quotes: ExpertQuote[] }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function copyQuote(idx: number, q: ExpertQuote) {
    const text = `"${q.quote}" — ${q.speaker}, ${q.role}, CareAI`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Clipboard nicht verfügbar — Fallback: Text markieren
    }
  }

  return (
    <div className="space-y-4">
      {quotes.map((q, i) => (
        <Card key={q.topic}>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Badge variant="outline">{q.topic}</Badge>
              <button
                type="button"
                onClick={() => copyQuote(i, q)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                aria-label={`Zitat zu ${q.topic} kopieren`}
              >
                {copiedIdx === i ? (
                  <>
                    <Check className="size-3.5" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Kopieren
                  </>
                )}
              </button>
            </div>
            <blockquote className="mt-4 flex gap-3 border-l-4 border-primary pl-4">
              <Quote className="size-5 shrink-0 text-primary/50" aria-hidden="true" />
              <p className="font-serif text-lg italic leading-relaxed">{q.quote}</p>
            </blockquote>
            <footer className="mt-3 text-sm">
              <span className="font-semibold">{q.speaker}</span>
              <span className="text-muted-foreground"> · {q.role}</span>
            </footer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
