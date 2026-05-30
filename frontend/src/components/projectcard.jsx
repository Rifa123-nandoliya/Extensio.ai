import { Link } from "react-router-dom";
import { FolderKanban, ArrowUpRight, Trash2 } from "lucide-react";

const ProjectCard = ({ id, title, description, date, onDelete, deleting }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <div className="group relative rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="absolute right-4 top-4 z-10 rounded-lg border border-zinc-200/80 bg-white p-2 text-zinc-400 opacity-0 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
          aria-label={`Delete ${title}`}
        >
          <Trash2 size={16} />
        </button>
      )}

      <Link to={`/project/${id}`} className="block p-6">
        <div className="flex items-start justify-between gap-3 pr-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-zinc-100">
            <FolderKanban size={18} strokeWidth={1.75} />
          </div>
          <ArrowUpRight
            size={16}
            className="shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-600"
          />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{description}</p>
        <p className="mt-4 text-xs text-zinc-400">{date}</p>
      </Link>
    </div>
  );
};

export default ProjectCard;
