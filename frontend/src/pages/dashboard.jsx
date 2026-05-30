import { Link } from "react-router-dom";
import {
  FolderKanban,
  Download,
  Puzzle,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricCard from "../components/dashboard/MetricCard";
import QuickAction from "../components/dashboard/QuickAction";
import Panel from "../components/dashboard/Panel";
import RecentProjectRow from "../components/dashboard/RecentProjectRow";
import RecentDownloadRow from "../components/dashboard/RecentDownloadRow";
import { SkeletonList } from "../components/ui/Skeleton";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    totalProjects,
    totalDownloads,
    templatesUsed,
    generationsThisMonth,
    recentProjects,
    recentDownloads,
    loading,
  } = useDashboardStats();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <DashboardLayout
      title="Overview"
      subtitle={`Welcome back, ${firstName}. Here's what's happening in your workspace.`}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total projects"
          value={totalProjects}
          hint="All extensions you've generated"
          icon={FolderKanban}
          loading={loading}
        />
        <MetricCard
          label="Total downloads"
          value={totalDownloads}
          hint="ZIP downloads from your history"
          icon={Download}
          loading={loading}
        />
        <MetricCard
          label="Templates used"
          value={templatesUsed}
          hint="Starter templates applied"
          icon={Puzzle}
          loading={loading}
        />
        <MetricCard
          label="Generations this month"
          value={generationsThisMonth}
          hint={new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          icon={Calendar}
          loading={loading}
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            to="/generate"
            title="Generate extension"
            description="Describe your idea in plain English"
            icon={Sparkles}
            accent="primary"
          />
          <QuickAction
            to="/templates"
            title="Browse templates"
            description="Start from a proven blueprint"
            icon={Puzzle}
          />
          <QuickAction
            to="/projects"
            title="View all projects"
            description={`${totalProjects} project${totalProjects === 1 ? "" : "s"} in your library`}
            icon={FolderKanban}
          />
          <QuickAction
            to="/downloads"
            title="Open downloads"
            description="Access your exported ZIP files"
            icon={Download}
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Recent projects"
          description="Your latest AI-generated extensions"
          action={
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <SkeletonList rows={3} />
          ) : recentProjects.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Sparkles size={22} />
              </div>
              <p className="text-sm font-medium text-zinc-700">No projects yet</p>
              <p className="mt-1 text-sm text-zinc-500">
                Generate your first Chrome extension with AI.
              </p>
              <Link
                to="/generate"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
              >
                Create your first extension
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentProjects.map((project) => (
                <RecentProjectRow
                  key={project.projectId}
                  id={project.projectId}
                  title={project.projectName}
                  description={project.description}
                  date={new Date(project.createdAt).toLocaleDateString()}
                />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent downloads"
          description="Recently exported extension packages"
          action={
            <Link
              to="/downloads"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          }
        >
          {recentDownloads.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Download size={22} />
              </div>
              <p className="text-sm font-medium text-zinc-700">No downloads yet</p>
              <p className="mt-1 text-sm text-zinc-500">
                Export a ZIP from any project to see it here.
              </p>
              <Link
                to="/generate"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
              >
                Generate and download a ZIP
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentDownloads.map((item) => (
                <RecentDownloadRow
                  key={item.downloadId || item._id}
                  projectId={item.projectId}
                  projectName={item.projectName}
                  createdAt={item.createdAt}
                  source={item.source}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
