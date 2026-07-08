// Skeleton for the application-tracker kanban while cards are fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className={`h-9 w-64 ${box}`} />
      <div className={`mt-3 h-4 w-80 max-w-full ${box}`} />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-4">
            <div className={`h-5 w-24 ${box}`} />
            <div className="mt-4 space-y-3">
              <div className={`h-20 w-full ${box}`} />
              <div className={`h-20 w-full ${box}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
