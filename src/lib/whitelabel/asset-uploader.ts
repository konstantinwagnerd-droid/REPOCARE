/**
 * Mock-Asset-Uploader: nimmt DataURL (client-seitig FileReader), validiert
 * Größe / MIME und persistiert in-memory via store.ts. Kein Blob-Storage,
 * kein S3 — das kommt erst in der Produktionsstufe.
 */

export interface UploadValidation {
  ok: boolean;
  error?: string;
  bytes: number;
  mime: string;
}

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIMES = ["image/png", "image/svg+xml", "image/jpeg", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"];

export function validateDataUrl(dataUrl: string): UploadValidation {
  if (!dataUrl.startsWith("data:")) {
    return { ok: false, error: "Kein DataURL-Format", bytes: 0, mime: "" };
  }
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return { ok: false, error: "DataURL-Format ungültig (nur base64 unterstützt)", bytes: 0, mime: "" };
  const mime = m[1];
  const bytes = Math.ceil((m[2].length * 3) / 4);
  if (!ALLOWED_MIMES.includes(mime)) return { ok: false, error: `MIME ${mime} nicht erlaubt`, bytes, mime };
  if (bytes > MAX_BYTES) return { ok: false, error: `Zu groß: ${Math.round(bytes / 1024)}kB > 2048kB`, bytes, mime };
  return { ok: true, bytes, mime };
}
