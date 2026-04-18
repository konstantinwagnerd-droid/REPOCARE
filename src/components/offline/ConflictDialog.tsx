"use client";

// Global conflict dialog. Subscribes to emitConflict() and, when a conflict
// arrives, offers the user three choices: keep-mine | take-server | merge-both.

import { useEffect, useState } from "react";
import { onConflict, resolve as resolveConflict, type ConflictContext } from "@/lib/offline/conflicts";
import { outboxPut, outboxDelete } from "@/lib/offline/db";
import { flushQueue } from "@/lib/offline/sync";

export function ConflictDialog() {
  const [ctx, setCtx] = useState<ConflictContext | null>(null);

  useEffect(() => onConflict(setCtx), []);

  if (!ctx) return null;

  async function apply(choice: "keep-mine" | "take-server" | "merge-both") {
    if (!ctx) return;
    if (choice === "take-server") {
      await outboxDelete(ctx.entry.id);
      setCtx(null);
      return;
    }
    const merged = resolveConflict(ctx, choice);
    await outboxPut({
      ...ctx.entry,
      status: "pending",
      payload: merged,
      retries: 0,
      conflictSnapshot: undefined,
      baseVersion: ctx.serverVersion,
      updatedAt: new Date().toISOString(),
    });
    setCtx(null);
    void flushQueue();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-title"
      data-testid="conflict-dialog"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h2 id="conflict-title" className="mb-2 text-lg font-semibold">
          Synchronisations-Konflikt
        </h2>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
          Jemand hat den {ctx.entry.resource}-Eintrag inzwischen geändert. Wie möchten
          Sie fortfahren?
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => void apply("keep-mine")}
            data-testid="conflict-keep-mine"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <strong>Meine Version behalten</strong> — Server-Änderung überschreiben
          </button>
          <button
            type="button"
            onClick={() => void apply("take-server")}
            data-testid="conflict-take-server"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <strong>Server-Version übernehmen</strong> — meine Änderung verwerfen
          </button>
          <button
            type="button"
            onClick={() => void apply("merge-both")}
            data-testid="conflict-merge-both"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <strong>Kollaborativ mergen</strong> — beide Versionen kombinieren (Flag „konfliktreich")
          </button>
        </div>
      </div>
    </div>
  );
}
