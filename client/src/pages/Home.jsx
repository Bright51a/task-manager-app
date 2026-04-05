import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1>Stay Organized. Stay Focused.</h1>
        <p>
          FocusFlow helps you manage tasks, stay productive, and achieve your goals daily.
        </p>

        <div style={{ marginTop: "20px" }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
            Get Started
          </button>

          <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <div style={styles.card}>
          <h3>📋 Task Management</h3>
          <p>Create, edit, and organize your daily tasks easily.</p>
        </div>

        <div style={styles.card}>
          <h3>🔐 Secure Access</h3>
          <p>Your data is protected with authentication.</p>
        </div>

        <div style={styles.card}>
          <h3>⚡ Fast & Simple</h3>
          <p>Clean interface designed for focus and productivity.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: "center",
    marginTop: "100px",
    padding: "0 20px"
  },
  primaryBtn: {
    padding: "12px 20px",
    marginRight: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryBtn: {
    padding: "12px 20px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "60px",
    flexWrap: "wrap"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "250px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
  }
};

export default Home;