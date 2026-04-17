import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPartnerSession } from "@/components/partner/session";
import { CommissionCalculator } from "@/components/partner/CommissionCalculator";

export const metadata = { title: "Provisions-Rechner" };

export default async function RechnerPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Rechner</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Provisions-Rechner</h1>
        <p className="text-muted-foreground">
          Spiel durch, was verschiedene Deal-Größen und Frequenzen für dich bedeuten.
        </p>
      </header>
      <CommissionCalculator />
    </div>
  );
}
