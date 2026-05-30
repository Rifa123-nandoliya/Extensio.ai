import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

const GenerationStatus = ({ error, onRetry, loading }) => {
  if (!error) return null;

  return (
    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
      <div className="flex gap-3">
        <AlertCircle className="shrink-0 text-red-600" size={20} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-red-900">
            Generation failed
          </h3>
          <p className="mt-1 text-sm text-red-700 break-words">{error}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Try again
              </button>
            )}
            {error?.toLowerCase().includes("upgrade") && (
              <Link
                to="/billing"
                className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-50"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationStatus;
