import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { sha256 } from "./hash";
import { qrDataUrl, verificationUrl } from "./qr";
import type { BaseDocMeta } from "./pdf-base";

export interface RenderOptions {
  facilityName?: string;
  facilityAddress?: string;
  title: string;
  subtitle?: string;
  recipient?: string;
  confidential?: boolean;
  watermark?: string;
}

/**
 * Rendert eine React-PDF-Komponente zu einem Buffer und erzeugt Footer-Metadaten
 * (Hash, QR-Code). Zweistufiges Vorgehen: erst Proto-Hash über Input + Seed,
 * dann Render — so bleibt der Hash deterministisch unabhängig vom PDF-Inhalt.
 */
export async function renderPdf<T>(
  Component: (props: { data: T; meta: BaseDocMeta }) => React.ReactElement,
  data: T,
  opts: RenderOptions,
): Promise<{ buffer: Buffer; hash: string; filename: string }> {
  const generatedAt = new Date();
  const seed = JSON.stringify({ title: opts.title, data, ts: generatedAt.toISOString() });
  const documentHash = sha256(seed);
  const qr = await qrDataUrl(verificationUrl(documentHash));

  const meta: BaseDocMeta = {
    facilityName: opts.facilityName ?? "CareAI Demo Einrichtung",
    facilityAddress: opts.facilityAddress,
    title: opts.title,
    subtitle: opts.subtitle,
    generatedAt,
    documentHash,
    qrDataUrl: qr,
    recipient: opts.recipient,
    confidential: opts.confidential,
    watermark: opts.watermark,
  };

  const element = React.createElement(Component as React.ComponentType<{ data: T; meta: BaseDocMeta }>, { data, meta });
  // Cast: unsere Komponenten wrappen BaseDocument, das ein <Document> zurückgibt — react-pdf
  // sieht das zur Laufzeit korrekt, der strukturelle TS-Check hier ist zu streng.
  const buffer = await renderToBuffer(element as unknown as Parameters<typeof renderToBuffer>[0]);

  const safeTitle = opts.title.replace(/[^a-z0-9äöüß\- ]/gi, "").replace(/\s+/g, "_").slice(0, 60);
  const filename = `${safeTitle}_${generatedAt.toISOString().slice(0, 10)}_${documentHash.slice(0, 8)}.pdf`;

  return { buffer, hash: documentHash, filename };
}

export function pdfResponse(buffer: Buffer, filename: string, hash: string) {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-CareAI-Hash": hash,
      "Cache-Control": "private, no-store",
    },
  });
}
