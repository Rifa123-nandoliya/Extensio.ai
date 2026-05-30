import Editor from "@monaco-editor/react";
import { getLanguageFromFilename } from "../../utils/fileLanguage";

const CodeEditor = ({ filename, content, readOnly = true }) => {
  const language = getLanguageFromFilename(filename);

  return (
    <Editor
      height="100%"
      language={language}
      value={content || ""}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        padding: { top: 12 },
        tabSize: 2,
      }}
      loading={
        <div className="flex h-full items-center justify-center bg-zinc-950 text-sm text-zinc-400">
          Loading editor…
        </div>
      }
    />
  );
};

export default CodeEditor;
