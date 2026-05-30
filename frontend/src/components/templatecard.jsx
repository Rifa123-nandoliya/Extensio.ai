import { Sparkles, Pencil, Trash2, User, Crown, Store } from "lucide-react";
import { CATEGORY_STYLES } from "../constants/templateCategories";

const TemplateCard = ({
  title,
  description,
  category,
  isBuiltIn,
  isPremium,
  onUse,
  onEdit,
  onDelete,
  onPublish,
  isPublic,
  deleting,
}) => {
  const categoryClass =
    CATEGORY_STYLES[category] || "bg-zinc-50 text-zinc-600 border-zinc-200";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryClass}`}
        >
          {category}
        </span>
        <div className="flex items-center gap-2">
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
              <Crown size={12} />
              Pro
            </span>
          )}
          {!isBuiltIn && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <User size={12} />
              Custom
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-zinc-500 line-clamp-3">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onUse}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 min-w-[120px]"
        >
          <Sparkles size={16} />
          Use template
        </button>

        {!isBuiltIn && onPublish && !isPublic && (
          <button
            type="button"
            onClick={onPublish}
            className="rounded-xl border border-zinc-200/80 p-2.5 text-zinc-600 hover:bg-zinc-50"
            aria-label="Publish to marketplace"
            title="Publish to marketplace"
          >
            <Store size={16} />
          </button>
        )}

        {!isBuiltIn && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-zinc-200/80 p-2.5 text-zinc-600 hover:bg-zinc-50"
            aria-label="Edit template"
          >
            <Pencil size={16} />
          </button>
        )}

        {!isBuiltIn && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 p-2.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
            aria-label="Delete template"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
