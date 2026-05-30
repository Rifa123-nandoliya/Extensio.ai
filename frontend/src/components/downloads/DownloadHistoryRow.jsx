import { Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectDownloadUrl } from "../../hooks/useDownloadHistory";

const sourceLabel = {
  generate: "After generation",
  redownload: "Re-download",
};

const DownloadHistoryRow = ({ download }) => {
  const href = getProjectDownloadUrl(
    download.projectId,
    download.source || "redownload"
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-100 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600">
          <Download size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900">{download.projectName}</p>
          {download.description && (
            <p className="mt-0.5 text-sm text-zinc-500 line-clamp-1">
              {download.description}
            </p>
          )}
          <p className="mt-2 text-xs text-zinc-400">
            {new Date(download.createdAt).toLocaleString()}
            {download.source && (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                {sourceLabel[download.source] || download.source}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <a
          href={href}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Download size={14} />
          Re-download ZIP
        </a>
        <Link
          to={`/project/${download.projectId}`}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <ExternalLink size={14} />
          View project
        </Link>
      </div>
    </div>
  );
};

export default DownloadHistoryRow;
