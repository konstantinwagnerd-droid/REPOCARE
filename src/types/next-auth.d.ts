import type { Role } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null; role: Role; tenantId: string };
  }
}
