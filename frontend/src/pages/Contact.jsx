import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={styles.backBtn}
          onMouseOver={(e) =>
            (e.target.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            (e.target.style.transform = "scale(1)")
          }
        >
          ← Back
        </button>

        <h1 style={styles.title}>📞 Contact Us</h1>

        <p style={styles.subtitle}>
          Have issues or suggestions? Send us a message 👇
        </p>

        <div style={styles.card}>

          <input
            placeholder="Your Name"
            style={styles.input}
          />

          <input
            placeholder="Your Email"
            style={styles.input}
          />

          <textarea
            placeholder="Describe your issue..."
            style={styles.textarea}
          />

          <button
            style={styles.button}
            onClick={handleSubmit}
            onMouseOver={(e) =>
              (e.target.style.transform = "scale(1.03)")
            }
            onMouseOut={(e) =>
              (e.target.style.transform = "scale(1)")
            }
          >
            🚀 Submit
          </button>

          {submitted && (
            <p style={styles.success}>
              ✅ Response submitted successfully!
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "650px",
    margin: "auto",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
    color: "#111827",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#6B7280",
    marginBottom: "25px",
    fontSize: "16px",
  },

  card: {
    background: "#FFFFFF",
    padding: "25px",
    borderRadius: "18px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #D1D5DB",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    height: "140px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #D1D5DB",
    marginBottom: "15px",
    fontSize: "15px",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #DC2626, #EF4444)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "0.3s",
  },

  success: {
    color: "#16A34A",
    marginTop: "15px",
    fontWeight: "bold",
    textAlign: "center",
  },
};