import { runAudit } from "@/lib/a11y-audit/runner";
import { A11yAuditView } from "./view";

export const dynamic = "force-dynamic";

export default async function A11yAuditPage() {
  // Run once at render. In production add caching + history persistence.
  const result = runAudit();
  return <A11yAuditView initialResult={result} />;
}
