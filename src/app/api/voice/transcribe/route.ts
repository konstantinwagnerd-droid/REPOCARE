/**
 * Voice transcription endpoint.
 * Default: mock (deterministic demo output). Opt-in real providers via env:
 *   WHISPER_PROVIDER=openai   — OpenAI Whisper
 *   WHISPER_PROVIDER=elevenlabs — ElevenLabs Scribe (EU)
 */
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/monitoring/logger";

const MOCK_TRANSCRIPT =
  "Frau Berger hat heute Nacht gut geschlafen, gegen 03:30 Uhr kurz aufgewacht und Wasser getrunken. " +
  "Blutdruck am Morgen 138 auf 82 Millimeter Quecksilbersäule, Puls 74, Temperatur 36,7 Grad. " +
  "Wunde am rechten Unterschenkel zeigt beginnende Granulation, Verbandswechsel durchgeführt, " +
  "Wundfläche ca. 2 mal 3 Zentimeter, kein Exsudat. Mobilisation mit Rollator 15 Minuten im Flur. " +
  "Frühstück vollständig eingenommen, Medikamente planmäßig verabreicht. " +
  "Angehöriger Herr Berger hat um 10 Uhr angerufen und fragt nach dem Wundverlauf.";

export async function POST(req: NextRequest) {
  const provider = (process.env.WHISPER_PROVIDER ?? "mock").toLowerCase();

  if (provider === "mock") {
    await new Promise((r) => setTimeout(r, 1500));
    return NextResponse.json({ transcript: MOCK_TRANSCRIPT, provider: "mock" });
  }

  const form = await req.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "audio_missing" }, { status: 400 });
  }

  try {
    if (provider === "openai") {
      const { OpenAIProvider } = await import("@/lib/llm/providers/openai");
      const p = new OpenAIProvider();
      const { text } = await p.transcribeAudio(audio);
      return NextResponse.json({ transcript: text, provider: "openai" });
    }
    if (provider === "elevenlabs") {
      const form2 = new FormData();
      form2.append("file", audio, "audio.webm");
      form2.append("model_id", process.env.ELEVENLABS_MODEL ?? "scribe_v1");
      const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
        body: form2,
      });
      if (!resp.ok) {
        return NextResponse.json({ error: "elevenlabs_error", status: resp.status }, { status: 502 });
      }
      const data = (await resp.json()) as { text: string };
      return NextResponse.json({ transcript: data.text, provider: "elevenlabs" });
    }
    return NextResponse.json({ error: `unknown_provider:${provider}` }, { status: 500 });
  } catch (e) {
    logger.error("voice.transcribe.error", { err: String(e) });
    return NextResponse.json({ error: "transcribe_failed" }, { status: 502 });
  }
}
