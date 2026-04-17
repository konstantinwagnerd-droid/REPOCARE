"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function PartnerLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/partner/logout", { method: "POST" });
    router.push("/partner/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <LogOut className="size-4" aria-hidden="true" />
      Abmelden
    </button>
  );
}
