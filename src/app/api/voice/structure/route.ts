import { NextRequest, NextResponse } from "next/server";

// Mock structuring endpoint — returns SIS-structured JSON from transcript
export async function POST(req: NextRequest) {
  const { transcript } = await req.json().catch(() => ({ transcript: "" }));
  await new Promise((r) => setTimeout(r, 2000));

  // In production this would call Claude API; here we return realistic demo output
  const hasWound = transcript.toLowerCase().includes("wund");
  const hasMobil = transcript.toLowerCase().includes("mobil");
  const hasVitals = transcript.toLowerCase().includes("blutdruck") || transcript.toLowerCase().includes("puls");

  return NextResponse.json({
    summary:
      "Ruhige Nacht, Blutdruck im Normbereich. Wundverlauf positiv (Granulation). Mobilisation durchgeführt. Nahrungsaufnahme vollständig.",
    vitals: [
      { type: "blutdruck_systolisch", value: 138, unit: "mmHg" },
      { type: "blutdruck_diastolisch", value: 82, unit: "mmHg" },
      { type: "puls", value: 74, unit: "/min" },
      { type: "temperatur", value: 36.7, unit: "°C" },
    ],
    sisTags: [
      hasMobil ? "Mobilität & Beweglichkeit" : null,
      hasWound ? "Krankheitsbezogene Anforderungen" : null,
      hasVitals ? "Selbstversorgung" : null,
    ].filter(Boolean),
    actions: [
      hasMobil && { text: "Mobilisation 2x täglich mit Rollator fortführen", urgency: "routine" },
      hasWound && { text: "Wundkontrolle morgen früh, Verbandswechsel nach Standard", urgency: "routine" },
      { text: "Angehörigen Herrn Berger über Wundverlauf informieren (PDL)", urgency: "info" },
    ].filter(Boolean),
    concerns: [],
  });
}
