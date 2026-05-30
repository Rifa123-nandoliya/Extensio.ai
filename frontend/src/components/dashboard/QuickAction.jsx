import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const QuickAction = ({ to, title, description, icon, accent }) => {
  const isPrimary = accent === "primary";

  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all ${
        isPrimary
          ? "border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-600"
          : "border-zinc-200/80 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isPrimary
            ? "bg-white/15 text-white"
            : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
        }`}
      >
        {createElement(icon, { size: 20, strokeWidth: 1.75 })}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold ${isPrimary ? "text-white" : "text-zinc-900"}`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 line-clamp-2 text-sm ${
            isPrimary ? "text-indigo-100" : "text-zinc-500"
          }`}
        >
          {description}
        </p>
      </div>
      <ArrowUpRight
        size={16}
        className={`shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${
          isPrimary ? "text-indigo-200" : "text-zinc-400"
        }`}
      />
    </Link>
  );
};

export default QuickAction;
