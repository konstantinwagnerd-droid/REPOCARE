import { createHmac, randomBytes } from "crypto";

export function generateSecret(): string {
  return `whsec_${randomBytes(24).toString("hex")}`;
}

export function sign(secret: string, timestamp: number, body: string): string {
  const payload = `${timestamp}.${body}`;
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return `t=${timestamp},v1=${hmac.digest("hex")}`;
}

export function verify(secret: string, signatureHeader: string, body: string, toleranceSec = 300): boolean {
  const parts = Object.fromEntries(signatureHeader.split(",").map((p) => p.split("=")));
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  return expected === v1;
}
