import crypto from "node:crypto";

export function sha256(input: string | Buffer): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function shortHash(hash: string, len = 12) {
  return hash.slice(0, len);
}

export function signReport(params: { content: string; authorId: string; authorName: string; timestamp: Date }): string {
  const payload = JSON.stringify({
    content: params.content,
    authorId: params.authorId,
    authorName: params.authorName,
    ts: params.timestamp.toISOString(),
  });
  return sha256(payload);
}
