import { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import PromptBox from "../components/PromptBox";
import CodeWorkspace from "../components/generator/CodeWorkspace";
import GenerationStatus from "../components/generator/GenerationStatus";
import { generateExtension } from "../services/api";
import { getProjectDownloadUrl } from "../hooks/useDownloadHistory";

const pickDefaultFile = (files) => {
  if (!files?.length) return null;
  const manifest = files.find((f) => f.filename === "manifest.json");
  return manifest?.filename || files[0].filename;
};

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeFilename, setActiveFilename] = useState(null);

  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      setPrompt(savedTemplate);
      localStorage.removeItem("selectedTemplate");
    }
  }, []);

  const runGeneration = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt describing your extension.");
      return;
    }

    setError(null);

    try {
      setLoading(true);
      const data = await generateExtension(prompt);
      setResult(data);

      const files = data?.data?.files || [];
      setActiveFilename(pickDefaultFile(files));

      const downloads = JSON.parse(
        localStorage.getItem("downloads") || "[]"
      );

      downloads.unshift({
        projectName: data?.data?.projectName,
        downloadUrl: data?.downloadUrl,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("downloads", JSON.stringify(downloads));
    } catch (err) {
      console.error(err);
      setResult(null);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Extension generation failed. Please try again or simplify your prompt.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const handleDownload = () => {
    if (!result?.projectId) return;
    window.open(
      getProjectDownloadUrl(result.projectId, "generate"),
      "_blank"
    );
  };

  const files = result?.data?.files || [];

  return (
    <DashboardLayout
      title="Generate"
      subtitle="AI-powered Chrome Extension builder with Manifest V3"
    >
      <div className="space-y-0">
        <PromptBox
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={runGeneration}
          onRegenerate={runGeneration}
          loading={loading}
          hasResult={Boolean(result)}
        />

        <GenerationStatus
          error={error}
          onRetry={runGeneration}
          loading={loading}
        />

        {loading && !result && (
          <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
            <p className="mt-4 text-sm font-medium text-zinc-700">
              Generating your extension…
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Validating manifest, scripts, and files with recovery enabled
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-2 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">
                {result.data?.projectName}
              </p>
              <p className="text-xs text-zinc-500">{result.data?.description}</p>
            </div>
            {result.downloadUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                <Download size={16} />
                Download ZIP
              </button>
            )}
          </div>
        )}

        {files.length > 0 && !loading && (
          <CodeWorkspace
            files={files}
            activeFilename={activeFilename}
            onSelectFile={setActiveFilename}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
