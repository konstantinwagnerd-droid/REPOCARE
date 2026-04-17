"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function ArticleFeedback({ articleSlug }: { articleSlug: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-semibold">War das hilfreich?</div>
          <div className="text-xs text-muted-foreground">
            {vote
              ? vote === "up"
                ? "Danke fuer die Rueckmeldung."
                : "Danke — wir verbessern den Artikel."
              : "Ihre Antwort hilft uns, bessere Hilfe zu schreiben."}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVote("up")}
            aria-pressed={vote === "up"}
            aria-label="Hilfreich"
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition ${
              vote === "up"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary"
            }`}
          >
            <ThumbsUp className="h-4 w-4" /> Ja
          </button>
          <button
            onClick={() => setVote("down")}
            aria-pressed={vote === "down"}
            aria-label="Nicht hilfreich"
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition ${
              vote === "down"
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border hover:bg-secondary"
            }`}
          >
            <ThumbsDown className="h-4 w-4" /> Nein
          </button>
        </div>
      </div>
      {/* Hidden reference for analytics hookup */}
      <input type="hidden" value={articleSlug} readOnly />
    </div>
  );
}
