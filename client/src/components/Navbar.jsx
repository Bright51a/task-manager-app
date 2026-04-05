import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  return (
    <div style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        FocusFlow
      </h2>

      <div style={{ position: "relative" }}>
        <button style={styles.accountBtn} onClick={() => setOpen(!open)}>
          Account ⬇
        </button>

        {open && (
          <div style={styles.dropdown}>
            <p onClick={() => navigate("/login")}>Login</p>
            <p onClick={() => navigate("/register")}>Register</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  accountBtn: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    marginTop: "10px",
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    cursor: "pointer"
  }
};

export default Navbar;