function TemplateCard({
  template,
  onUseTemplate
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

      <h3 className="text-xl font-bold mb-2">
        {template.title}
      </h3>

      <p className="text-gray-500 mb-5">
        {template.description}
      </p>

      <button
        onClick={() => onUseTemplate(template.prompt)}
        className="bg-black text-white px-5 py-2 rounded-xl"
      >
        Use Template
      </button>

    </div>
  );
}

export default TemplateCard;