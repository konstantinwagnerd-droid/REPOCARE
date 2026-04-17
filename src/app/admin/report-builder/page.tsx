import { auth } from "@/lib/auth";
import { listDashboards } from "@/lib/reports/storage";
import { DATA_PROVIDERS } from "@/lib/reports/data-providers";
import { WIDGET_REGISTRY } from "@/lib/reports/widgets";
import { BuilderClient } from "./client";

export default async function ReportBuilderPage() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const dashboards = listDashboards(tenantId);
  const providers = DATA_PROVIDERS.map((p) => ({
    id: p.id,
    label: p.label,
    category: p.category,
    unit: p.unit,
    compatibleWidgets: p.compatibleWidgets,
  }));
  return (
    <BuilderClient
      initialDashboards={dashboards}
      providers={providers}
      widgetRegistry={WIDGET_REGISTRY}
    />
  );
}
