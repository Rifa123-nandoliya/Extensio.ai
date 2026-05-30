import { Download } from "lucide-react";
import { getProjectDownloadUrl } from "../../hooks/useDownloadHistory";

const RecentDownloadRow = ({
  projectId,
  projectName,
  createdAt,
  source,
}) => {
  const href = projectId
    ? getProjectDownloadUrl(projectId, source || "redownload")
    : "#";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-zinc-200/80 hover:bg-zinc-50/80">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
        <Download size={18} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{projectName}</p>
        <p className="text-sm text-zinc-500">
          {createdAt
            ? new Date(createdAt).toLocaleString()
            : "Recently downloaded"}
        </p>
      </div>
      {projectId && (
        <a
          href={href}
          className="shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100 transition-colors hover:bg-indigo-100"
        >
          Re-download
        </a>
      )}
    </div>
  );
};

export default RecentDownloadRow;
