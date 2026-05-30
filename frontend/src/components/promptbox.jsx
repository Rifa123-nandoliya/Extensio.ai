import { Sparkles, RefreshCw } from "lucide-react";

const PromptBox = ({
  prompt,
  setPrompt,
  onGenerate,
  onRegenerate,
  loading,
  hasResult,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">
        Create your Chrome extension
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Manifest V3 · popup · content scripts · service workers
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: Build a popup extension that saves the current tab URL to local storage, with a content script that highlights links on the page and a background service worker for badge updates."
        className="mt-5 h-40 w-full resize-none rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-900/5"
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles size={16} className={loading ? "animate-pulse" : ""} />
          {loading ? "Generating…" : "Generate extension"}
        </button>

        {hasResult && onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptBox;
