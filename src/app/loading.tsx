export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8" role="status" aria-label="Lädt …">
      <div className="space-y-4 w-full max-w-2xl">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-32 w-full animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
