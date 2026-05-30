import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Download, History, Share2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import CodeWorkspace from "../components/generator/CodeWorkspace";
import { useProject } from "../hooks/useProject";
import {
  deleteProject,
  getProjectVersions,
  restoreProjectVersion,
  shareProject,
  setProjectVisibility,
} from "../services/api";
import { showSuccess } from "../utils/toast";
import { Skeleton, SkeletonList } from "../components/ui/Skeleton";
import { getProjectDownloadUrl } from "../hooks/useDownloadHistory";
import { useWorkspace } from "../hooks/useWorkspace";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProject(id);
  const { activeWorkspaceId } = useWorkspace();
  const [deleting, setDeleting] = useState(false);
  const [activeFilename, setActiveFilename] = useState(null);
  const [versions, setVersions] = useState([]);
  const [shareEmail, setShareEmail] = useState("");
  const [visibility, setVisibility] = useState("private");

  useEffect(() => {
    if (project?.visibility) setVisibility(project.visibility);
  }, [project?.visibility]);

  useEffect(() => {
    if (!id || !project) return;
    getProjectVersions(id).then((data) => {
      setVersions(data.versions ?? []);
    });
  }, [id, project?.currentVersion]);

  const defaultFilename = useMemo(() => {
    if (!project?.files?.length) return null;
    const manifest = project.files.find((f) => f.filename === "manifest.json");
    return manifest?.filename || project.files[0].filename;
  }, [project]);

  const selectedFilename = activeFilename || defaultFilename;

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${project?.projectName}"? This will remove all files and cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteProject(id);
      showSuccess("Project deleted");
      navigate("/projects", { replace: true });
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!project?.projectId) return;
    window.open(
      getProjectDownloadUrl(project.projectId, "redownload"),
      "_blank"
    );
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    await shareProject(id, shareEmail.trim(), "view");
    setShareEmail("");
    showSuccess("Project shared");
  };

  const handleVisibility = async (value) => {
    setVisibility(value);
    await setProjectVisibility(id, value, activeWorkspaceId);
    showSuccess("Visibility updated");
    refetch();
  };

  const handleRestore = async (versionNumber) => {
    if (!window.confirm(`Restore version ${versionNumber}?`)) return;
    await restoreProjectVersion(id, versionNumber);
    showSuccess("Version restored");
    refetch();
  };

  if (loading) {
    return (
      <DashboardLayout title="Project" subtitle="Loading project details…">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <SkeletonList rows={4} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout title="Project" subtitle="Project not found">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 text-center">
          <p className="text-zinc-500">This project could not be loaded.</p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={project.projectName}
      subtitle={project.description}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            <Download size={16} />
            Download ZIP
          </button>
          {project.access === "owner" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 size={16} />
              {deleting ? "Deleting…" : "Delete project"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Prompt
        </h2>
        <p className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">
          {project.prompt}
        </p>
        <p className="mt-4 text-xs text-zinc-400">
          Created {new Date(project.createdAt).toLocaleString()}
          {project.isShared && " · Shared with you"}
          {project.currentVersion && ` · v${project.currentVersion}`}
        </p>
      </div>

      {project.access === "owner" && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">Sharing</h2>
            </div>
            <form onSubmit={handleShare} className="mt-3 flex gap-2">
              <input
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Teammate email"
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                Share
              </button>
            </form>
            <select
              value={visibility}
              onChange={(e) => handleVisibility(e.target.value)}
              className="mt-3 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="private">Private</option>
              <option value="workspace">Workspace</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <History size={16} className="text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900">
                Version history
              </h2>
            </div>
            <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto">
              {versions.map((v) => (
                <li
                  key={v.versionId}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">v{v.versionNumber}</span>
                    {v.label && (
                      <span className="ml-2 text-zinc-500">{v.label}</span>
                    )}
                  </div>
                  {v.versionNumber !== project.currentVersion && (
                    <button
                      type="button"
                      onClick={() => handleRestore(v.versionNumber)}
                      className="text-xs font-medium text-zinc-700 hover:underline"
                    >
                      Restore
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <CodeWorkspace
        files={project.files}
        activeFilename={selectedFilename}
        onSelectFile={setActiveFilename}
      />
    </DashboardLayout>
  );
};

export default ProjectDetails;
