/**
 * Hetzner Object Storage (S3-kompatibel).
 * Lazy-loads @aws-sdk/client-s3 — optional dep.
 */
import type { StorageProvider, PutParams, StoredFile, GetParams } from "../types";
import { StorageError } from "../types";
import { encryptBuffer, decryptBuffer } from "../encryption";

const BUCKET = process.env.S3_BUCKET ?? "";
const REGION = process.env.S3_REGION ?? "eu-central";
const ENDPOINT = process.env.S3_ENDPOINT ?? "https://fsn1.your-objectstorage.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SDK = any;

let sdk: SDK | null = null;
async function loadSDK(): Promise<SDK> {
  if (sdk) return sdk;
  try {
    // @ts-expect-error — optional peer dep
    const clientMod = await import("@aws-sdk/client-s3");
    // @ts-expect-error — optional peer dep
    const signerMod = await import("@aws-sdk/s3-request-presigner");
    sdk = { ...clientMod, ...signerMod };
    return sdk;
  } catch {
    throw new StorageError(
      "@aws-sdk/client-s3 and @aws-sdk/s3-request-presigner not installed — run `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`",
      "provider_error",
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getClient(sdk: SDK): any {
  return new sdk.S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.S3_SECRET_KEY ?? "",
    },
  });
}

export class S3StorageProvider implements StorageProvider {
  name = "s3" as const;

  async put(p: PutParams): Promise<StoredFile> {
    if (!BUCKET) throw new StorageError("S3_BUCKET missing", "provider_error");
    const sdk = await loadSDK();
    const client = getClient(sdk);
    const body = Buffer.from(p.body);
    const data = p.encrypt ? encryptBuffer(body).payload : body;
    await client.send(
      new sdk.PutObjectCommand({
        Bucket: BUCKET,
        Key: p.key,
        Body: data,
        ContentType: p.contentType,
        Metadata: {
          encrypted: p.encrypt ? "true" : "false",
          ...(p.metadata ?? {}),
        },
      }),
    );
    return {
      key: p.key,
      size: body.length,
      contentType: p.contentType,
      createdAt: new Date(),
      encrypted: !!p.encrypt,
    };
  }

  async get(p: GetParams) {
    const sdk = await loadSDK();
    const client = getClient(sdk);
    try {
      const out = await client.send(new sdk.GetObjectCommand({ Bucket: BUCKET, Key: p.key }));
      const chunks: Uint8Array[] = [];
      for await (const chunk of out.Body as AsyncIterable<Uint8Array>) chunks.push(chunk);
      let data: Buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));
      const encrypted = out.Metadata?.encrypted === "true";
      if (encrypted && p.decrypt !== false) data = decryptBuffer(data);
      return {
        body: data,
        file: {
          key: p.key,
          size: data.length,
          contentType: out.ContentType ?? "application/octet-stream",
          etag: out.ETag,
          createdAt: out.LastModified ?? new Date(),
          encrypted,
        },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/NoSuchKey|NotFound/i.test(msg)) throw new StorageError(`not found: ${p.key}`, "not_found");
      throw new StorageError(msg, "provider_error");
    }
  }

  async delete(key: string) {
    const sdk = await loadSDK();
    const client = getClient(sdk);
    await client.send(new sdk.DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  }

  async signedUrl(key: string, ttlSeconds = 600): Promise<string> {
    const sdk = await loadSDK();
    const client = getClient(sdk);
    const cmd = new sdk.GetObjectCommand({ Bucket: BUCKET, Key: key });
    return sdk.getSignedUrl(client, cmd, { expiresIn: ttlSeconds });
  }

  async list(prefix: string, max = 1000): Promise<StoredFile[]> {
    const sdk = await loadSDK();
    const client = getClient(sdk);
    const out = await client.send(
      new sdk.ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: max }),
    );
    return (out.Contents ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o: any): StoredFile => ({
        key: o.Key,
        size: o.Size ?? 0,
        contentType: "application/octet-stream",
        etag: o.ETag,
        createdAt: o.LastModified ?? new Date(),
        encrypted: false,
      }),
    );
  }
}
