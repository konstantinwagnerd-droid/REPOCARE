/**
 * Leads-Endpoint: Demo-Anfragen, Pilot-Interessen, Kontakt-Form-Submissions.
 * Speichert in DB (Tabelle `leads`) + optional Telegram-Push an Konstantin.
 *
 * KEIN Mail-Versand. Konstantin sieht alle Leads unter /admin/leads.
 */
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { z } from "zod";

export const runtime = "nodejs";

const LeadSchema = z.object({
  source: z.string().min(1).max(50), // "demo-anfrage" | "kontakt" | "ressourcen-download" | "presse"
  fullName: z.string().min(1).max(120).optional(),
  organization: z.string().max(200).optional(),
  role: z.string().max(80).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  beds: z.number().int().positive().max(10000).optional(),
  message: z.string().max(4000).optional(),
  locale: z.enum(["de", "en", "fr", "it", "es"]).optional(),
});

async function notifyTelegram(payload: { source: string; summary: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // optional — silent skip

  const text = `🆕 CareAI Lead — *${payload.source}*\n\n${payload.summary}\n\n→ /admin/leads`;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch {
    // best-effort, never block the lead-save
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }

  const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    const data = parsed.data;
    const [row] = await sql`
      INSERT INTO leads (source, full_name, organization, role, email, phone, beds, message, locale)
      VALUES (${data.source}, ${data.fullName ?? null}, ${data.organization ?? null}, ${data.role ?? null},
              ${data.email ?? null}, ${data.phone ?? null}, ${data.beds ?? null}, ${data.message ?? null},
              ${data.locale ?? "de"})
      RETURNING id, created_at
    `;

    // Async fire-and-forget Telegram-Notification (du siehst Bescheid auf dem Handy)
    notifyTelegram({
      source: data.source,
      summary: [
        data.fullName && `Name: ${data.fullName}`,
        data.organization && `Einrichtung: ${data.organization}`,
        data.email && `E-Mail: ${data.email}`,
        data.phone && `Tel: ${data.phone}`,
        data.beds && `Betten: ${data.beds}`,
        data.message && `Nachricht: ${data.message.slice(0, 200)}${data.message.length > 200 ? "…" : ""}`,
      ].filter(Boolean).join("\n"),
    });

    return NextResponse.json({ ok: true, id: row.id, created_at: row.created_at });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  } finally {
    await sql.end();
  }
}

export async function GET() {
  // Leads list ist Admin-only und liegt unter /admin/leads als Server-Component.
  // Diese Route bleibt POST-only.
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
