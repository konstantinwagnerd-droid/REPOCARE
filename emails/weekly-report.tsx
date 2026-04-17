import * as React from "react";
import { Text, Section, Button } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function WeeklyReportEmail({
  pdlName = "Pflegedienstleitung",
  weekLabel = "KW 16",
  kpis = { residents: 82, reportsWritten: 312, criticalAlerts: 3, handovers: 21 },
}: {
  pdlName?: string;
  weekLabel?: string;
  kpis?: { residents: number; reportsWritten: number; criticalAlerts: number; handovers: number };
}) {
  return (
    <Shell preview={`Wochenübersicht ${weekLabel}`}>
      <Text style={{ fontSize: 20, fontWeight: 700 }}>Wochenübersicht — {weekLabel}</Text>
      <Text>Guten Morgen {pdlName}, hier Ihre Zahlen der Woche.</Text>
      <Section style={{ margin: "16px 0" }}>
        <Text>• Bewohner: <strong>{kpis.residents}</strong></Text>
        <Text>• Berichte: <strong>{kpis.reportsWritten}</strong></Text>
        <Text>• Kritische Meldungen: <strong>{kpis.criticalAlerts}</strong></Text>
        <Text>• Übergaben: <strong>{kpis.handovers}</strong></Text>
      </Section>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href="https://app.careai.at/admin">Dashboard öffnen</Button>
      </Section>
    </Shell>
  );
}
