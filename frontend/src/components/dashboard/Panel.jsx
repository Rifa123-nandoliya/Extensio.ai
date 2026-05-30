const Panel = ({ title, description, action, children, className = "" }) => {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-1 border-b border-zinc-100 bg-zinc-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
          )}
        </div>
        {action && <div className="mt-2 sm:mt-0">{action}</div>}
      </div>
      <div className="p-2 sm:p-3">{children}</div>
    </section>
  );
};

export default Panel;
