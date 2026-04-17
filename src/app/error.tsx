"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw, LayoutDashboard } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ level: "error", msg: "global_error", digest: error.digest, message: error.message }));
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[70vh] flex-col items-center justify-center gap-5 p-8 text-center">
      <div aria-hidden className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-destructive/10 blur-2xl" />
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive motion-safe:animate-[pulse_3s_ease-in-out_infinite]">
          <AlertTriangle className="h-10 w-10" strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Etwas ist schiefgelaufen.</h1>
      <p className="max-w-md text-base text-muted-foreground">
        Unsere Techniker wurden automatisch informiert. Bitte versuchen Sie es in einem Moment erneut.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <RotateCw className="h-4 w-4" /> Erneut versuchen
        </button>
        <a href="/app" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          <LayoutDashboard className="h-4 w-4" /> Zum Dashboard
        </a>
      </div>
      {error.digest ? <p className="text-xs text-muted-foreground">Fehler-ID: <code className="rounded bg-muted px-1.5 py-0.5">{error.digest}</code></p> : null}
    </div>
  );
}
