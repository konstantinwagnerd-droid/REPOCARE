import { getStorage } from "./client";

/** Short-lived signed URL (default 10min) — safe to hand to browser. */
export async function getSignedUrl(key: string, ttlSeconds = 600): Promise<string> {
  const s = await getStorage();
  return s.signedUrl(key, ttlSeconds);
}
