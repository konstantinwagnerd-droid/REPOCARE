import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Whisper-API-Integration mit Provider-Selection:
 * - ENV WHISPER_PROVIDER=openai     → OpenAI Whisper API (via OPENAI_API_KEY)
 * - ENV WHISPER_PROVIDER=elevenlabs  → ElevenLabs Scribe (EU-hosted)
 * - ENV WHISPER_PROVIDER=mock (default) → deterministischer Demo-Output
 *
 * Kostenschutz: max 5 Min Audio, max 10 Transkriptionen/User/Tag.
 * PII-Schutz: Audio wird NICHT persistent gespeichert, nur transcript.
 */

const MAX_DURATION_SECONDS = 5 * 60;
const DAILY_LIMIT_PER_USER = 10;

// In-memory fallback (resets on cold-start). In Prod: Redis empfohlen.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const key = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 24 * 3600 * 1000 });
    return { ok: true, remaining: DAILY_LIMIT_PER_USER - 1 };
  }
  if (entry.count >= DAILY_LIMIT_PER_USER) {
    return { ok: false, remaining: 0 };
  }
  entry.count += 1;
  return { ok: true, remaining: DAILY_LIMIT_PER_USER - entry.count };
}

const MOCK_TRANSCRIPT =
  "Frau Berger hat heute Nacht gut geschlafen, gegen 03:30 Uhr kurz aufgewacht und Wasser getrunken. " +
  "Blutdruck am Morgen 138 auf 82 Millimeter Quecksilbersäule, Puls 74, Temperatur 36,7 Grad. " +
  "Wunde am rechten Unterschenkel zeigt beginnende Granulation, Verbandswechsel durchgeführt, " +
  "Wundfläche ca. 2 mal 3 Zentimeter, kein Exsudat. Mobilisation mit Rollator 15 Minuten im Flur. " +
  "Frühstück vollständig eingenommen, Medikamente planmäßig verabreicht. " +
  "Angehöriger Herr Berger hat um 10 Uhr angerufen und fragt nach dem Wundverlauf.";

type NormalizedResult = {
  text: string;
  segments?: unknown;
  duration?: number;
  provider: "mock" | "openai" | "elevenlabs";
  language: string;
};

export async function POST(req: NextRequest) {
  const provider = (process.env.WHISPER_PROVIDER ?? "mock").toLowerCase() as
    | "mock"
    | "openai"
    | "elevenlabs";

  // ── Auth ──────────────────────────────────────────────────────────
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessUser = session?.user as any;
  const userId = sessUser?.id as string | undefined;
  const tenantId = sessUser?.tenantId as string | undefined;

  // Allow unauthenticated mock (public demo), but real providers require auth.
  if (provider !== "mock" && (!userId || !tenantId)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── Rate limit ────────────────────────────────────────────────────
  if (userId) {
    const rl = checkRateLimit(userId);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limit_exceeded", limit: DAILY_LIMIT_PER_USER, window: "24h" },
        { status: 429 }
      );
    }
  }

  // ── Mock path (no file required) ──────────────────────────────────
  if (provider === "mock") {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({
      text: MOCK_TRANSCRIPT,
      transcript: MOCK_TRANSCRIPT, // back-compat
      duration: 42,
      provider: "mock",
      language: "de",
    });
  }

  // ── Parse multipart ───────────────────────────────────────────────
  const form = await req.formData().catch(() => null);
  const audio = form?.get("audio");
  const durationHint = Number(form?.get("durationSeconds") ?? 0);

  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "audio_missing" }, { status: 400 });
  }
  if (durationHint > MAX_DURATION_SECONDS) {
    return NextResponse.json(
      { error: "audio_too_long", maxSeconds: MAX_DURATION_SECONDS },
      { status: 413 }
    );
  }
  // Rough byte-cap as second line of defense (≈ 25 MB Whisper limit).
  if (audio.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "audio_too_large" }, { status: 413 });
  }

  try {
    let result: NormalizedResult;

    if (provider === "openai") {
      const { OpenAIProvider } = await import("@/lib/llm/providers/openai");
      const p = new OpenAIProvider();
      const { text } = await p.transcribeAudio(audio, "de");
      result = { text, provider: "openai", language: "de", duration: durationHint };
    } else if (provider === "elevenlabs") {
      const form2 = new FormData();
      form2.append("file", audio, "audio.webm");
      form2.append("model_id", process.env.ELEVENLABS_MODEL ?? "scribe_v1");
      const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
        body: form2,
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        logger.error("voice.transcribe.elevenlabs_error", {
          status: resp.status,
          body: txt.slice(0, 200),
        });
        return NextResponse.json(
          { error: "elevenlabs_error", status: resp.status },
          { status: 502 }
        );
      }
      const data = (await resp.json()) as { text: string; language_code?: string };
      result = {
        text: data.text,
        provider: "elevenlabs",
        language: data.language_code ?? "de",
        duration: durationHint,
      };
    } else {
      return NextResponse.json({ error: `unknown_provider:${provider}` }, { status: 500 });
    }

    // ── Audit log (never contains the transcript text — only metadata) ─
    if (userId && tenantId) {
      try {
        await logAudit({
          tenantId,
          userId,
          entityType: "voice_transcription",
          entityId: crypto.randomUUID(),
          action: "create",
          after: {
            provider: result.provider,
            duration: result.duration,
            text_length: result.text.length,
            language: result.language,
          },
        });
      } catch (auditErr) {
        logger.warn("voice.transcribe.audit_failed", { err: String(auditErr) });
      }
    }

    return NextResponse.json({
      ...result,
      transcript: result.text, // back-compat
    });
  } catch (e) {
    logger.error("voice.transcribe.error", { err: String(e) });
    return NextResponse.json({ error: "transcribe_failed" }, { status: 502 });
  }
}
