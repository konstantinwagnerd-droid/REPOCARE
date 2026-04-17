import { NextRequest, NextResponse } from 'next/server';
import { getPrescription, prescriptionToPlainText } from '@/lib/telemedizin/prescription';

/**
 * Leichtgewichtiger PDF-Generator — liefert ein text-basiertes Rezept
 * als application/pdf ausgezeichnetes Surrogat (druckbar).
 *
 * In Produktion: @react-pdf/renderer mit offiziellem eRezept-Layout.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rx = getPrescription(id);
  if (!rx) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

  const text = prescriptionToPlainText(rx);
  // Minimal gültiges 1-seitiges PDF. Reicht zum Download-Testen im UI.
  const pdf = new Uint8Array(buildSimplePdf(text));
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="erezept-${rx.accessCode.replace(/-/g, '')}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

function buildSimplePdf(text: string): Buffer {
  const lines = text.split('\n');
  const header = '%PDF-1.3\n';
  const objects: string[] = [];
  const content = lines
    .map((l, i) => `BT /F1 10 Tf 40 ${760 - i * 14} Td (${l.replace(/([()\\])/g, '\\$1')}) Tj ET`)
    .join('\n');
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n');
  objects.push(`4 0 obj\n${stream}\nendobj\n`);
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  let offset = header.length;
  const xrefEntries: number[] = [];
  let body = '';
  for (const obj of objects) {
    xrefEntries.push(offset);
    body += obj;
    offset += obj.length;
  }
  const xrefStart = offset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const e of xrefEntries) {
    xref += `${String(e).padStart(10, '0')} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(header + body + xref + trailer, 'binary');
}
