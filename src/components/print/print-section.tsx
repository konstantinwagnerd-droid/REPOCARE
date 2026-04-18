import React from "react";

/**
 * Thematischer Abschnitt mit H2 und einheitlichem Abstand.
 * page-break-inside wird vermieden fuer kleinere Bloecke.
 */
export function PrintSection({
  title,
  children,
  keepTogether,
}: {
  title: string;
  children: React.ReactNode;
  keepTogether?: boolean;
}) {
  return (
    <section
      style={{
        marginBottom: "5mm",
        pageBreakInside: keepTogether ? "avoid" : "auto",
        breakInside: keepTogether ? "avoid" : "auto",
      }}
    >
      <h2
        style={{
          fontSize: "11pt",
          fontWeight: 700,
          color: "#0E6B67",
          borderBottom: "1px solid #0E6B67",
          paddingBottom: "0.5mm",
          marginBottom: "2mm",
          pageBreakAfter: "avoid",
          breakAfter: "avoid",
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export function PrintKV({ items, cols = 2 }: { items: Array<{ label: string; value: React.ReactNode }>; cols?: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "2mm 6mm", fontSize: "9.5pt" }}>
      {items.map((it, i) => (
        <div key={i}>
          <span style={{ color: "#5C6664" }}>{it.label}: </span>
          <span style={{ color: "#1A1D1C", fontWeight: 500 }}>{it.value ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}
