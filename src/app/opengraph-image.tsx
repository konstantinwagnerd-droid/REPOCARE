import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CareAI — KI-gestützte Pflegedokumentation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0B1220 0%, #112244 100%)",
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#0B84FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>CareAI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            Pflegedokumentation. Mit KI. In 60 Sekunden.
          </div>
          <div style={{ fontSize: 28, color: "#A8B3CF" }}>DSGVO-konform · Gehostet in Österreich · Seit 2026</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
