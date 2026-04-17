import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Cap Table — CareAI Data Room" };

const current = [
  { holder: "Konstantin Wagner (Founder)", shares: 1_000_000, pct: 100 },
];

const postSafe = [
  { holder: "Konstantin Wagner (Founder)", shares: 880_000, pct: 88, note: "Nach Conversion SAFE + 12% Team-Pool" },
  { holder: "SAFE-Investoren (pool)", shares: 100_000, pct: 10, note: "Cap 5M, 20% Discount" },
  { holder: "Employee Stock Option Pool (ESOP)", shares: 20_000, pct: 2, note: "Vesting 4J / 1J Cliff" },
];

export default function CapTablePage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Cap Table</h1>
      <p className="mt-2 text-muted-foreground">Stand heute — und projiziert nach Seed-Runde (500k SAFE).</p>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-xl font-semibold">Heute</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="px-4 py-3">Anteilseigner</th>
                  <th className="px-4 py-3">Anteile</th>
                  <th className="px-4 py-3">Prozent</th>
                </tr>
              </thead>
              <tbody>
                {current.map((c) => (
                  <tr key={c.holder}>
                    <td className="px-4 py-3">{c.holder}</td>
                    <td className="px-4 py-3">{c.shares.toLocaleString("de-DE")}</td>
                    <td className="px-4 py-3">{c.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-serif text-xl font-semibold">Projiziert (Post-SAFE-Conversion + ESOP)</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="px-4 py-3">Anteilseigner</th>
                  <th className="px-4 py-3">Anteile</th>
                  <th className="px-4 py-3">Prozent</th>
                  <th className="px-4 py-3">Anmerkung</th>
                </tr>
              </thead>
              <tbody>
                {postSafe.map((c) => (
                  <tr key={c.holder} className="border-b border-border/60">
                    <td className="px-4 py-3">{c.holder}</td>
                    <td className="px-4 py-3">{c.shares.toLocaleString("de-DE")}</td>
                    <td className="px-4 py-3">{c.pct}%</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold">Notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Founder-Vesting: 4 Jahre, 1 Jahr Cliff, rueckwirkend ab Gruendung</li>
              <li>· Anti-Dilution-Schutz fuer SAFE-Investoren: Broad-based Weighted Average</li>
              <li>· Pre-Money Cap: 5.000.000 EUR</li>
              <li>· Discount on next priced round: 20%</li>
              <li>· Pro-Rata-Rechte fuer SAFE-Holder bei Series A</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
