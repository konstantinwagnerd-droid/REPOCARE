import React from "react";

/**
 * Fuss-Zeile am Dokument-Ende: Mandanten-Name + Erzeugungs-Datum + Dokument-ID.
 * Echte Seitenzahlen sind in HTML-to-Browser-Print nur via @page-margin-boxes
 * moeglich (CSS counter(page)) — hier als Hinweis: "Seite 1 von ..." wird
 * idealerweise vom Druck-Dialog automatisch gesetzt.
 */
export function PrintFooter({
  facilityName,
  generatedAt,
  documentId,
  note,
}: {
  facilityName: string;
  generatedAt?: Date;
  documentId?: string;
  note?: string;
}) {
  const dateStr = (generatedAt ?? new Date()).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <footer
      style={{
        marginTop: "10mm",
        paddingTop: "3mm",
        borderTop: "1px solid #d8dedc",
        fontSize: "7.5pt",
        color: "#5C6664",
        display: "flex",
        justifyContent: "space-between",
        gap: "6mm",
      }}
    >
      <div>
        <div>{facilityName}</div>
        {documentId ? <div>Dokument-ID: {documentId}</div> : null}
      </div>
      <div style={{ textAlign: "center", flex: 1 }}>
        {note ?? "Automatisch erstellt durch CareAI — Pflegedokumentation."}
      </div>
      <div style={{ textAlign: "right" }}>
        <div>Erstellt: {dateStr}</div>
        <div className="page-counter" style={{ marginTop: "0.5mm" }}>
          Seite <span data-page-counter>1</span>
        </div>
      </div>
    </footer>
  );
}
