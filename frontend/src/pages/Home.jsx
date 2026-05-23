import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { generateExtension } from "../api";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const location = useLocation();

  const templates = [
    {
      title: "Text Highlighter",
      desc: "Highlight important text instantly",
      icon: "📝",
    },
    {
      title: "Dark Mode Toggle",
      desc: "Enable dark mode on websites",
      icon: "🌙",
    },
    {
      title: "Tab Organizer",
      desc: "Manage tabs efficiently",
      icon: "📂",
    },
    {
      title: "Social Scheduler",
      desc: "Schedule social media posts",
      icon: "📅",
    },
  ];

  const handleGenerate = async () => {

    if (!prompt.trim()) {
      setError("Please enter extension idea");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response =
        await generateExtension(prompt);

      console.log(response);

      // FIXED
      setResult(response.data);

      // SAVE HISTORY
      const history =
        JSON.parse(
          localStorage.getItem("downloads")
        ) || [];

      history.push({
        name:
          response.data.projectName,

        description:
          response.data.description,

        date:
          new Date().toLocaleString(),
      });

      localStorage.setItem(
        "downloads",
        JSON.stringify(history)
      );

    } catch (err) {

      console.error(err);

      setError(
        "Failed to generate extension"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <div>

          <h2 style={styles.logo}>
            ⚡ No-Code Extension Factory
          </h2>

          <div style={styles.menu}>

            <Link
              to="/"
              style={{
                ...styles.menuItem,
                ...(location.pathname === "/" && styles.active),
              }}
            >
              🏠 Home
            </Link>

            <Link
              to="/downloads"
              style={{
                ...styles.menuItem,
                ...(location.pathname === "/downloads" &&
                  styles.active),
              }}
            >
              📂 My Projects
            </Link>

            <Link
              to="/templates"
              style={{
                ...styles.menuItem,
                ...(location.pathname === "/templates" &&
                  styles.active),
              }}
            >
              📑 Templates
            </Link>

            <Link
              to="/settings"
              style={{
                ...styles.menuItem,
                ...(location.pathname === "/settings" &&
                  styles.active),
              }}
            >
              ⚙ Settings
            </Link>

            <Link
              to="/contact"
              style={{
                ...styles.menuItem,
                ...(location.pathname === "/contact" &&
                  styles.active),
              }}
            >
              📞 Contact
            </Link>

          </div>
        </div>

        <div style={styles.bottom}>
          <p>AI Powered Platform</p>
          <small>Frontend UI by Shobha</small>
        </div>

      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              CREATE YOUR CHROME EXTENSION
            </h1>

            <p style={styles.subheading}>
              Build AI-powered extensions instantly
            </p>
          </div>

          <div style={styles.profile}>
            👩‍💻 Shobha
          </div>

        </div>

        {/* INPUT */}
        <div style={styles.inputRow}>

          <textarea
            placeholder="Describe the extension you want to build in plain English..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.textarea}
          />

          <button
            onClick={handleGenerate}
            style={styles.generateBtn}
          >
            {loading
              ? "Generating..."
              : "🚀 Generate"}
          </button>

        </div>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {/* GENERATED OUTPUT */}
        {result && (

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
            }}
          >

            <h2>
              {result.projectName}
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: "20px",
                color: "#6B7280",
              }}
            >
              {result.description}
            </p>

            {result.files.map((file, index) => (

              <div
                key={index}
                style={{
                  background: "#111827",
                  color: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >

                <h4>{file.filename}</h4>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowX: "auto",
                    marginTop: "10px",
                  }}
                >
                  {file.content}
                </pre>

              </div>

            ))}

            <a
              href="https://example.com/demo.zip"
              target="_blank"
              rel="noreferrer"
            >

              <button style={styles.downloadMain}>
                ⬇ Download ZIP
              </button>

            </a>

          </div>

        )}

        {/* DASHBOARD GRID */}
        <div style={styles.grid}>

          {/* LEFT */}
          <div style={styles.leftPanel}>

            <div style={styles.sectionTitle}>
              TEMPLATE GALLERY
            </div>

            <div style={styles.templateGrid}>

              {templates.map((item, index) => (
                <div
                  key={index}
                  style={styles.templateCard}
                >
                  <div style={styles.templateIcon}>
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p style={styles.templateDesc}>
                    {item.desc}
                  </p>

                  <button style={styles.freeBtn}>
                    Free
                  </button>
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div style={styles.rightPanel}>

            <div style={styles.previewCard}>

              <div style={styles.sectionTitle}>
                LIVE SANDBOX PREVIEW
              </div>

              <div style={styles.previewBox}>
                <div style={styles.browserBar}></div>

                <div style={styles.fakeExtension}>
                  <h4>Text Highlighter</h4>

                  <button style={styles.smallBtn}>
                    Popup
                  </button>

                  <button style={styles.smallBtn}>
                    Test
                  </button>

                  <button style={styles.smallBtn}>
                    Download
                  </button>
                </div>
              </div>

              <button style={styles.downloadMain}>
                Download ZIP (Free)
              </button>

            </div>

            <div style={styles.planCard}>

              <h3>MY PLAN & USAGE</h3>

              <div style={styles.progressItem}>
                <p>Generations (3/5 Free)</p>

                <div style={styles.progressBar}>
                  <div style={styles.progress}></div>
                </div>
              </div>

              <div style={styles.progressItem}>
                <p>AI Debugs (1/2 Free)</p>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progress,
                      width: "50%",
                    }}
                  ></div>
                </div>
              </div>

              <button style={styles.upgradeBtn}>
                Upgrade To Pro
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {

  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#F3F4F6",
    color: "#111827",
  },

  sidebar: {
    width: "250px",
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: "22px",
    marginBottom: "30px",
    fontWeight: "bold",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  menuItem: {
    padding: "14px",
    borderRadius: "12px",
    background: "#fff",
    border: "1px solid #E5E7EB",
    textDecoration: "none",
    color: "#111827",
    fontWeight: "600",
    transition: "0.3s",
  },

  active: {
    background: "#EEF2FF",
    border: "1px solid #6366F1",
  },

  bottom: {
    background: "#F9FAFB",
    padding: "15px",
    borderRadius: "12px",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "40px",
    fontWeight: "bold",
  },

  subheading: {
    color: "#6B7280",
  },

  profile: {
    background: "#EEF2FF",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
  },

  inputRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  textarea: {
    flex: 1,
    height: "80px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    padding: "15px",
    resize: "none",
    fontSize: "15px",
  },

  generateBtn: {
    width: "220px",
    background: "#DC2626",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },

  leftPanel: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #ddd",
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: "20px",
  },

  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
  },

  templateCard: {
    border: "1px solid #ddd",
    borderRadius: "15px",
    padding: "20px",
    background: "#fff",
  },

  templateIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  templateDesc: {
    color: "#6B7280",
    marginTop: "10px",
    marginBottom: "15px",
  },

  freeBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
  },

  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  previewCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #ddd",
  },

  previewBox: {
    background: "#F3F4F6",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
  },

  browserBar: {
    height: "30px",
    background: "#E5E7EB",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  fakeExtension: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  smallBtn: {
    margin: "5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    background: "#DC2626",
    color: "#fff",
  },

  downloadMain: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    fontWeight: "bold",
  },

  planCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #ddd",
  },

  progressItem: {
    marginTop: "20px",
  },

  progressBar: {
    width: "100%",
    height: "10px",
    background: "#E5E7EB",
    borderRadius: "10px",
    marginTop: "5px",
  },

  progress: {
    width: "70%",
    height: "100%",
    background: "#DC2626",
    borderRadius: "10px",
  },

  upgradeBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#DC2626",
    color: "#fff",
    fontWeight: "bold",
  },
};