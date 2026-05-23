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
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back
        </button>

        <h1 style={styles.title}>📞 Contact Us</h1>

        <p style={styles.subtitle}>
          Have issues or suggestions? Send us a message 👇
        </p>

        <div style={styles.card}>
          <input placeholder="Your Name" style={styles.input} />

          <input placeholder="Your Email" style={styles.input} />

          <textarea
            placeholder="Describe your issue..."
            style={styles.textarea}
          />

          <button style={styles.button} onClick={handleSubmit}>
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
    background: "linear-gradient(135deg, #0F172A, #1E3A8A)",
    color: "#fff",
    padding: "40px"
  },

  container: {
    maxWidth: "600px",
    margin: "auto"
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

  title: {
    fontSize: "32px",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#CBD5F5",
    marginBottom: "20px"
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none"
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "10px"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(to right, #6366F1, #8B5CF6)",
    color: "#fff",
    cursor: "pointer"
  },

  success: {
    color: "#22C55E",
    marginTop: "10px"
  }
};