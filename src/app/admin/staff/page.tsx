import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { roleLabel } from "@/lib/rbac";
import { Plus } from "lucide-react";

export default async function StaffPage() {
  const session = await auth();
  const staff = await db.select().from(users).where(eq(users.tenantId, session!.user.tenantId)).orderBy(asc(users.fullName));

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Mitarbeitende</h1>
          <p className="mt-1 text-muted-foreground">{staff.length} aktive Zugänge.</p>
        </div>
        <Button variant="accent" size="lg"><Plus className="h-4 w-4" /> Mitarbeiter:in</Button>
      </div>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {staff.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4">
              <Avatar><AvatarFallback>{initials(s.fullName)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{s.fullName}</div>
                <div className="text-sm text-muted-foreground">{s.email}</div>
              </div>
              <Badge variant={s.role === "admin" ? "accent" : s.role === "pdl" ? "info" : "secondary"}>{roleLabel(s.role)}</Badge>
              <Button variant="ghost" size="sm">Bearbeiten</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
