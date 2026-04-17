import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerSession } from "@/components/partner/session";
import { listLeadsByPartner } from "@/components/partner/data";
import { LeadsTable } from "@/components/partner/LeadsTable";
import { NewLeadForm } from "@/components/partner/NewLeadForm";

export const metadata = { title: "Leads" };

export default async function PartnerLeadsPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");
  const leads = listLeadsByPartner(session.id);

  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Leads</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Deine Pipeline</h1>
        <p className="text-muted-foreground">
          {leads.length} Leads insgesamt. Bei Statuswechsel auf &bdquo;Won&ldquo; wird automatisch
          die Provision generiert.
        </p>
      </header>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">Neuen Lead anlegen</h2>
          <NewLeadForm />
        </CardContent>
      </Card>

      <LeadsTable initialLeads={leads} />
    </div>
  );
}
