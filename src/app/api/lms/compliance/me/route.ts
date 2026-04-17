import { NextResponse } from "next/server";
import { COURSES } from "@/lib/lms/courses";
import { db, DEMO_CURRENT_USER } from "@/lib/lms/store";
import { computeComplianceForStaff } from "@/lib/lms/compliance";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format");
  const user = DEMO_CURRENT_USER;
  const d = db();
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const row = computeComplianceForStaff(
    { id: user.id, name: user.name, role: user.role, team: user.team },
    mandatory,
    d.assignments.filter((a) => a.userId === user.id),
    d.certificates.filter((c) => c.userId === user.id),
  );

  if (format === "ics") {
    const ics = toIcs(row.breakdown);
    return new NextResponse(ics, {
      status: 200,
      headers: {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": "attachment; filename=careai-lms-fristen.ics",
      },
    });
  }

  return NextResponse.json(row);
}

function toIcs(items: { course: { id: string; title: string }; dueDate?: string }[]): string {
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const events = items
    .filter((i) => i.dueDate)
    .map((i) => {
      const d = new Date(i.dueDate!);
      const dt = d.toISOString().slice(0, 10).replace(/-/g, "");
      return [
        "BEGIN:VEVENT",
        `UID:${i.course.id}-${dt}@careai.at`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dt}`,
        `DTEND;VALUE=DATE:${dt}`,
        `SUMMARY:Pflichtschulung fällig — ${i.course.title}`,
        "DESCRIPTION:Fälligkeit automatisch erzeugt durch CareAI Learning.",
        "END:VEVENT",
      ].join("\r\n");
    });
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareAI//Learning//DE",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
