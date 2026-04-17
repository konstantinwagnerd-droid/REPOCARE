import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./print.css";
import { Providers } from "@/components/providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CareAI — Mehr Zeit für Menschen", template: "%s · CareAI" },
  description:
    "KI-gestützte Pflegedokumentation für DACH. Spracheingabe, SIS, Maßnahmenplanung, MDK-konform. Hosting in der EU.",
  metadataBase: new URL("https://careai.local"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT" suppressHydrationWarning className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium">
          Zum Hauptinhalt
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
