import * as React from "react";
import { Text, Section, Button } from "@react-email/components";
import { Shell, btnStyle } from "./_components";

export default function HandoverReminderEmail({
  shiftLabel = "Spätdienst",
  startsIn = "15 Minuten",
}: {
  shiftLabel?: string;
  startsIn?: string;
}) {
  return (
    <Shell preview={`Schichtwechsel ${shiftLabel} in ${startsIn}`}>
      <Text style={{ fontSize: 20, fontWeight: 700 }}>Schichtwechsel steht bevor</Text>
      <Text>
        Der {shiftLabel} beginnt in {startsIn}. Bitte schließen Sie Ihre Dokumentation ab und generieren Sie den
        Übergabe-Bericht.
      </Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button style={btnStyle} href="https://app.careai.at/app/handover">Übergabe starten</Button>
      </Section>
    </Shell>
  );
}
