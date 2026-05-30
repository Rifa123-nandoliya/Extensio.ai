const CategoryFilter = ({ categories, activeCategory, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          !activeCategory
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === category
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
