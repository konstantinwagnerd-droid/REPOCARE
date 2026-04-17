import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  // Demo-Stub: log und zur Bestätigungsseite
  console.info("[demo-request]", Object.fromEntries(data.entries()));
  return NextResponse.redirect(new URL("/verify-email", req.url), 303);
}
