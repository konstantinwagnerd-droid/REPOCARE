"use client";

/**
 * Global Error Boundary — fängt Fehler im Root-Layout ab.
 * Muss eigenes <html>/<body> rendern (Next.js Konvention).
 * Nur aktiv in Production. Logt über captureException (Sentry + console).
 */
import { useEffect } from "react";
import { captureException } from "@/lib/observability/capture";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest, boundary: "global_error" });
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          gap: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
          Fehler — unser Team wurde informiert.
        </h1>
        <p style={{ maxWidth: 480, color: "#555" }}>
          Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es in einem
          Moment erneut. Falls der Fehler weiterhin besteht, kontaktieren Sie bitte
          den Support.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: 6,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Erneut versuchen
        </button>
        {error.digest ? (
          <p style={{ fontSize: "0.75rem", color: "#999" }}>
            Fehler-ID: <code>{error.digest}</code>
          </p>
        ) : null}
      </body>
    </html>
  );
}
