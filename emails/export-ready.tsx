import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function ExportReadyEmail({
  kind = "Bewohner-Akte",
  downloadUrl = "https://app.careai.at/exports",
  expiresAt = "in 24 Stunden",
}: {
  kind?: string;
  downloadUrl?: string;
  expiresAt?: string;
}) {
  return (
    <Shell preview={`Ihr ${kind}-Export ist bereit`}>
      <Text style={{ fontSize: 20, fontWeight: 700 }}>Export bereit: {kind}</Text>
      <Text>Ihr Download ist verfügbar. Aus Sicherheitsgründen läuft der Link {expiresAt} ab.</Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href={downloadUrl}>Jetzt herunterladen</Button>
      </Section>
    </Shell>
  );
}
