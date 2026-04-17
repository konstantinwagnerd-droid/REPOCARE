import { NextResponse } from "next/server";

// Mock transcription endpoint — simulates 1.5s backend processing
export async function POST() {
  await new Promise((r) => setTimeout(r, 1500));

  return NextResponse.json({
    transcript:
      "Frau Berger hat heute Nacht gut geschlafen, gegen 03:30 Uhr kurz aufgewacht und Wasser getrunken. " +
      "Blutdruck am Morgen 138 auf 82 Millimeter Quecksilbersäule, Puls 74, Temperatur 36,7 Grad. " +
      "Wunde am rechten Unterschenkel zeigt beginnende Granulation, Verbandswechsel durchgeführt, " +
      "Wundfläche ca. 2 mal 3 Zentimeter, kein Exsudat. Mobilisation mit Rollator 15 Minuten im Flur. " +
      "Frühstück vollständig eingenommen, Medikamente planmäßig verabreicht. " +
      "Angehöriger Herr Berger hat um 10 Uhr angerufen und fragt nach dem Wundverlauf.",
  });
}
