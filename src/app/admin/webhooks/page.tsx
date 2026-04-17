import { auth } from "@/lib/auth";
import { listWebhooks } from "@/lib/webhooks/queue";
import { listLogs, logStats } from "@/lib/webhooks/logger";
import { WebhooksClient } from "./client";

export default async function WebhooksPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const webhooks = listWebhooks(tenantId);
  const tenantIds = new Set(webhooks.map((w) => w.id));
  const logs = listLogs(undefined, 100).filter((l) => tenantIds.has(l.webhookId));
  const stats = logStats();
  return <WebhooksClient initialWebhooks={webhooks} initialLogs={logs} stats={stats} />;
}
