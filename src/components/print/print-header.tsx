import React from "react";

/**
 * Einheitlicher Kopfbereich fuer offizielle Druck-Dokumente.
 * Logo-Platzhalter links, Titel mittig, Mandanten-Block rechts.
 */
export function PrintHeader({
  title,
  subtitle,
  facilityName,
  facilityAddress,
  documentType,
  meta,
}: {
  title: string;
  subtitle?: string;
  facilityName: string;
  facilityAddress?: string;
  documentType?: string;
  meta?: Array<{ label: string; value: string }>;
}) {
  return (
    <header
      style={{
        borderBottom: "2px solid #0E6B67",
        paddingBottom: "4mm",
        marginBottom: "6mm",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "6mm",
      }}
    >
      <div style={{ flex: "0 0 auto", minWidth: "30mm" }}>
        <div
          style={{
            width: "22mm",
            height: "22mm",
            border: "1.5px solid #0E6B67",
            color: "#0E6B67",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
            fontWeight: 700,
            fontSize: "14pt",
            letterSpacing: "0.5pt",
          }}
        >
          CareAI
        </div>
      </div>

      <div style={{ flex: "1 1 auto", textAlign: "center" }}>
        {documentType ? (
          <div style={{ fontSize: "8pt", color: "#5C6664", textTransform: "uppercase", letterSpacing: "1pt" }}>
            {documentType}
          </div>
        ) : null}
        <h1
          style={{
            margin: "1mm 0",
            fontSize: "16pt",
            fontWeight: 700,
            color: "#1A1D1C",
            fontFamily: "serif",
          }}
        >
          {title}
        </h1>
        {subtitle ? <div style={{ fontSize: "10pt", color: "#333" }}>{subtitle}</div> : null}
      </div>

      <div style={{ flex: "0 0 auto", fontSize: "8pt", color: "#333", textAlign: "right", minWidth: "40mm" }}>
        <div style={{ fontWeight: 600, color: "#0E6B67" }}>{facilityName}</div>
        {facilityAddress ? <div style={{ marginTop: "0.5mm" }}>{facilityAddress}</div> : null}
        {meta && meta.length > 0 ? (
          <div style={{ marginTop: "2mm", borderTop: "1px solid #d8dedc", paddingTop: "1.5mm" }}>
            {meta.map((m) => (
              <div key={m.label} style={{ marginBottom: "0.5mm" }}>
                <span style={{ color: "#5C6664" }}>{m.label}: </span>
                <span style={{ color: "#1A1D1C" }}>{m.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
