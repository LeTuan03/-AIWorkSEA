// Skeleton for a single company's page while its jobs are fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className={`h-4 w-40 ${box}`} />

      <div className="mt-6 flex items-center gap-4">
        <div className={`h-16 w-16 shrink-0 ${box}`} />
        <div>
          <div className={`h-7 w-48 ${box}`} />
          <div className={`mt-2 h-4 w-32 ${box}`} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-40 border border-line ${box}`} />
        ))}
      </div>
    </div>
  );
}
