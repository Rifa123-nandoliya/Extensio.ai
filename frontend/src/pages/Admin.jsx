import { useEffect, useState } from "react";
import { Shield, Users, FolderKanban, Activity } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricCard from "../components/dashboard/MetricCard";
import { getAdminOverview, getAdminUsers } from "../services/api";
import { SkeletonMetric, SkeletonList } from "../components/ui/Skeleton";

const Admin = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewData, usersData] = await Promise.all([
          getAdminOverview(),
          getAdminUsers(1),
        ]);
        setOverview(overviewData.overview);
        setUsers(usersData.users ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout
      title="Admin dashboard"
      subtitle="Platform overview and user management"
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
              label="Total users"
              value={overview?.users?.total ?? 0}
              hint={`+${overview?.users?.newLast30Days ?? 0} this month`}
              icon={Users}
            />
            <MetricCard
              label="Pro subscribers"
              value={overview?.users?.pro ?? 0}
              icon={Shield}
            />
            <MetricCard
              label="Projects"
              value={overview?.projects?.total ?? 0}
              icon={FolderKanban}
            />
            <MetricCard
              label="Events (30d)"
              value={overview?.usage?.totalEvents ?? 0}
              icon={Activity}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Platform usage
              </h2>
              <ul className="mt-4 space-y-2">
                {Object.entries(overview?.usage?.byType ?? {}).map(
                  ([type, count]) => (
                    <li
                      key={type}
                      className="flex justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm"
                    >
                      <span className="capitalize">{type.replace(/_/g, " ")}</span>
                      <span className="font-medium tabular-nums">{count}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">
                Recent users
              </h2>
              <ul className="mt-4 space-y-2">
                {users.slice(0, 8).map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </div>
                    <span className="text-xs capitalize text-zinc-500">
                      {u.subscriptionPlan}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="mt-8">
          <SkeletonList rows={4} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Admin;
