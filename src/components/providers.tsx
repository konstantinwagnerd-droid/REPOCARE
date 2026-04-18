"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { OfflineBanner } from "@/components/offline/OfflineBanner";
import { ConflictDialog } from "@/components/offline/ConflictDialog";
import { InstallPrompt } from "@/components/offline/InstallPrompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <OfflineBanner />
        {children}
        <ConflictDialog />
        <InstallPrompt />
      </SessionProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "font-sans text-sm rounded-xl border border-border bg-card text-card-foreground shadow-lg",
            success: "border-emerald-200 dark:border-emerald-900",
            error: "border-red-200 dark:border-red-900",
            warning: "border-amber-200 dark:border-amber-900",
          },
        }}
        richColors
        closeButton
      />
    </ThemeProvider>
  );
}
