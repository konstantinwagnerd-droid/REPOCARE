import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function PasswordResetEmail({ resetUrl = "https://app.careai.at/reset" }: { resetUrl?: string }) {
  return (
    <Shell preview="Ihr Passwort zurücksetzen">
      <Text style={{ fontSize: 20, fontWeight: 700 }}>Passwort zurücksetzen</Text>
      <Text>Sie (oder jemand anderes) haben eine Passwort-Rücksetzung angefordert.</Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href={resetUrl}>Neues Passwort setzen</Button>
      </Section>
      <Text style={{ fontSize: 13, color: "#64748B" }}>
        Der Link ist 60 Minuten gültig. Falls Sie die Anfrage nicht gestellt haben, ignorieren Sie diese Mail bitte.
      </Text>
    </Shell>
  );
}
