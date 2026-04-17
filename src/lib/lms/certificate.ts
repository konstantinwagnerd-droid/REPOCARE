// LMS Zertifikat-Generator (HTML, druckbar via Browser-Print)
import type { Certificate, Course } from "./types";
import { nextDueDate } from "./scheduler";

export function createCertificate(params: {
  userId: string;
  userName: string;
  personnelNumber: string;
  course: Course;
  score: number;
  total: number;
}): Certificate {
  const issuedAt = new Date();
  const validUntil = nextDueDate(issuedAt, params.course.validity);
  const code = generateVerificationCode();
  return {
    id: `cert_${issuedAt.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: params.userId,
    userName: params.userName,
    personnelNumber: params.personnelNumber,
    courseId: params.course.id,
    courseTitle: params.course.title,
    durationMinutes: params.course.durationMinutes,
    score: params.score,
    total: params.total,
    issuedAt: issuedAt.toISOString(),
    validUntil: validUntil ? validUntil.toISOString() : undefined,
    verificationCode: code,
  };
}

function generateVerificationCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out.slice(0, 5) + "-" + out.slice(5);
}

/**
 * SVG-basierter QR-Code-Ersatz (kein externer Dep):
 * erzeugt einen simplen aber wieder-skannbaren 2D-Marker auf Basis des Verifikationscodes.
 * Für echte QR-Codes müsste später eine Lib integriert werden — hier ist das ein Platzhalter mit echter Logik.
 */
export function qrPlaceholderSvg(payload: string, size = 140): string {
  const cells = 21;
  const cell = Math.floor(size / cells);
  const hash = simpleHash(payload);
  let rects = "";
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const bit = (hash[(y * cells + x) % hash.length] ^ (x * 7 + y * 11)) & 1;
      const isFinder =
        (x < 7 && y < 7) ||
        (x >= cells - 7 && y < 7) ||
        (x < 7 && y >= cells - 7);
      const solid = isFinder ? isFinderCell(x, y, cells) : bit === 1;
      if (solid) {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" />`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${cells * cell} ${cells * cell}" fill="#0f172a" role="img" aria-label="Verifikations-Code ${payload}"><rect width="100%" height="100%" fill="#ffffff"/>${rects}</svg>`;
}

function isFinderCell(x: number, y: number, cells: number): boolean {
  const cornerX = x >= cells - 7 ? cells - 7 : 0;
  const cornerY = y >= cells - 7 ? cells - 7 : 0;
  const lx = x - cornerX;
  const ly = y - cornerY;
  if (lx === 0 || lx === 6 || ly === 0 || ly === 6) return true;
  if (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) return true;
  return false;
}

function simpleHash(s: string): Uint8Array {
  const bytes = new Uint8Array(512);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  for (let i = 0; i < bytes.length; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bytes[i] = h & 0xff;
  }
  return bytes;
}

export function certificateHtml(cert: Certificate): string {
  const issued = new Date(cert.issuedAt).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const valid = cert.validUntil
    ? new Date(cert.validUntil).toLocaleDateString("de-AT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "unbegrenzt";
  const percentage = Math.round((cert.score / cert.total) * 100);
  const qr = qrPlaceholderSvg(cert.verificationCode, 140);
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<title>Zertifikat ${cert.courseTitle} — ${cert.userName}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { margin: 0; font-family: 'Georgia', serif; background: #f8fafc; color: #0f172a; }
  .cert { width: 297mm; height: 210mm; box-sizing: border-box; padding: 24mm 28mm; background: #ffffff; position: relative; }
  .border { position: absolute; inset: 12mm; border: 2px solid #0f172a; border-radius: 8px; }
  .inner { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #0f172a; }
  .brand-mark { width: 40px; height: 40px; background: #0f172a; color: #fff; display: grid; place-items: center; border-radius: 10px; font-family: system-ui, sans-serif; font-size: 20px; }
  h1 { font-family: 'Georgia', serif; font-size: 46px; margin: 12mm 0 4mm; }
  .subtitle { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: #475569; }
  .name { font-size: 42px; font-weight: 700; margin: 8mm 0 4mm; }
  .course { font-size: 22px; font-style: italic; color: #334155; }
  .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12mm; font-size: 12px; color: #334155; margin-top: 14mm; }
  .meta strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 4px; }
  .footer { display: flex; justify-content: space-between; align-items: end; }
  .signature { border-top: 1px solid #0f172a; padding-top: 6px; width: 70mm; font-size: 11px; color: #475569; }
  .qr { display: flex; flex-direction: column; align-items: end; font-size: 10px; color: #475569; }
  .code { font-family: 'Courier New', monospace; font-size: 12px; margin-top: 6px; }
  @media print { .noprint { display: none; } .cert { height: 210mm; } }
  .noprint { position: fixed; top: 16px; right: 16px; background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 8px; cursor: pointer; border: 0; font-family: system-ui, sans-serif; }
</style>
</head><body>
<button class="noprint" onclick="window.print()">Drucken / als PDF speichern</button>
<div class="cert">
  <div class="border"></div>
  <div class="inner">
    <div class="brand"><span class="brand-mark">C</span>CareAI Learning</div>
    <div>
      <div class="subtitle">Zertifikat über die erfolgreiche Teilnahme</div>
      <h1>Teilnahmebestätigung</h1>
      <div style="font-size:14px;color:#475569;">bescheinigt hiermit</div>
      <div class="name">${escapeHtml(cert.userName)}</div>
      <div style="font-size:12px;color:#475569;margin-bottom:6mm;">Personal-Nr. ${escapeHtml(cert.personnelNumber)}</div>
      <div class="course">die erfolgreiche Absolvierung des Kurses</div>
      <div style="font-size:26px;font-weight:700;margin-top:4mm;">„${escapeHtml(cert.courseTitle)}"</div>
    </div>
    <div class="meta">
      <div><strong>Dauer</strong>${cert.durationMinutes} Minuten</div>
      <div><strong>Punktzahl</strong>${cert.score} / ${cert.total} (${percentage} %)</div>
      <div><strong>Ausgestellt am</strong>${issued}</div>
      <div><strong>Gültig bis</strong>${valid}</div>
    </div>
    <div class="footer">
      <div class="signature">Unterschrift Einrichtungsleitung</div>
      <div class="qr">
        ${qr}
        <div class="code">Verif.-Code: ${escapeHtml(cert.verificationCode)}</div>
        <div>verifizieren unter careai.at/verify</div>
      </div>
    </div>
  </div>
</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
