import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function WelcomeEmail({ name = "Team", orgName = "Ihre Einrichtung" }: { name?: string; orgName?: string }) {
  return (
    <Shell preview={`Willkommen bei CareAI, ${name}!`}>
      <Text style={{ fontSize: 22, fontWeight: 700 }}>Willkommen bei CareAI, {name}!</Text>
      <Text>Schön, dass Sie sich entschieden haben, {orgName} mit CareAI zu entlasten.</Text>
      <Text>In den nächsten 10 Minuten können Sie alles einrichten — wir führen Sie Schritt für Schritt durch das Onboarding.</Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href="https://app.careai.at/onboarding">Jetzt starten</Button>
      </Section>
      <Text>Fragen? Antworten Sie einfach auf diese Mail — wir sind da.</Text>
    </Shell>
  );
}
