"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

const mrrData = [
  { month: "Q3/25", mrr: 0 },
  { month: "Okt 25", mrr: 1200 },
  { month: "Nov 25", mrr: 2400 },
  { month: "Dez 25", mrr: 3500 },
  { month: "Jan 26", mrr: 4200 },
  { month: "Feb 26", mrr: 5100 },
  { month: "Mar 26", mrr: 6100 },
  { month: "Apr 26", mrr: 7000 },
];

const userActivity = [
  { month: "Okt 25", wau: 18, mau: 24 },
  { month: "Nov 25", wau: 52, mau: 68 },
  { month: "Dez 25", wau: 78, mau: 95 },
  { month: "Jan 26", wau: 102, mau: 130 },
  { month: "Feb 26", wau: 128, mau: 162 },
  { month: "Mar 26", wau: 151, mau: 184 },
  { month: "Apr 26", wau: 172, mau: 210 },
];

export default function MetricsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Detaillierte Metrics</h1>
      <p className="mt-2 text-muted-foreground">Alle Zahlen Mock-Werte, aber aus echtem Pilot-Verlauf abgeleitet.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-serif text-xl font-semibold">MRR-Wachstum</h2>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="mrr" stroke="#0f766e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-serif text-xl font-semibold">WAU / MAU</h2>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="wau" fill="#0f766e" />
                  <Bar dataKey="mau" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { l: "Avg. Doku-Zeit / Schicht (Ist)", v: "71 Min." },
          { l: "Avg. Doku-Zeit / Schicht (Baseline)", v: "128 Min." },
          { l: "Zeitgewinn pro Schicht", v: "-45%" },
          { l: "Sessions / Tag (aktive Einrichtungen)", v: "1.240" },
          { l: "Voice-Eintraege / Tag", v: "840" },
          { l: "Korrekturrate Voice", v: "7,1%" },
          { l: "NPS Pflegekraefte", v: "+54" },
          { l: "NPS PDLs", v: "+68" },
          { l: "Support-Tickets / Woche", v: "11" },
        ].map((k) => (
          <Card key={k.l}>
            <CardContent className="p-5">
              <p className="text-xs uppercase text-muted-foreground">{k.l}</p>
              <p className="mt-1 font-serif text-2xl font-semibold">{k.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
