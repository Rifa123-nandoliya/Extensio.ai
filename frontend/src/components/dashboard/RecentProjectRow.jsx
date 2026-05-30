import { Link } from "react-router-dom";
import { ChevronRight, FolderKanban } from "lucide-react";

const RecentProjectRow = ({ id, title, description, date }) => {
  return (
    <Link
      to={`/project/${id}`}
      className="flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-zinc-200/80 hover:bg-zinc-50/80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
        <FolderKanban size={18} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{title}</p>
        <p className="truncate text-sm text-zinc-500">{description}</p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-xs text-zinc-400">{date}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-zinc-300" />
    </Link>
  );
};

export default RecentProjectRow;
