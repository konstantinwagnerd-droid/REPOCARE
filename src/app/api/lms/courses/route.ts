import { NextResponse } from "next/server";
import { COURSES } from "@/lib/lms/courses";

export async function GET() {
  // Metadaten ohne Modul-Body (Katalog)
  return NextResponse.json({
    courses: COURSES.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      shortDescription: c.shortDescription,
      category: c.category,
      targetRoles: c.targetRoles,
      durationMinutes: c.durationMinutes,
      language: c.language,
      difficulty: c.difficulty,
      validity: c.validity,
      points: c.points,
      thumbnailEmoji: c.thumbnailEmoji,
      moduleCount: c.modules.length,
      published: c.published,
      updatedAt: c.updatedAt,
    })),
  });
}
