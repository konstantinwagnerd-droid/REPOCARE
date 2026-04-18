import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listEntities } from "@/lib/reports/query-builder";
import { BuilderClient } from "./client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

export default async function ReportsBuilderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const entities = listEntities();
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Report-Builder</h1>
          <p className="mt-1 text-muted-foreground">
            No-Code Query-Builder — erstelle eigene Reports ohne SQL-Kenntnisse.
          </p>
        </div>
        <Link href="/admin/reports/saved">
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" /> Gespeicherte Reports
          </Button>
        </Link>
      </div>
      <BuilderClient entities={entities} />
    </div>
  );
}
