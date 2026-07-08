// Root fallback skeleton — covers the homepage and any route without its own
// loading.tsx while server data is fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className={`h-10 w-80 max-w-full ${box}`} />
      <div className={`mt-3 h-4 w-96 max-w-full ${box}`} />

      <div className="mt-10 grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className={`h-5 w-2/3 ${box}`} />
            <div className={`mt-3 h-4 w-1/3 ${box}`} />
            <div className="mt-4 flex gap-2">
              <div className={`h-6 w-16 ${box}`} />
              <div className={`h-6 w-20 ${box}`} />
              <div className={`h-6 w-14 ${box}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
