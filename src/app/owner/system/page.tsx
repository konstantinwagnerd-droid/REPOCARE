export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mask(value: string | undefined): string {
  if (!value) return "(nicht gesetzt)";
  if (value.length <= 8) return "***";
  return value.slice(0, 6) + "…" + value.slice(-4);
}

export default function SystemPage() {
  const env = {
    NODE_ENV: process.env.NODE_ENV ?? "?",
    NEXT_RUNTIME: process.env.NEXT_RUNTIME ?? "nodejs",
    DATABASE_URL: mask(process.env.DATABASE_URL),
    AUTH_SECRET: mask(process.env.AUTH_SECRET),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "(nicht gesetzt)",
    LLM_PROVIDER: process.env.LLM_PROVIDER ?? "mock",
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? "mock",
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER ?? "local",
    SETUP_TOKEN: mask(process.env.SETUP_TOKEN),
    TELEGRAM_BOT_TOKEN: mask(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_CHAT_ID: mask(process.env.TELEGRAM_CHAT_ID),
    VERCEL_REGION: process.env.VERCEL_REGION ?? "(local)",
    VERCEL_ENV: process.env.VERCEL_ENV ?? "(local)",
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "?",
    VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "?",
  };
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">System-Info</h1>
      <p className="mt-1 text-sm text-muted-foreground">Environment, Build, Provider — sensible Werte maskiert.</p></header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(env).map(([k, v]) => (
              <tr key={k} className="border-b border-border last:border-0">
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{k}</td>
                <td className="px-4 py-2 font-mono text-xs">{v}</td>
              </tr>
            ))}
            <tr className="border-b border-border last:border-0">
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">node.version</td>
              <td className="px-4 py-2 font-mono text-xs">{process.version}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">platform</td>
              <td className="px-4 py-2 font-mono text-xs">{process.platform}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
