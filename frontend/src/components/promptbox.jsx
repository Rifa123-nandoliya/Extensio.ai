function PromptBox({
  prompt,
  setPrompt,
  handleGenerate,
  loading
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the Chrome extension you want..."
        className="w-full h-36 border border-gray-300 rounded-xl p-4 outline-none resize-none"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 bg-black text-white px-6 py-3 rounded-xl"
      >
        {loading ? "Generating..." : "Generate Extension"}
      </button>

    </div>
  );
}

export default PromptBox;