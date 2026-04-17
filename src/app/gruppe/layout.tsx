import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GROUPS } from "@/lib/multi-tenant/seed";
import { GruppeSidebar } from "@/components/multi-tenant/GruppeSidebar";
import { GroupPicker } from "@/components/multi-tenant/GroupPicker";
import { resolveActiveGroup } from "./_lib/context";

export const metadata = { title: "Gruppe · CareAI" };

export default async function GruppeLayout({ children, searchParams }: {
  children: React.ReactNode;
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  // group_admin rolle: demo → admin und pdl bekommen Zugriff
  if (session.user.role !== "admin" && session.user.role !== "pdl") redirect("/app");

  const sp = (await searchParams) ?? {};
  const activeSlug = typeof sp.gruppe === "string" ? sp.gruppe : undefined;
  const group = resolveActiveGroup(activeSlug);

  return (
    <div className="flex min-h-screen">
      <GruppeSidebar groupName={group.name} logoText={group.logoText} facilityCount={group.facilities.length} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Trägerverbund</div>
            <div className="font-serif text-lg font-semibold">{group.name}</div>
          </div>
          <GroupPicker
            current={{ slug: group.slug, name: group.name, logoText: group.logoText }}
            groups={GROUPS.map((g) => ({ slug: g.slug, name: g.name, logoText: g.logoText }))}
          />
        </header>
        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
