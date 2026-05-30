import { FileCode2, FileJson, FileText } from "lucide-react";
import { sortFilesForExplorer } from "../../utils/fileLanguage";

const FileIcon = ({ filename }) => {
  if (filename.endsWith(".json")) {
    return <FileJson size={15} className="shrink-0 text-amber-600" />;
  }
  if (filename.endsWith(".html") || filename.endsWith(".css")) {
    return <FileText size={15} className="shrink-0 text-blue-600" />;
  }
  return <FileCode2 size={15} className="shrink-0 text-zinc-500" />;
};

const FileExplorer = ({ files, activeFilename, onSelect }) => {
  const sorted = sortFilesForExplorer(files);

  return (
    <div className="flex h-full flex-col border-r border-zinc-200/80 bg-zinc-50/50">
      <div className="border-b border-zinc-200/80 px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Explorer
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {sorted.map((file) => {
          const isActive = file.filename === activeFilename;
          return (
            <button
              key={file.filename}
              type="button"
              onClick={() => onSelect(file.filename)}
              className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-200/60"
              }`}
            >
              <FileIcon filename={file.filename} />
              <span className="truncate font-mono text-xs">{file.filename}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FileExplorer;
