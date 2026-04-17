/**
 * In-memory queue with exponential backoff retry.
 * For production scale, replace internals with BullMQ (Redis) — interface stays.
 */
import type { EmailProvider, EmailSendParams, EmailSendResult } from "./types";
import { EmailError } from "./types";
import { logger } from "@/lib/monitoring/logger";

interface QueuedJob {
  id: string;
  params: EmailSendParams;
  attempts: number;
  nextAttemptAt: number;
}

const MAX_ATTEMPTS = 5;
const queue: QueuedJob[] = [];
let running = false;

function backoffMs(attempt: number): number {
  return Math.min(60_000, 1_000 * 2 ** attempt);
}

export function enqueueEmail(params: EmailSendParams): string {
  const id = params.idempotencyKey ?? `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  queue.push({ id, params, attempts: 0, nextAttemptAt: Date.now() });
  return id;
}

export async function processQueue(provider: EmailProvider): Promise<number> {
  if (running) return 0;
  running = true;
  let processed = 0;
  try {
    const now = Date.now();
    const ready = queue.filter((j) => j.nextAttemptAt <= now);
    for (const job of ready) {
      try {
        const res: EmailSendResult = await provider.send(job.params);
        logger.info("email.queue.sent", { id: job.id, providerId: res.id });
        queue.splice(queue.indexOf(job), 1);
        processed++;
      } catch (e) {
        job.attempts++;
        const err = e as EmailError;
        if (!err.retryable || job.attempts >= MAX_ATTEMPTS) {
          logger.error("email.queue.dropped", { id: job.id, reason: err.message });
          queue.splice(queue.indexOf(job), 1);
        } else {
          job.nextAttemptAt = Date.now() + backoffMs(job.attempts);
          logger.warn("email.queue.retry", { id: job.id, attempt: job.attempts, nextMs: backoffMs(job.attempts) });
        }
      }
    }
  } finally {
    running = false;
  }
  return processed;
}

export function queueStats() {
  return { depth: queue.length, running };
}
