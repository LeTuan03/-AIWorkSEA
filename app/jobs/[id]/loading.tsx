// Skeleton for a job detail page while the listing is fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className={`h-4 w-40 ${box}`} />
      <div className="mt-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className={`h-8 w-3/4 ${box}`} />
        <div className={`mt-3 h-4 w-1/3 ${box}`} />
        <div className="mt-6 flex gap-2">
          <div className={`h-6 w-20 ${box}`} />
          <div className={`h-6 w-24 ${box}`} />
          <div className={`h-6 w-16 ${box}`} />
        </div>
        <div className="mt-8 space-y-3">
          <div className={`h-4 w-full ${box}`} />
          <div className={`h-4 w-full ${box}`} />
          <div className={`h-4 w-2/3 ${box}`} />
        </div>
      </div>
    </div>
  );
}
