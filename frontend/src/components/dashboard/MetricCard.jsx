import { Skeleton } from "../ui/Skeleton";

const MetricCard = ({ label, value, hint, icon: Icon, loading }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:border-zinc-300/80 hover:shadow-md">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5 transition-transform group-hover:scale-110" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          {loading ? (
            <>
              <Skeleton className="mt-2 h-9 w-16" />
              {hint && <Skeleton className="mt-2 h-3 w-32" />}
            </>
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 tabular-nums">
                {value}
              </p>
              {hint && (
                <p className="mt-1.5 text-xs text-zinc-400">{hint}</p>
              )}
            </>
          )}
        </div>
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
