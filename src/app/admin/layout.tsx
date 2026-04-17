import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "pdl") redirect("/app");

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.user.role} userName={session.user.name ?? "Admin"} base="admin" />
      <div className="flex flex-1 flex-col">
        <Topbar userName={session.user.name ?? "Admin"} facility="Pflegezentrum Hietzing · Admin" />
        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
