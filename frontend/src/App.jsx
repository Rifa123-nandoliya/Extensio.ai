import { useState } from "react";
import { generateExtension } from "./api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await generateExtension(prompt);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-2">
          No-Code Extension Factory
        </h1>
        <p className="text-gray-600 mb-8">
          Generate Chrome extensions instantly using AI
        </p>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Chrome extension..."
            className="w-full h-36 border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 px-6 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Extension"}
          </button>

          {error && (
            <p className="mt-3 text-red-500">{error}</p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
            
            <div>
              <h2 className="text-2xl font-bold">
                {result.data.projectName}
              </h2>
              <p className="text-gray-600 mt-1">
                {result.data.description}
              </p>
            </div>

            {/* Files */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Generated Files
              </h3>

              <div className="space-y-4">
                {result.data.files.map((file, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <p className="font-semibold mb-2">
                      {file.filename}
                    </p>

                    <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                      {file.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Download */}
            <a
              href={result.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;