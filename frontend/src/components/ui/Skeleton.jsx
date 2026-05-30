const baseClass =
  "animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-700/50";

export const Skeleton = ({ className = "" }) => (
  <div className={`${baseClass} ${className}`.trim()} aria-hidden="true" />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`.trim()} aria-hidden="true">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={`h-3 ${index === lines - 1 ? "w-4/5" : "w-full"}`}
      />
    ))}
  </div>
);

export const SkeletonMetric = () => (
  <div
    className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm"
    aria-hidden="true"
  >
    <Skeleton className="h-4 w-24" />
    <Skeleton className="mt-3 h-9 w-16" />
    <Skeleton className="mt-2 h-3 w-32" />
  </div>
);

export const SkeletonCard = ({ className = "h-40" }) => (
  <div
    className={`rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ${className}`}
    aria-hidden="true"
  >
    <Skeleton className="h-5 w-2/3" />
    <SkeletonText lines={2} className="mt-4" />
    <Skeleton className="mt-6 h-9 w-full rounded-xl" />
  </div>
);

export const SkeletonList = ({ rows = 3 }) => (
  <div className="space-y-2" aria-hidden="true">
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} className="h-16 w-full rounded-xl" />
    ))}
  </div>
);

export const SkeletonGrid = ({ count = 6, Card = SkeletonCard }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} />
    ))}
  </div>
);
