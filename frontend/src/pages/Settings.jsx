import { useNavigate } from "react-router-dom";

export default function Settings() {

  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      <button
        onClick={() => navigate("/")}
        style={styles.backBtn}
      >
        ← Back
      </button>

      <h1 style={styles.heading}>
        ⚙ Settings
      </h1>

      <div style={styles.grid}>

        {/* PLAN */}
        <div style={styles.card}>

          <h2>Plan & Usage</h2>

          <div style={styles.progressItem}>
            <p>Extensions Generated: 3/5</p>

            <div style={styles.progressBar}>
              <div style={styles.progress}></div>
            </div>
          </div>

          <div style={styles.progressItem}>
            <p>AI Debugs Used: 1/2</p>

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

        {/* DEVELOPER */}
        <div style={styles.card}>

          <h2>Developer Defaults</h2>

          <select style={styles.select}>
            <option>Vanilla JS</option>
            <option>React</option>
          </select>

          <select style={styles.select}>
            <option>Standard CSS</option>
            <option>Tailwind CSS</option>
          </select>

          <div style={styles.toggleRow}>
            <p>Minify Code</p>

            <input type="checkbox" />
          </div>

        </div>

        {/* API */}
        <div style={styles.card}>

          <h2>API Connections</h2>

          <input
            placeholder="Supabase URL"
            style={styles.input}
          />

          <input
            placeholder="Supabase Anon Key"
            style={styles.input}
          />

          <input
            placeholder="OpenAI API Key"
            style={styles.input}
          />

          <button style={styles.connectBtn}>
            Connect (Pro)
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#F3F4F6",
  },

  backBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    marginBottom: "20px",
    cursor: "pointer",
  },

  heading: {
    fontSize: "42px",
    marginBottom: "30px",
    color: "#111827",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid #ddd",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
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
    cursor: "pointer",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "15px",
  },

  toggleRow: {
    marginTop: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "15px",
    border: "1px solid #ddd",
  },

  connectBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};