import type { StorageProvider, StorageProviderName } from "./types";
import { LocalStorageProvider } from "./providers/local";
import { logger } from "@/lib/monitoring/logger";

let cached: StorageProvider | null = null;

export async function getStorage(): Promise<StorageProvider> {
  if (cached) return cached;
  const name = (process.env.STORAGE_PROVIDER ?? "local") as StorageProviderName;
  if (name === "s3") {
    const { S3StorageProvider } = await import("./providers/s3");
    cached = new S3StorageProvider();
  } else {
    cached = new LocalStorageProvider();
  }
  logger.info("storage.provider.init", { provider: cached.name });
  return cached;
}

export function _resetStorageCache(): void {
  cached = null;
}

/** Convenience re-exports. */
export type { StorageProvider, StoredFile, PutParams, GetParams } from "./types";
export { StorageError } from "./types";
