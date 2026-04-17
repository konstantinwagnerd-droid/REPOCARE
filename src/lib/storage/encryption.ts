/**
 * AES-256-GCM envelope encryption for sensitive files (Wundfotos, Medikation).
 * Key quelle: STORAGE_ENCRYPTION_KEY (32 bytes hex or base64).
 */
import crypto from "node:crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.STORAGE_ENCRYPTION_KEY;
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("STORAGE_ENCRYPTION_KEY is required in production");
    }
    // Dev fallback — deterministic so reloads still read existing files.
    return crypto.createHash("sha256").update("careai-dev-fallback-key").digest();
  }
  if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, "hex");
  return Buffer.from(raw, "base64").subarray(0, 32);
}

export interface Encrypted {
  /** Binary envelope: 12-byte iv | 16-byte tag | ciphertext. */
  payload: Buffer;
}

export function encryptBuffer(plain: Buffer): Encrypted {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { payload: Buffer.concat([iv, tag, ct]) };
}

export function decryptBuffer(envelope: Buffer): Buffer {
  const key = getKey();
  const iv = envelope.subarray(0, 12);
  const tag = envelope.subarray(12, 28);
  const ct = envelope.subarray(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]);
}
