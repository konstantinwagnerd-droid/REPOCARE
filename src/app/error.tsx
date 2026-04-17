"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ level: "error", msg: "global_error", digest: error.digest, message: error.message }));
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="text-6xl">⚠️</div>
      <h1 className="text-2xl font-semibold tracking-tight">Etwas ist schiefgelaufen.</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Unsere Techniker wurden automatisch informiert. Bitte versuchen Sie es in einem Moment erneut.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Erneut versuchen
        </button>
        <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium">
          Zur Startseite
        </a>
      </div>
      {error.digest ? <p className="text-xs text-muted-foreground">Fehler-ID: {error.digest}</p> : null}
    </div>
  );
}
