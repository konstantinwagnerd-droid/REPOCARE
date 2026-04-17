import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function MagicLinkEmail({ loginUrl = "https://app.careai.at/verify" }: { loginUrl?: string }) {
  return (
    <Shell preview="Ihr Login-Link">
      <Text style={{ fontSize: 20, fontWeight: 700 }}>Anmelden bei CareAI</Text>
      <Text>Klicken Sie auf den Button, um sich sicher anzumelden — ohne Passwort.</Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href={loginUrl}>Jetzt anmelden</Button>
      </Section>
      <Text style={{ fontSize: 13, color: "#64748B" }}>Der Link ist 15 Minuten gültig.</Text>
    </Shell>
  );
}
