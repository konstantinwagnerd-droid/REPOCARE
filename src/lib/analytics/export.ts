import type { DailyRollup } from "./types";

export function toCSV(rollups: DailyRollup[]): string {
  const header = ["day", "name", "page", "feature", "role", "facility", "count", "valueSum", "valueCount", "uniqueUsers"];
  const rows = rollups.map((r) =>
    [
      r.day,
      r.name,
      r.page ?? "",
      r.feature ?? "",
      r.role ?? "",
      r.facility ?? "",
      r.count.toString(),
      (r.valueSum ?? "").toString(),
      (r.valueCount ?? "").toString(),
      r.uniqHashes.size.toString(),
    ]
      .map((c) => (c.includes(",") || c.includes("\"") ? `"${c.replace(/"/g, '""')}"` : c))
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function toJSON(rollups: DailyRollup[]): string {
  return JSON.stringify(
    rollups.map((r) => ({
      day: r.day,
      name: r.name,
      page: r.page,
      feature: r.feature,
      role: r.role,
      facility: r.facility,
      count: r.count,
      valueSum: r.valueSum,
      valueCount: r.valueCount,
      uniqueUsers: r.uniqHashes.size,
    })),
    null,
    2,
  );
}
