// Skeleton for the companies directory while the list is fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className={`h-9 w-56 ${box}`} />
      <div className={`mt-3 h-4 w-72 ${box}`} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
            <div className={`h-12 w-12 shrink-0 ${box}`} />
            <div className="min-w-0 flex-1">
              <div className={`h-4 w-32 ${box}`} />
              <div className={`mt-2 h-3 w-24 ${box}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
