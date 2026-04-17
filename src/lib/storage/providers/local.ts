/**
 * Local filesystem storage. Dev-only default.
 * Files landed under STORAGE_LOCAL_PATH (default ./storage).
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { StorageProvider, PutParams, StoredFile, GetParams } from "../types";
import { StorageError } from "../types";
import { encryptBuffer, decryptBuffer } from "../encryption";

const ROOT = process.env.STORAGE_LOCAL_PATH ?? path.resolve(process.cwd(), "storage");
const META = ".meta.json";

function safeKey(key: string): string {
  if (!/^[a-zA-Z0-9._/-]+$/.test(key) || key.includes("..")) {
    throw new StorageError("invalid key", "invalid_key");
  }
  return key;
}

async function readMeta(abs: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await fs.readFile(abs + META, "utf8"));
  } catch {
    return {};
  }
}

export class LocalStorageProvider implements StorageProvider {
  name = "local" as const;

  async put(p: PutParams): Promise<StoredFile> {
    const key = safeKey(p.key);
    const abs = path.join(ROOT, key);
    await fs.mkdir(path.dirname(abs), { recursive: true });

    const body = Buffer.from(p.body);
    const data = p.encrypt ? encryptBuffer(body).payload : body;
    await fs.writeFile(abs, data);
    const meta = {
      contentType: p.contentType,
      encrypted: !!p.encrypt,
      plainSize: body.length,
      metadata: p.metadata ?? {},
      createdAt: new Date().toISOString(),
    };
    await fs.writeFile(abs + META, JSON.stringify(meta));
    return {
      key,
      size: body.length,
      contentType: p.contentType,
      etag: crypto.createHash("md5").update(data).digest("hex"),
      createdAt: new Date(meta.createdAt),
      encrypted: meta.encrypted,
    };
  }

  async get(p: GetParams) {
    const key = safeKey(p.key);
    const abs = path.join(ROOT, key);
    let data: Buffer;
    try {
      data = await fs.readFile(abs);
    } catch {
      throw new StorageError(`not found: ${key}`, "not_found");
    }
    const meta = await readMeta(abs);
    const encrypted = !!meta.encrypted;
    const body = encrypted && p.decrypt !== false ? decryptBuffer(data) : data;
    return {
      body,
      file: {
        key,
        size: body.length,
        contentType: String(meta.contentType ?? "application/octet-stream"),
        createdAt: new Date(String(meta.createdAt ?? Date.now())),
        encrypted,
      },
    };
  }

  async delete(key: string): Promise<void> {
    const k = safeKey(key);
    const abs = path.join(ROOT, k);
    await Promise.allSettled([fs.unlink(abs), fs.unlink(abs + META)]);
  }

  async signedUrl(key: string, ttlSeconds = 600): Promise<string> {
    const k = safeKey(key);
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const sig = crypto
      .createHmac("sha256", process.env.AUTH_SECRET ?? "dev")
      .update(`${k}:${exp}`)
      .digest("hex")
      .slice(0, 32);
    return `/api/storage/local?k=${encodeURIComponent(k)}&e=${exp}&s=${sig}`;
  }

  async list(prefix: string, max = 1000): Promise<StoredFile[]> {
    const base = path.join(ROOT, prefix);
    const out: StoredFile[] = [];
    async function walk(dir: string) {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        if (out.length >= max) return;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) await walk(full);
        else if (!e.name.endsWith(META)) {
          const rel = path.relative(ROOT, full).split(path.sep).join("/");
          const stat = await fs.stat(full);
          const meta = await readMeta(full);
          out.push({
            key: rel,
            size: stat.size,
            contentType: String(meta.contentType ?? "application/octet-stream"),
            createdAt: stat.mtime,
            encrypted: !!meta.encrypted,
          });
        }
      }
    }
    await walk(base);
    return out;
  }
}
