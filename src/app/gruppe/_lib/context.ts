import { DEFAULT_GROUP_SLUG, GROUPS, getGroupBySlug } from "@/lib/multi-tenant/seed";
import type { GroupRecord } from "@/lib/multi-tenant/types";

export function resolveActiveGroup(slug?: string | null): GroupRecord {
  if (slug) {
    const g = getGroupBySlug(slug);
    if (g) return g;
  }
  return getGroupBySlug(DEFAULT_GROUP_SLUG) ?? GROUPS[0];
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
