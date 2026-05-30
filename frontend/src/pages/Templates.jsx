import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Search, Plus } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import TemplateCard from "../components/TemplateCard";
import CategoryFilter from "../components/templates/CategoryFilter";
import TemplateFormModal from "../components/templates/TemplateFormModal";
import { useTemplates } from "../hooks/useTemplates";
import { incrementTemplatesUsed } from "../hooks/useDownloads";
import { TEMPLATE_CATEGORIES } from "../constants/templateCategories";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  publishToMarketplace,
} from "../services/api";
import { showSuccess } from "../utils/toast";
import { SkeletonGrid, SkeletonCard } from "../components/ui/Skeleton";

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro =
    user?.subscriptionPlan === "pro" &&
    ["active", "trialing"].includes(user?.subscriptionStatus);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { templates, loading, error, refetch } = useTemplates({
    category: activeCategory || undefined,
    search: searchQuery || undefined,
  });

  const categories = useMemo(
    () => TEMPLATE_CATEGORIES,
    []
  );

  const handlePublish = async (template) => {
    await publishToMarketplace(template.templateId);
    showSuccess("Published to marketplace");
    refetch();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const applyTemplate = (prompt) => {
    localStorage.setItem("selectedTemplate", prompt);
    incrementTemplatesUsed();
    navigate("/generate");
  };

  const handleSaveTemplate = async (form) => {
    try {
      setSubmitting(true);
      if (editingTemplate) {
        await updateTemplate(editingTemplate.templateId, form);
      } else {
        await createTemplate(form);
      }
      setModalOpen(false);
      setEditingTemplate(null);
      refetch();
      showSuccess(editingTemplate ? "Template updated" : "Template saved");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (template) => {
    if (
      !window.confirm(`Delete "${template.title}"? This cannot be undone.`)
    ) {
      return;
    }

    try {
      setDeletingId(template.templateId);
      await deleteTemplate(template.templateId);
      refetch();
      showSuccess("Template deleted");
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    setEditingTemplate(null);
    setModalOpen(true);
  };

  const openEdit = (template) => {
    setEditingTemplate(template);
    setModalOpen(true);
  };

  return (
    <DashboardLayout
      title="Templates"
      subtitle="Browse curated starters or save your own — one click to generate"
    >
      {!isPro && (
        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-amber-900">
            Upgrade to Pro for premium templates and unlimited generations.
          </p>
          <Link
            to="/billing"
            className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            View plans
          </Link>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search templates…"
            className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
        </form>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Plus size={16} />
          Save custom template
        </button>
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load templates. Please refresh the page.
        </div>
      )}

      {loading ? (
        <SkeletonGrid count={6} Card={() => <SkeletonCard className="h-52" />} />
      ) : templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <p className="text-zinc-500">No templates found.</p>
          {(searchQuery || activeCategory) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setActiveCategory("");
              }}
              className="mt-3 text-sm font-medium text-zinc-900 hover:underline"
            >
              Clear filters
            </button>
          )}
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Plus size={16} />
            Create your first template
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-500">
            {templates.length} template{templates.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard
                key={template.templateId}
                title={template.title}
                description={template.description}
                category={template.category}
                isBuiltIn={template.isBuiltIn}
                isPremium={template.isPremium}
                isPublic={template.isPublic}
                onUse={() => applyTemplate(template.prompt)}
                onPublish={
                  template.isBuiltIn ? undefined : () => handlePublish(template)
                }
                onEdit={
                  template.isBuiltIn ? undefined : () => openEdit(template)
                }
                onDelete={
                  template.isBuiltIn
                    ? undefined
                    : () => handleDelete(template)
                }
                deleting={deletingId === template.templateId}
              />
            ))}
          </div>
        </>
      )}

      <TemplateFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleSaveTemplate}
        initial={editingTemplate}
        submitting={submitting}
        title={
          editingTemplate ? "Edit custom template" : "Save custom template"
        }
      />
    </DashboardLayout>
  );
};

export default Templates;
