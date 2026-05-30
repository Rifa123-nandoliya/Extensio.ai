import { useEffect, useState } from "react";
import { Copy, Gift, TrendingUp } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricCard from "../components/dashboard/MetricCard";
import { getMyAnalytics, getMyReferrals } from "../services/api";
import { SkeletonMetric } from "../components/ui/Skeleton";
import { showSuccess } from "../utils/toast";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsData, referralData] = await Promise.all([
          getMyAnalytics(),
          getMyReferrals(),
        ]);
        setAnalytics(analyticsData.analytics);
        setReferrals(referralData.referrals);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copyReferralLink = () => {
    if (!referrals?.referralCode) return;
    const url = `${window.location.origin}/register?ref=${referrals.referralCode}`;
    navigator.clipboard.writeText(url);
    showSuccess("Referral link copied");
  };

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Usage insights and referral performance"
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonMetric key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            <MetricCard
              label="Projects"
              value={analytics?.totals?.projects ?? 0}
              icon={TrendingUp}
            />
            <MetricCard
              label="Generations today"
              value={analytics?.generation?.count ?? 0}
              hint={
                analytics?.generation?.limit
                  ? `Limit: ${analytics.generation.limit}`
                  : "Unlimited (Pro)"
              }
            />
            <MetricCard
              label="Downloads"
              value={analytics?.downloads?.totalDownloads ?? 0}
            />
            <MetricCard
              label="Referrals"
              value={referrals?.totalReferrals ?? 0}
              icon={Gift}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Activity (30 days)
              </h2>
              <ul className="mt-4 space-y-2">
                {Object.entries(analytics?.usage?.byType ?? {}).map(
                  ([type, count]) => (
                    <li
                      key={type}
                      className="flex justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm"
                    >
                      <span className="capitalize text-zinc-600">
                        {type.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium tabular-nums text-zinc-900">
                        {count}
                      </span>
                    </li>
                  )
                )}
                {!Object.keys(analytics?.usage?.byType ?? {}).length && (
                  <p className="text-sm text-zinc-500">No activity yet.</p>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Referral program
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Share your link. When friends sign up, you both benefit from
                growth rewards.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3">
                <code className="flex-1 truncate text-sm text-zinc-800">
                  {referrals?.referralCode ?? "—"}
                </code>
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <Copy size={12} />
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
