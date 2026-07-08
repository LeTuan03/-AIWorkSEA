// Skeleton for the freelancer directory while profiles are fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className={`h-9 w-64 ${box}`} />
      <div className={`mt-3 h-4 w-80 max-w-full ${box}`} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 shrink-0 ${box}`} />
              <div className="min-w-0 flex-1">
                <div className={`h-4 w-28 ${box}`} />
                <div className={`mt-2 h-3 w-36 ${box}`} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className={`h-6 w-16 ${box}`} />
              <div className={`h-6 w-20 ${box}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
