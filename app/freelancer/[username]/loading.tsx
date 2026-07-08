// Skeleton for a public freelancer profile while it is fetched.
export default function Loading() {
  const box = "animate-pulse rounded-xl bg-surface-2";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className={`h-4 w-44 ${box}`} />
      <div className="mt-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className={`h-[88px] w-[88px] shrink-0 rounded-2xl ${box}`} />
          <div className="min-w-0 flex-1">
            <div className={`h-6 w-24 ${box}`} />
            <div className={`mt-3 h-7 w-48 ${box}`} />
            <div className={`mt-2 h-4 w-64 max-w-full ${box}`} />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <div className={`h-6 w-16 ${box}`} />
          <div className={`h-6 w-20 ${box}`} />
          <div className={`h-6 w-14 ${box}`} />
        </div>
        <div className="mt-6 space-y-3">
          <div className={`h-4 w-full ${box}`} />
          <div className={`h-4 w-full ${box}`} />
          <div className={`h-4 w-2/3 ${box}`} />
        </div>
      </div>
    </div>
  );
}
