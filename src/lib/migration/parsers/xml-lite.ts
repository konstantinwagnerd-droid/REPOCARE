/**
 * Ein schlanker XML-Parser für flache Record-Strukturen.
 * Unterstützt <Element>-Listen mit Text-Children.
 * Keine externen Deps — perfekt für Bewohner:innen-Exporte.
 *
 * Nicht für komplexe XML-Dokumente mit Namespaces, Attributen oder CDATA-Sections
 * mit nested elements gedacht. Für einfache Exports aus Vivendi/DAN jedoch robust.
 */

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

/**
 * Findet alle Elemente mit dem gegebenen Tag-Namen und gibt ihre flachen Child-Text-Werte zurück.
 * Beispiel: parseSimpleXml("<root><Bewohner><Vorname>Max</Vorname></Bewohner></root>", "Bewohner")
 *   → [{ Vorname: "Max" }]
 */
export function parseSimpleXml(
  xml: string,
  recordTag: string,
): Array<Record<string, string>> {
  // CDATA-Sektionen in Platzhalter umwandeln, damit die Element-Regex sie nicht zerlegt.
  const cdatas: string[] = [];
  const withoutCdata = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) => {
    cdatas.push(content);
    return `\u0000CDATA${cdatas.length - 1}\u0000`;
  });

  const escaped = recordTag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const recordRe = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "g");
  const out: Array<Record<string, string>> = [];

  let m: RegExpExecArray | null;
  while ((m = recordRe.exec(withoutCdata))) {
    const inner = m[1];
    const record: Record<string, string> = {};
    const childRe = /<([A-Za-z_][A-Za-z0-9_\-:]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
    let c: RegExpExecArray | null;
    while ((c = childRe.exec(inner))) {
      const key = c[1];
      let val = c[2];
      // CDATA zurücksetzen
      val = val.replace(/\u0000CDATA(\d+)\u0000/g, (_, idx) => cdatas[Number(idx)] ?? "");
      val = decodeEntities(val).trim();
      record[key] = val;
    }
    out.push(record);
  }

  return out;
}
