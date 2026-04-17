import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "CareAI — AI-Powered Care Documentation", template: "%s | CareAI" },
  description: "CareAI is the AI-powered care documentation suite for DACH care providers. Voice input, SIS automation, MDK-proof audit trail.",
  alternates: {
    canonical: "/en",
    languages: { "de-DE": "/", "en-US": "/en", "x-default": "/" },
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}
