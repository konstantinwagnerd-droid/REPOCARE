import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary-900 text-primary-foreground lg:block">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            CareAI
          </Link>
          <div>
            <blockquote className="font-serif text-3xl leading-snug">
              „Endlich eine Software, die mit uns denkt, nicht gegen uns.“
            </blockquote>
            <p className="mt-4 text-primary-100">Jana Hofer — DGKP, Station C3</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
