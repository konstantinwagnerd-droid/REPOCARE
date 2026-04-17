import { NextResponse } from "next/server";
import { COURSES } from "@/lib/lms/courses";
import { db } from "@/lib/lms/store";
import { computeTenantCompliance } from "@/lib/lms/compliance";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format");
  const d = db();
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const t = computeTenantCompliance(d.staff, mandatory, d.assignments, d.certificates);

  if (format === "csv") {
    const header = [
      "user_id",
      "user_name",
      "role",
      ...mandatory.map((c) => `course_${c.id}_state`),
      ...mandatory.map((c) => `course_${c.id}_due`),
      "compliance_state",
      "mandatory_total",
      "mandatory_completed",
    ];
    const lines = [header.join(";")];
    for (const row of t.rows) {
      const states = mandatory.map((m) => {
        const b = row.breakdown.find((x) => x.course.id === m.id);
        return b?.state ?? "offen";
      });
      const dues = mandatory.map((m) => {
        const b = row.breakdown.find((x) => x.course.id === m.id);
        return b?.dueDate ? new Date(b.dueDate).toISOString().slice(0, 10) : "";
      });
      lines.push(
        [
          row.status.userId,
          `"${row.status.userName}"`,
          row.status.role,
          ...states,
          ...dues,
          row.status.state,
          row.status.mandatoryCoursesTotal,
          row.status.mandatoryCoursesCompleted,
        ].join(";"),
      );
    }
    const csv = "\uFEFF" + lines.join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=careai-lms-compliance.csv",
      },
    });
  }

  return NextResponse.json(t);
}
