import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Store } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import CategoryFilter from "../components/templates/CategoryFilter";
import { TEMPLATE_CATEGORIES } from "../constants/templateCategories";
import { getMarketplaceTemplates, rateMarketplaceTemplate } from "../services/api";
import { SkeletonGrid, SkeletonCard } from "../components/ui/Skeleton";
import { showSuccess } from "../utils/toast";

const Marketplace = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceTemplates({
        category: category || undefined,
        search: search || undefined,
        sort,
      });
      setTemplates(data.templates ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates();
  };

  const handleUse = (prompt) => {
    localStorage.setItem("selectedTemplate", prompt);
    navigate("/generate");
  };

  const handleRate = async (templateId, rating) => {
    await rateMarketplaceTemplate(templateId, rating);
    showSuccess("Thanks for your rating!");
    fetchTemplates();
  };

  return (
    <DashboardLayout
      title="Template marketplace"
      subtitle="Discover community-published extension templates"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearch} className="relative max-w-md flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marketplace…"
            className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-900/5"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 text-sm"
        >
          <option value="popular">Most popular</option>
          <option value="rating">Top rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={TEMPLATE_CATEGORIES}
          activeCategory={category}
          onChange={setCategory}
        />
      </div>

      {loading ? (
        <SkeletonGrid count={6} Card={() => <SkeletonCard className="h-56" />} />
      ) : templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <Store className="mx-auto text-zinc-400" size={32} />
          <p className="mt-3 text-zinc-500">No public templates yet.</p>
          <p className="mt-1 text-sm text-zinc-400">
            Publish your custom templates from the Templates page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.templateId}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {t.category}
              </p>
              <h3 className="mt-1 font-semibold text-zinc-900">{t.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                {t.description}
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                by {t.authorName || "Community"} · {t.usageCount ?? 0} uses
              </p>
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm text-zinc-700">
                  {t.ratingAvg?.toFixed(1) ?? "0.0"} ({t.ratingCount ?? 0})
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUse(t.prompt)}
                  className="flex-1 rounded-xl bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Use template
                </button>
                <button
                  type="button"
                  onClick={() => handleRate(t.templateId, 5)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                  title="Rate 5 stars"
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Marketplace;
