import React from "react";

export type SignatureSlot = {
  label: string;
  name?: string;
  role?: string;
  date?: string;
};

/**
 * Unterschriften-Block: Name + Linie + Rolle + Datum. Mehrere nebeneinander.
 */
export function PrintSignatures({
  slots,
  note,
}: {
  slots: SignatureSlot[];
  note?: string;
}) {
  return (
    <section
      style={{
        marginTop: "12mm",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
      className="print-signatures"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(slots.length, 3)}, 1fr)`,
          gap: "8mm",
        }}
      >
        {slots.map((s, i) => (
          <div key={i}>
            <div
              style={{
                borderBottom: "1px solid #1A1D1C",
                height: "14mm",
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "1mm",
                fontSize: "9pt",
                color: "#5C6664",
                fontStyle: "italic",
              }}
            >
              {s.name ?? ""}
            </div>
            <div style={{ fontSize: "8pt", marginTop: "1.5mm", color: "#1A1D1C" }}>
              <strong>{s.label}</strong>
              {s.role ? <span style={{ color: "#5C6664" }}> — {s.role}</span> : null}
            </div>
            <div style={{ fontSize: "8pt", color: "#5C6664", marginTop: "0.5mm" }}>
              Datum: {s.date ?? "_______________"}
            </div>
          </div>
        ))}
      </div>
      {note ? (
        <div style={{ marginTop: "4mm", fontSize: "8pt", color: "#5C6664", fontStyle: "italic" }}>
          {note}
        </div>
      ) : null}
    </section>
  );
}
