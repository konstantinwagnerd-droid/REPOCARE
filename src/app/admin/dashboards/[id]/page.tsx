import { auth } from "@/lib/auth";
import { getDashboard, getByShareToken } from "@/lib/reports/storage";
import { notFound } from "next/navigation";
import { DashboardViewer } from "./viewer";

export default async function DashboardViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; theme?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const dashboard = getDashboard(id);

  if (!dashboard) notFound();

  if (sp.t) {
    const shared = getByShareToken(sp.t);
    if (!shared || shared.id !== id) notFound();
  } else {
    const session = await auth();
    if (!session?.user) notFound();
  }
  return <DashboardViewer dashboard={dashboard!} theme={sp.theme === "dark" ? "dark" : "light"} />;
}
