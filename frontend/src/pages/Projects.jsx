import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { SkeletonGrid, SkeletonCard, SkeletonList } from "../components/ui/Skeleton";
import { showSuccess } from "../utils/toast";

const Projects = () => {
  const { projects, loading, removeProjectLocally } = useProjects();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => {
      const name = project.projectName?.toLowerCase() || "";
      const description = project.description?.toLowerCase() || "";
      const prompt = project.prompt?.toLowerCase() || "";
      return (
        name.includes(query) ||
        description.includes(query) ||
        prompt.includes(query)
      );
    });
  }, [projects, search]);

  const handleDelete = async (projectId) => {
    const project = projects.find((p) => p.projectId === projectId);
    const label = project?.projectName || "this project";

    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(projectId);
      await deleteProject(projectId);
      removeProjectLocally(projectId);
      showSuccess("Project deleted");
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout
      title="Projects"
      subtitle="Browse and manage your generated Chrome extensions"
    >
      <div className="mb-6 relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, description, or prompt…"
          className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
        />
      </div>

      {loading ? (
        <SkeletonGrid count={6} Card={SkeletonCard} />
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-zinc-500">No projects yet.</p>
          <Link
            to="/generate"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Sparkles size={16} />
            Generate extension
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-6 py-12 text-center">
          <p className="text-zinc-500">No projects match &quot;{search}&quot;</p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-sm font-medium text-zinc-900 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-500">
            {filteredProjects.length} of {projects.length} project
            {projects.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.projectId}
                id={project.projectId}
                title={project.projectName}
                description={project.description}
                date={new Date(project.createdAt).toLocaleDateString()}
                onDelete={handleDelete}
                deleting={deletingId === project.projectId}
              />
            ))}
          </div>
        </>
      )}

      {!loading && projects.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Generate another extension
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
