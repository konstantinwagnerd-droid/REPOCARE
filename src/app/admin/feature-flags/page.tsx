import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listFlags } from "@/lib/feature-flags/store";
import { FeatureFlagsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function FeatureFlagsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const flags = listFlags();
  return <FeatureFlagsClient initialFlags={flags} />;
}
