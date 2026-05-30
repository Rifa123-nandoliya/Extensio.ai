import { useState } from "react";
import { X } from "lucide-react";
import { TEMPLATE_CATEGORIES } from "../../constants/templateCategories";

const emptyForm = {
  title: "",
  description: "",
  prompt: "",
  category: "Productivity",
};

const getInitialForm = (initial) =>
  initial
    ? {
        title: initial.title || "",
        description: initial.description || "",
        prompt: initial.prompt || "",
        category: initial.category || "Productivity",
      }
    : emptyForm;

const TemplateFormFields = ({
  initial,
  onClose,
  onSubmit,
  submitting,
  modalTitle,
}) => {
  const [form, setForm] = useState(() => getInitialForm(initial));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-zinc-900">{modalTitle}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-xl border border-zinc-200/80 px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
            className="w-full rounded-xl border border-zinc-200/80 px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-zinc-200/80 px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Prompt
          </label>
          <textarea
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            required
            rows={5}
            className="w-full resize-none rounded-xl border border-zinc-200/80 px-3 py-2 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
            placeholder="Describe the Chrome extension to generate…"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200/80 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save template"}
          </button>
        </div>
      </form>
    </>
  );
};

const TemplateFormModal = ({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
  title: modalTitle,
}) => {
  if (!open) return null;

  const formKey = initial?.templateId ?? "new";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/80 bg-white shadow-xl">
        <TemplateFormFields
          key={formKey}
          initial={initial}
          onClose={onClose}
          onSubmit={onSubmit}
          submitting={submitting}
          modalTitle={modalTitle}
        />
      </div>
    </div>
  );
};

export default TemplateFormModal;
