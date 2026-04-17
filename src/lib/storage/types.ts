export type StorageProviderName = "local" | "s3";

export interface StoredFile {
  key: string;
  size: number;
  contentType: string;
  etag?: string;
  createdAt: Date;
  /** Whether body is stored AES-256-GCM encrypted. */
  encrypted: boolean;
}

export interface PutParams {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  /** If true, encrypt at rest with AES-256-GCM. Use for wound photos etc. */
  encrypt?: boolean;
  metadata?: Record<string, string>;
}

export interface GetParams {
  key: string;
  /** If true and object was encrypted, decrypt transparently. */
  decrypt?: boolean;
}

export interface StorageProvider {
  name: StorageProviderName;
  put(p: PutParams): Promise<StoredFile>;
  get(p: GetParams): Promise<{ body: Buffer; file: StoredFile }>;
  delete(key: string): Promise<void>;
  signedUrl(key: string, ttlSeconds?: number): Promise<string>;
  list(prefix: string, max?: number): Promise<StoredFile[]>;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public code: "not_found" | "provider_error" | "invalid_key" | "decrypt_failed",
  ) {
    super(message);
    this.name = "StorageError";
  }
}
