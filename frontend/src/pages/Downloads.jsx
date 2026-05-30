import { Link } from "react-router-dom";
import { Sparkles, Download, Calendar, FolderKanban } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricCard from "../components/dashboard/MetricCard";
import DownloadHistoryRow from "../components/downloads/DownloadHistoryRow";
import { SkeletonList } from "../components/ui/Skeleton";
import { useDownloadHistory } from "../hooks/useDownloadHistory";

const Downloads = () => {
  const { downloads, analytics, loading, error } = useDownloadHistory();

  return (
    <DashboardLayout
      title="Downloads"
      subtitle="Your extension ZIP download history stored in the cloud"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <MetricCard
          label="Total downloads"
          value={analytics?.totalDownloads ?? 0}
          hint="All ZIP downloads recorded"
          icon={Download}
          loading={loading}
        />
        <MetricCard
          label="This month"
          value={analytics?.downloadsThisMonth ?? 0}
          hint={new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          icon={Calendar}
          loading={loading}
        />
        <MetricCard
          label="Unique projects"
          value={analytics?.uniqueProjects ?? 0}
          hint="Projects you've downloaded at least once"
          icon={FolderKanban}
          loading={loading}
        />
        <MetricCard
          label="Most downloaded"
          value={
            analytics?.downloadCountsByProject?.[0]?.count ?? "—"
          }
          hint={
            analytics?.downloadCountsByProject?.[0]?.projectName ||
            "No downloads yet"
          }
          icon={Download}
          loading={loading}
        />
      </div>

      {analytics?.downloadCountsByProject?.length > 0 && (
        <div className="mb-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">
            Download counts by project
          </h2>
          <p className="mt-1 text-sm text-zinc-500 mb-4">
            How many times each extension was downloaded
          </p>
          <div className="space-y-2">
            {analytics.downloadCountsByProject.map((row) => (
              <div
                key={row.projectId}
                className="flex items-center justify-between gap-4 rounded-lg bg-zinc-50 px-4 py-3"
              >
                <span className="truncate text-sm font-medium text-zinc-800">
                  {row.projectName}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-zinc-600">
                  {row.count} download{row.count === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load download history.
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-zinc-900">
        Download history
      </h2>

      {loading ? (
        <SkeletonList rows={3} />
      ) : downloads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-zinc-500">No downloads recorded yet.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Download a ZIP from Generate or a project page to see history here.
          </p>
          <Link
            to="/generate"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Sparkles size={16} />
            Generate an extension
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map((item) => (
            <DownloadHistoryRow key={item.downloadId} download={item} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Downloads;
