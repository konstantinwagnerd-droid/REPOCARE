import type { Role } from "@/db/schema";

export const rolePermissions: Record<Role, { paths: string[]; can: string[] }> = {
  admin: { paths: ["/admin", "/app"], can: ["*"] },
  pdl: { paths: ["/admin", "/app"], can: ["read:all", "write:all", "audit:read", "staff:manage"] },
  pflegekraft: { paths: ["/app"], can: ["read:residents", "write:reports", "write:vitals", "write:mar", "write:wounds"] },
  angehoeriger: { paths: ["/family"], can: ["read:own-resident", "write:family-message"] },
};

export function canAccess(role: Role, path: string): boolean {
  const allowed = rolePermissions[role]?.paths ?? [];
  return allowed.some((p) => path.startsWith(p));
}

export function roleLabel(role: Role): string {
  return {
    admin: "Administrator:in",
    pdl: "Pflegedienstleitung",
    pflegekraft: "Pflegekraft",
    angehoeriger: "Angehörige:r",
  }[role];
}

export function homeForRole(role: Role): string {
  return { admin: "/admin", pdl: "/admin", pflegekraft: "/app", angehoeriger: "/family" }[role];
}
