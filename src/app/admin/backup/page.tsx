import { auth } from "@/lib/auth";
import { listBackups, getDrRuns } from "@/lib/backup/exporter";
import { listSchedules } from "@/lib/backup/scheduler";
import { BackupClient } from "./client";

export default async function BackupPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const backups = listBackups(tenantId);
  const schedules = listSchedules(tenantId);
  const drRuns = getDrRuns();
  return <BackupClient initialBackups={backups} initialSchedules={schedules} drRuns={drRuns} />;
}
