import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

/**
 * Gemeinsame Styles & Layout-Bausteine für alle CareAI-PDFs.
 * Brand: Petrol-Teal (#0E6B67). Schrift: Helvetica (Standard, immer verfügbar).
 */
export const brand = {
  primary: "#0E6B67",
  primaryLight: "#E6F3F2",
  accent: "#C78A3B",
  text: "#1A1D1C",
  muted: "#5C6664",
  border: "#D8DEDC",
  danger: "#B4242E",
  success: "#147A46",
  warning: "#A66A00",
  bg: "#FFFFFF",
} as const;

export const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: brand.text,
    lineHeight: 1.4,
  },
  headerBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderBottom: `2 solid ${brand.primary}`,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  brandMark: {
    color: brand.primary,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  facility: {
    color: brand.muted,
    fontSize: 9,
    textAlign: "right",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: brand.primary,
    marginBottom: 4,
  },
  subtitle: { fontSize: 10, color: brand.muted, marginBottom: 14 },
  h2: { fontFamily: "Helvetica-Bold", fontSize: 12, color: brand.primary, marginTop: 12, marginBottom: 6 },
  h3: { fontFamily: "Helvetica-Bold", fontSize: 10, marginTop: 8, marginBottom: 3 },
  para: { marginBottom: 6 },
  metaBox: {
    border: `1 solid ${brand.border}`,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    backgroundColor: brand.primaryLight,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  labelSm: { fontSize: 8, color: brand.muted, textTransform: "uppercase", letterSpacing: 0.4 },
  value: { fontSize: 10 },
  badge: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: brand.primaryLight,
    color: brand.primary,
    alignSelf: "flex-start",
  },
  divider: { height: 1, backgroundColor: brand.border, marginVertical: 10 },
  table: { width: "100%", marginVertical: 6 },
  tr: { flexDirection: "row", borderBottom: `1 solid ${brand.border}`, paddingVertical: 4 },
  trHead: { flexDirection: "row", borderBottom: `2 solid ${brand.primary}`, paddingBottom: 4, paddingTop: 4 },
  th: { fontFamily: "Helvetica-Bold", fontSize: 9, color: brand.primary, flex: 1 },
  td: { fontSize: 9, flex: 1 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTop: `1 solid ${brand.border}`,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    fontSize: 7,
    color: brand.muted,
  },
  footerCol: { flexDirection: "column", maxWidth: 260 },
  hashText: { fontFamily: "Courier", fontSize: 7, color: brand.muted, marginTop: 2 },
  qrImg: { width: 44, height: 44 },
  watermark: {
    position: "absolute",
    top: 320,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 48,
    color: brand.primary,
    opacity: 0.05,
    transform: "rotate(-30deg)",
  },
  signBox: {
    marginTop: 16,
    padding: 10,
    border: `1 solid ${brand.success}`,
    borderRadius: 4,
    backgroundColor: "#F1F8F4",
  },
  signBoxTitle: { color: brand.success, fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 },
});

export interface BaseDocMeta {
  facilityName: string;
  facilityAddress?: string;
  title: string;
  subtitle?: string;
  generatedAt: Date;
  documentHash: string;
  qrDataUrl?: string;
  recipient?: string;
  confidential?: boolean;
  watermark?: string;
}

export function PageHeader({ meta }: { meta: BaseDocMeta }) {
  return (
    <View style={styles.headerBand} fixed>
      <Text style={styles.brandMark}>CareAI</Text>
      <View>
        <Text style={styles.facility}>{meta.facilityName}</Text>
        {meta.facilityAddress ? <Text style={styles.facility}>{meta.facilityAddress}</Text> : null}
      </View>
    </View>
  );
}

export function PageFooter({ meta }: { meta: BaseDocMeta }) {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerCol}>
        <Text>Generiert {fmtDateTime(meta.generatedAt)} aus CareAI</Text>
        {meta.confidential ? (
          <Text>Vertraulich — DSGVO Art. 9, nur für autorisierte Empfänger</Text>
        ) : null}
        <Text style={styles.hashText}>SHA-256: {meta.documentHash}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        {meta.qrDataUrl ? <Image style={styles.qrImg} src={meta.qrDataUrl} /> : null}
        <Text
          render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`}
        />
      </View>
    </View>
  );
}

export function Watermark({ text }: { text: string }) {
  return <Text style={styles.watermark} fixed>{text}</Text>;
}

export function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function fmtDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " Uhr";
}

/**
 * Standard-Document wrapper. Nutzt globale Header/Footer, Watermark optional.
 */
export function BaseDocument({
  meta,
  children,
  size = "A4",
  orientation = "portrait",
}: {
  meta: BaseDocMeta;
  children: React.ReactNode;
  size?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
}) {
  return (
    <Document
      title={meta.title}
      author="CareAI"
      creator="CareAI Export Engine"
      producer="CareAI"
      subject={meta.subtitle ?? meta.title}
    >
      <Page size={size} orientation={orientation} style={styles.page}>
        <PageHeader meta={meta} />
        {meta.watermark ? <Watermark text={meta.watermark} /> : null}
        <Text style={styles.title}>{meta.title}</Text>
        {meta.subtitle ? <Text style={styles.subtitle}>{meta.subtitle}</Text> : null}
        {children}
        <PageFooter meta={meta} />
      </Page>
    </Document>
  );
}
