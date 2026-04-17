import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync } from "crypto";

const ALGO = "aes-256-gcm";

function deriveKey(secret: string, salt: Buffer): Buffer {
  return scryptSync(secret, salt, 32);
}

export function encrypt(plaintext: string, secret: string): { ciphertext: string; iv: string; tag: string; salt: string } {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = deriveKey(secret, salt);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: enc.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    salt: salt.toString("base64"),
  };
}

export function decrypt(
  ciphertext: string,
  iv: string,
  tag: string,
  salt: string,
  secret: string,
): string {
  const key = deriveKey(secret, Buffer.from(salt, "base64"));
  const decipher = createDecipheriv(ALGO, key, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}

export function hashSha256(input: string): string {
  return `sha256:${createHash("sha256").update(input).digest("hex")}`;
}

export function getMasterSecret(): string {
  return process.env.CAREAI_BACKUP_SECRET || "demo-backup-secret-do-not-use-in-prod";
}
