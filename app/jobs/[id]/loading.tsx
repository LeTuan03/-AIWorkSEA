// Shown instantly on navigation into a job while the server fetches it,
// so clicking a JobCard swaps to a matching skeleton instead of hanging.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className={`h-4 w-64 ${box}`} />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl glass p-6 sm:p-8">
            <div className="flex gap-2">
              <div className={`h-6 w-28 ${box}`} />
              <div className={`h-6 w-20 ${box}`} />
            </div>
            <div className={`mt-4 h-8 w-3/4 ${box}`} />
            <div className={`mt-2 h-4 w-1/2 ${box}`} />

            <hr className="my-6 border-line" />

            <div className={`h-4 w-40 ${box}`} />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-4 ${box} ${i === 4 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>

            <div className={`mt-8 h-4 w-40 ${box}`} />
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-7 w-20 ${box}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl glass p-6">
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className={`h-3 w-24 ${box}`} />
                  <div className={`mt-2 h-5 w-32 ${box}`} />
                </div>
              ))}
            </div>
            <div className={`mt-6 h-11 w-full ${box}`} />
          </div>
        </aside>
      </div>
    </div>
  );
}
