import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Downloads() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("downloads")) || [];
    setData(history);
  }, []);

  // DELETE SINGLE ITEM
  const deleteItem = (index) => {
    const updated = [...data];
    updated.splice(index, 1);

    setData(updated);
    localStorage.setItem("downloads", JSON.stringify(updated));
  };

  // CLEAR ALL
  const clearAll = () => {
    localStorage.removeItem("downloads");
    setData([]);
  };

  return (
    <div style={styles.page}>
      
      {/* BACK */}
      <button onClick={() => navigate("/")} style={styles.backBtn}>
        ← Back
      </button>

      <h1 style={styles.title}>⬇ Downloads</h1>

      {/* CLEAR BUTTON */}
      {data.length > 0 && (
        <button style={styles.clearBtn} onClick={clearAll}>
          🗑 Clear All
        </button>
      )}

      {data.length === 0 ? (
        <p style={styles.empty}>No downloads yet</p>
      ) : (
        data.map((item, index) => (
          <div key={index} style={styles.card}>
            
            <div style={styles.row}>
              <h3 style={styles.name}>{item.name}</h3>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteItem(index)}
              >
                ❌
              </button>
            </div>

            <p style={styles.desc}>{item.description}</p>
            <small style={styles.date}>{item.date}</small>

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
    color: "#fff",
    background: "linear-gradient(135deg, #0F172A, #1E3A8A)"
  },

  title: {
    marginBottom: "20px"
  },

  empty: {
    color: "#CBD5F5"
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    backdropFilter: "blur(10px)"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    color: "#60A5FA"
  },

  desc: {
    color: "#CBD5F5"
  },

  date: {
    color: "#94A3B8"
  },

  backBtn: {
    marginBottom: "20px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#6366F1",
    color: "#fff",
    cursor: "pointer"
  },

  clearBtn: {
    marginBottom: "20px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#EF4444",
    color: "#fff",
    cursor: "pointer"
  },

  deleteBtn: {
    border: "none",
    background: "#EF4444",
    color: "#fff",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer"
  }
};