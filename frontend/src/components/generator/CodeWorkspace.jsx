import { useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import { showError } from "../../utils/toast";

const CodeWorkspace = ({ files, activeFilename, onSelectFile }) => {
  const [copied, setCopied] = useState(false);

  const activeFile = useMemo(
    () => files.find((f) => f.filename === activeFilename) || files[0],
    [files, activeFilename]
  );

  const handleCopy = async () => {
    if (!activeFile?.content) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showError("Failed to copy to clipboard");
    }
  };

  if (!files?.length) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      <div className="flex flex-col border-b border-zinc-200/80 bg-zinc-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Generated files
          </h2>
          <p className="text-xs text-zinc-500">
            {files.length} file{files.length === 1 ? "" : "s"} · Manifest V3
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy file
            </>
          )}
        </button>
      </div>

      <div className="flex h-[min(70vh,560px)] flex-col lg:flex-row">
        <div className="h-48 shrink-0 lg:h-auto lg:w-56">
          <FileExplorer
            files={files}
            activeFilename={activeFile?.filename}
            onSelect={onSelectFile}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <p className="font-mono text-xs text-zinc-400">
              {activeFile?.filename}
            </p>
          </div>
          <div className="min-h-0 flex-1">
            <CodeEditor
              filename={activeFile?.filename}
              content={activeFile?.content}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
