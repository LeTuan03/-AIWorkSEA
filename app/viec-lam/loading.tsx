// Skeleton for the viec-lam landing hub while landing data is fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className={`h-9 w-72 max-w-full ${box}`} />
      <div className={`mt-3 h-4 w-96 max-w-full ${box}`} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-5">
            <div className={`h-5 w-2/3 ${box}`} />
            <div className={`mt-3 h-4 w-1/2 ${box}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
