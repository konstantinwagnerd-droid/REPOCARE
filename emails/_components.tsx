import * as React from "react";
import { Html, Head, Body, Container, Section, Text, Link, Hr, Preview } from "@react-email/components";

const BRAND = "#0B84FF";
const BG = "#F6F8FB";
const DARK_BG = "#0B1220";

export function Shell({
  preview,
  children,
  darkMode = false,
}: {
  preview: string;
  children: React.ReactNode;
  darkMode?: boolean;
}) {
  return (
    <Html lang="de">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: darkMode ? DARK_BG : BG,
          color: darkMode ? "#E5ECF5" : "#0B1220",
          fontFamily: "Inter, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: darkMode ? "#101827" : "white",
            borderRadius: 12,
            padding: 32,
          }}
        >
          <Section>
            <Text style={{ color: BRAND, fontWeight: 800, fontSize: 22, margin: 0 }}>CareAI</Text>
          </Section>
          <Hr style={{ borderColor: darkMode ? "#223049" : "#E5ECF5", margin: "16px 0 24px" }} />
          {children}
          <Hr style={{ borderColor: darkMode ? "#223049" : "#E5ECF5", margin: "32px 0 16px" }} />
          <Text style={{ fontSize: 12, color: darkMode ? "#8591A8" : "#64748B", margin: 0 }}>
            CareAI GmbH · Wien · Österreich ·{" "}
            <Link href="https://careai.at/impressum" style={{ color: BRAND }}>Impressum</Link> ·{" "}
            <Link href="https://careai.at/datenschutz" style={{ color: BRAND }}>Datenschutz</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const btnStyle: React.CSSProperties = {
  backgroundColor: BRAND,
  color: "white",
  padding: "12px 22px",
  borderRadius: 8,
  textDecoration: "none",
  display: "inline-block",
  fontWeight: 600,
};
