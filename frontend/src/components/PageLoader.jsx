import { Loader2 } from "lucide-react";
import { SkeletonMetric } from "./ui/Skeleton";

export const PageLoader = ({ message = "Loading…" }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-50">
    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" aria-hidden="true" />
    <p className="text-sm text-zinc-500">{message}</p>
  </div>
);

export const DashboardLoader = () => (
  <div className="p-6 lg:p-8">
    <div className="mb-8 space-y-2">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200/80" />
      <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-200/80" />
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonMetric key={index} />
      ))}
    </div>
  </div>
);

export default PageLoader;
