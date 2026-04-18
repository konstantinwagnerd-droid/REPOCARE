import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, styles, brand, type BaseDocMeta } from "./pdf-base";

/**
 * Minimaler Markdown-Renderer für Legal-Dokumente.
 * Unterstützt: #, ##, ###, **bold**, Tabellen (| ... |), Listen (- / 1.), Horizontale Linien (---),
 * Absätze, Zitate (>), Inline-Code (`...`).
 * KEIN vollständiges Markdown — bewusst minimal für rechtlich kontrolliertes Rendering.
 */

type Block =
  | { kind: "h1" | "h2" | "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "hr" }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "quote"; text: string };

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === "") { i++; continue; }
    if (trimmed === "---") { blocks.push({ kind: "hr" }); i++; continue; }
    if (trimmed.startsWith("### ")) { blocks.push({ kind: "h3", text: trimmed.slice(4) }); i++; continue; }
    if (trimmed.startsWith("## ")) { blocks.push({ kind: "h2", text: trimmed.slice(3) }); i++; continue; }
    if (trimmed.startsWith("# ")) { blocks.push({ kind: "h1", text: trimmed.slice(2) }); i++; continue; }
    if (trimmed.startsWith("> ")) { blocks.push({ kind: "quote", text: trimmed.slice(2) }); i++; continue; }

    // table
    if (trimmed.startsWith("|") && lines[i + 1]?.trim().startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const head = trimmed.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim().split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      blocks.push({ kind: "table", head, rows });
      continue;
    }

    // list
    if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\. /, ""));
        i++;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    // paragraph — collect contiguous non-empty lines
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#|>|---|\||[-*] |\d+\. )/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ") });
  }
  return blocks;
}

/** Rendert inline **bold**, `code`, einfache Platzhalter. */
function renderInline(text: string, key: string): React.ReactNode {
  // Split by ** for bold; Text children won't nest bold/code perfectly but this is sufficient.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, idx) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <Text key={`${key}-b-${idx}`} style={{ fontFamily: "Helvetica-Bold" }}>
          {p.slice(2, -2)}
        </Text>
      );
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <Text key={`${key}-c-${idx}`} style={{ fontFamily: "Courier", fontSize: 9 }}>
          {p.slice(1, -1)}
        </Text>
      );
    }
    return (
      <Text key={`${key}-t-${idx}`}>{p}</Text>
    );
  });
}

function BlockView({ block, idx }: { block: Block; idx: number }) {
  const k = `b${idx}`;
  switch (block.kind) {
    case "h1":
      return (
        <Text style={[styles.h2, { fontSize: 14, marginTop: 14 }]}>{block.text}</Text>
      );
    case "h2":
      return (
        <Text style={[styles.h2, { marginTop: 12 }]}>{block.text}</Text>
      );
    case "h3":
      return (
        <Text style={[styles.h3, { marginTop: 8 }]}>{block.text}</Text>
      );
    case "hr":
      return <View style={styles.divider} />;
    case "p":
      return (
        <Text style={styles.para}>{renderInline(block.text, k)}</Text>
      );
    case "quote":
      return (
        <View style={{ borderLeft: `3 solid ${brand.primary}`, paddingLeft: 8, marginVertical: 4 }}>
          <Text style={{ color: brand.muted, fontStyle: "italic" }}>{renderInline(block.text, k)}</Text>
        </View>
      );
    case "ul":
      return (
        <View style={{ marginVertical: 4 }}>
          {block.items.map((it, j) => (
            <View key={`${k}-ul-${j}`} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ width: 12 }}>•</Text>
              <Text style={{ flex: 1 }}>{renderInline(it, `${k}-${j}`)}</Text>
            </View>
          ))}
        </View>
      );
    case "ol":
      return (
        <View style={{ marginVertical: 4 }}>
          {block.items.map((it, j) => (
            <View key={`${k}-ol-${j}`} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ width: 16 }}>{j + 1}.</Text>
              <Text style={{ flex: 1 }}>{renderInline(it, `${k}-${j}`)}</Text>
            </View>
          ))}
        </View>
      );
    case "table":
      return (
        <View style={styles.table}>
          <View style={styles.trHead}>
            {block.head.map((h, j) => (
              <Text key={`${k}-th-${j}`} style={styles.th}>{h}</Text>
            ))}
          </View>
          {block.rows.map((row, j) => (
            <View key={`${k}-tr-${j}`} style={styles.tr}>
              {row.map((c, z) => (
                <Text key={`${k}-td-${j}-${z}`} style={styles.td}>{renderInline(c, `${k}-${j}-${z}`)}</Text>
              ))}
            </View>
          ))}
        </View>
      );
  }
}

export interface LegalMdData {
  markdown: string;
  placeholders?: Record<string, string>;
}

function applyPlaceholders(md: string, ph?: Record<string, string>): string {
  if (!ph) return md;
  let out = md;
  for (const [k, v] of Object.entries(ph)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

export function LegalMarkdownDoc({ data, meta }: { data: LegalMdData; meta: BaseDocMeta }) {
  const md = applyPlaceholders(data.markdown, data.placeholders);
  const blocks = parseBlocks(md);
  return (
    <BaseDocument meta={meta}>
      {blocks.map((b, i) => (
        <BlockView key={`blk-${i}`} block={b} idx={i} />
      ))}
    </BaseDocument>
  );
}
