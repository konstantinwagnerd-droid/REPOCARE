import * as React from "react";
import { Text, Section } from "@react-email/components";
import { Shell } from "./_components";

export default function AlertCriticalEmail({
  residentName = "Bewohner:in",
  reason = "Kritische Vitalparameter",
  detailsUrl = "https://app.careai.at/app/alerts",
}: {
  residentName?: string;
  reason?: string;
  detailsUrl?: string;
}) {
  return (
    <Shell preview={`Notfall: ${reason} — ${residentName}`}>
      <Text style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>Notfall-Benachrichtigung</Text>
      <Text>Ein kritisches Ereignis wurde erkannt:</Text>
      <Section
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          padding: 16,
          margin: "16px 0",
        }}
      >
        <Text style={{ margin: 0, fontWeight: 700 }}>{residentName}</Text>
        <Text style={{ margin: "4px 0 0", color: "#7F1D1D" }}>{reason}</Text>
      </Section>
      <Text>
        Bitte prüfen Sie umgehend:{" "}
        <a href={detailsUrl} style={{ color: "#0B84FF" }}>{detailsUrl}</a>
      </Text>
    </Shell>
  );
}
