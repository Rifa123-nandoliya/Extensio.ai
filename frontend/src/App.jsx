import { useState } from "react";
import { generateExtension } from "./api";
import { Link, useLocation } from "react-router-dom";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeFile, setActiveFile] = useState(0);

  const location = useLocation();

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
      setActiveFile(0);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚡ Extensio AI</h2>
      </div>

      <div style={styles.mainLayout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>

          {/* HOME */}
          <Link
            to="/"
            style={{
              ...styles.sideItem,
              ...(location.pathname === "/" && styles.activeItem)
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            🏠 Home
          </Link>

          {/* GENERATE */}
          <p
            style={{
              ...styles.sideItem,
              ...(location.pathname === "/" && styles.activeItem)
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            📂 Generate
          </p>

          {/* DOWNLOADS (UPDATED) */}
          <Link
            to="/downloads"
            style={{
              ...styles.sideItem,
              ...(location.pathname === "/downloads" && styles.activeItem)
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            ⬇ Downloads
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            style={{
              ...styles.sideItem,
              ...(location.pathname === "/contact" && styles.activeItem)
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            📞 Contact
          </Link>

        </div>

        {/* MAIN */}
        <div style={styles.container}>

          <h1 style={styles.title}>🚀 No-Code Extension Factory</h1>
          <p style={styles.subtitle}>
            Generate Chrome extensions instantly using AI
          </p>

          {/* INPUT */}
          <div style={styles.card}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your Chrome extension..."
              style={styles.textarea}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={styles.button}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              {loading ? "✨ Generating..." : "⚡ Generate Extension"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </div>

          {/* RESULT */}
          {result && (
            <div style={styles.resultCard}>

              <h2 style={styles.projectName}>{result.data.projectName}</h2>
              <p style={styles.description}>{result.data.description}</p>

              {/* TABS */}
              <div style={styles.tabs}>
                {result.data.files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFile(index)}
                    style={{
                      ...styles.tab,
                      background:
                        activeFile === index ? "#6366F1" : "transparent"
                    }}
                  >
                    {file.filename}
                  </button>
                ))}
              </div>

              {/* FILE */}
              <div style={styles.fileCard}>
                <div style={styles.fileHeader}>
                  <span style={styles.fileName}>
                    {result.data.files[activeFile].filename}
                  </span>

                  <button
                    style={styles.copyBtn}
                    onClick={() =>
                      copyToClipboard(result.data.files[activeFile].content)
                    }
                  >
                    📋 Copy
                  </button>
                </div>

                <pre style={styles.code}>
                  {result.data.files[activeFile].content}
                </pre>
              </div>

              {/* DOWNLOAD (UPDATED WITH HISTORY) */}
              <button
                style={styles.downloadBtn}
                onClick={() => {
                  const history =
                    JSON.parse(localStorage.getItem("downloads")) || [];

                  history.push({
                    name: result.data.projectName,
                    description: result.data.description,
                    date: new Date().toLocaleString()
                  });

                  localStorage.setItem(
                    "downloads",
                    JSON.stringify(history)
                  );

                  window.open(result.downloadUrl, "_blank");
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                ⬇ Download ZIP
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0F172A, #1E3A8A, #2563EB)",
    color: "#fff",
    fontFamily: "Segoe UI"
  },

  navbar: {
    padding: "15px 30px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)"
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#60A5FA"
  },

  mainLayout: {
    display: "flex"
  },

  sidebar: {
    width: "200px",
    padding: "20px",
    background: "rgba(0,0,0,0.3)",
    minHeight: "100vh"
  },

  sideItem: {
    display: "block",
    marginBottom: "15px",
    cursor: "pointer",
    color: "#fff",
    textDecoration: "none",
    transition: "all 0.3s ease",
    padding: "8px",
    borderRadius: "8px"
  },

  activeItem: {
    background: "#1E293B",
    fontWeight: "bold"
  },

  container: {
    flex: 1,
    padding: "30px"
  },

  title: {
    textAlign: "center",
    fontSize: "32px"
  },

  subtitle: {
    textAlign: "center",
    color: "#CBD5F5",
    marginBottom: "20px"
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    marginBottom: "20px"
  },

  textarea: {
    width: "100%",
    height: "120px",
    borderRadius: "10px",
    padding: "10px"
  },

  button: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(to right, #6366F1, #8B5CF6)",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s"
  },

  error: {
    color: "red"
  },

  resultCard: {
    background: "rgba(0,0,0,0.5)",
    padding: "20px",
    borderRadius: "15px"
  },

  projectName: {
    color: "#A5B4FC"
  },

  description: {
    color: "#CBD5F5"
  },

  tabs: {
    display: "flex",
    marginTop: "15px",
    gap: "10px"
  },

  tab: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    color: "#fff"
  },

  fileCard: {
    background: "#020617",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px"
  },

  fileHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },

  fileName: {
    color: "#60A5FA"
  },

  copyBtn: {
    background: "#22C55E",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  code: {
    color: "#22C55E",
    overflowX: "auto"
  },

  downloadBtn: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(to right, #22C55E, #16A34A)",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default App;