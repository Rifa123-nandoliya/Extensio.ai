import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Downloads() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const history =
      JSON.parse(localStorage.getItem("downloads")) || [];

    setData(history);

  }, []);

  const deleteItem = (index) => {

    const updated = [...data];

    updated.splice(index, 1);

    setData(updated);

    localStorage.setItem(
      "downloads",
      JSON.stringify(updated)
    );
  };

  const clearAll = () => {

    localStorage.removeItem("downloads");

    setData([]);
  };

  return (
    <div style={styles.page}>

      <button
        onClick={() => navigate("/")}
        style={styles.backBtn}
      >
        ← Back
      </button>

      <h1 style={styles.title}>
        ⬇ Downloads
      </h1>

      {data.length > 0 && (

        <button
          style={styles.clearBtn}
          onClick={clearAll}
        >
          🗑 Clear All
        </button>

      )}

      {data.length === 0 ? (

        <p style={styles.empty}>
          No downloads yet
        </p>

      ) : (

        data.map((item, index) => (

          <div key={index} style={styles.card}>

            <div style={styles.row}>

              <h3 style={styles.name}>
                {item.name}
              </h3>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteItem(index)}
              >
                ❌
              </button>

            </div>

            <p style={styles.desc}>
              {item.description}
            </p>

            <small style={styles.date}>
              {item.date}
            </small>

          </div>

        ))

      )}

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

  title: {
    marginBottom: "20px",
    color: "#111827",
    fontSize: "42px",
    fontWeight: "bold",
  },

  empty: {
    color: "#6B7280",
    fontSize: "18px",
  },

  card: {
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "15px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    color: "#111827",
    fontSize: "22px",
    fontWeight: "bold",
  },

  desc: {
    color: "#4B5563",
    marginTop: "10px",
  },

  date: {
    color: "#6B7280",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  clearBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    background: "#DC2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteBtn: {
    border: "none",
    background: "#DC2626",
    color: "#fff",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },
};