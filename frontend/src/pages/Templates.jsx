import { useNavigate } from "react-router-dom";

export default function Templates() {

  const navigate = useNavigate();

  const templates = [
    {
      name: "Text Highlighter",
      desc: "Highlight important text instantly",
      icon: "📝",
    },
    {
      name: "Dark Mode Toggle",
      desc: "Enable dark mode everywhere",
      icon: "🌙",
    },
    {
      name: "Tab Organizer",
      desc: "Manage tabs efficiently",
      icon: "📂",
    },
    {
      name: "Social Scheduler",
      desc: "Schedule social posts",
      icon: "📅",
    },
  ];

  return (
    <div style={styles.page}>

      <button
        onClick={() => navigate("/")}
        style={styles.backBtn}
      >
        ← Back
      </button>

      <h1 style={styles.heading}>
        📑 Templates Gallery
      </h1>

      <div style={styles.grid}>

        {templates.map((item, index) => (

          <div key={index} style={styles.card}>

            <div style={styles.icon}>
              {item.icon}
            </div>

            <h2 style={styles.cardTitle}>
              {item.name}
            </h2>

            <p style={styles.desc}>
              {item.desc}
            </p>

            <button
              style={styles.btn}
              onClick={() => {
                localStorage.setItem(
                  "selectedTemplate",
                  item.name
                );

                navigate("/");
              }}
            >
              Use Template
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#F3F4F6",
    fontFamily: "Arial",
  },

  backBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    marginBottom: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  heading: {
    fontSize: "42px",
    marginBottom: "30px",
    color: "#111827",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "25px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  cardTitle: {
    color: "#111827",
    fontSize: "24px",
    marginBottom: "10px",
    fontWeight: "bold",
  },

  desc: {
    color: "#4B5563",
    marginBottom: "20px",
    fontSize: "16px",
  },

  btn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(to right,#DC2626,#EF4444)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
};