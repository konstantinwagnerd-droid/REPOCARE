import { NextResponse } from "next/server";
import { db, DEMO_CURRENT_USER } from "@/lib/lms/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as { text?: string };
  const key = `${DEMO_CURRENT_USER.id}_${id}`;
  db().notes[key] = body.text ?? "";
  return NextResponse.json({ ok: true });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const key = `${DEMO_CURRENT_USER.id}_${id}`;
  return NextResponse.json({ text: db().notes[key] ?? "" });
}
