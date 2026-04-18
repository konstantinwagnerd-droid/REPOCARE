import React from "react";

/**
 * Print-optimierte Tabelle mit wiederholendem THead, page-break-inside: avoid
 * fuer jede Zeile.
 */
export function PrintTable({
  columns,
  rows,
  caption,
}: {
  columns: Array<{ key: string; label: string; width?: string; align?: "left" | "right" | "center" }>;
  rows: Array<Record<string, React.ReactNode>>;
  caption?: string;
}) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "9pt",
        pageBreakInside: "auto",
      }}
    >
      {caption ? (
        <caption style={{ captionSide: "top", fontSize: "8pt", color: "#5C6664", textAlign: "left", padding: "0 0 1mm 0" }}>
          {caption}
        </caption>
      ) : null}
      <thead style={{ display: "table-header-group" }}>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align ?? "left",
                borderBottom: "1.5px solid #0E6B67",
                padding: "1.5mm 2mm",
                fontWeight: 700,
                color: "#0E6B67",
                width: c.width,
              }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: "3mm 2mm", color: "#5C6664", fontStyle: "italic" }}>
              Keine Eintraege im Zeitraum.
            </td>
          </tr>
        ) : (
          rows.map((r, i) => (
            <tr key={i} style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align ?? "left",
                    borderBottom: "0.5px solid #d8dedc",
                    padding: "1.2mm 2mm",
                    verticalAlign: "top",
                  }}
                >
                  {r[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
