import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerSession } from "@/components/partner/session";
import { listCommissionsByPartner } from "@/components/partner/data";

export const metadata = { title: "Provisionen" };

function euro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function ProvisionenPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");
  const commissions = listCommissionsByPartner(session.id);
  const totalAnnual = commissions.reduce((s, c) => s + c.annualEuro, 0);
  const pending = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.firstMonthEuro, 0);

  return (
    <div className="container max-w-5xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Provisionen</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Dein Ertrag</h1>
        <p className="text-muted-foreground">
          Provisionen werden monatlich ausgezahlt, 12 Monate pro Deal ab Go-Live.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Jahres-Ertrag aller Deals</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{euro(totalAnnual)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Nächste Auszahlung</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{euro(pending)}</div>
            <div className="text-xs text-muted-foreground">1. des Folgemonats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase text-muted-foreground">Deine Rate</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{(session.commissionRate * 100).toFixed(0)} %</div>
            <div className="text-xs text-muted-foreground capitalize">{session.tier}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Einrichtung</th>
                  <th className="px-4 py-3 text-left">Deal</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">Jahres-Provision</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Noch keine Provisionen — der erste Won-Deal öffnet die Kasse.
                    </td>
                  </tr>
                )}
                {commissions.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.facilityName}</div>
                      <div className="text-xs text-muted-foreground">
                        seit {new Date(c.earnedAt).toLocaleDateString("de-DE")}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{euro(c.monthlyValue)} / Monat</td>
                    <td className="px-4 py-3 tabular-nums">{(c.rate * 100).toFixed(0)} %</td>
                    <td className="px-4 py-3 tabular-nums font-semibold text-primary">{euro(c.annualEuro)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === "paid" ? "outline" : "default"}>
                        {c.status === "paid" ? "ausgezahlt" : "offen"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-5 text-sm">
          <Wallet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <strong>Auszahlung:</strong> Monatlich jeweils am 1. Werktag auf das hinterlegte IBAN-Konto.
            SEPA, Überweisung direkt aus Wien. Rechnungen stellt ihr an CareAI GmbH,
            Umsatzsteuerfrei nach Reverse-Charge-Verfahren bei B2B-EU.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
