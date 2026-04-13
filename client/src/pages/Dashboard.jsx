import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Dashboard.css";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Dashboard() {
  const [activePage, setActivePage] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )


  useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [darkMode]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // 📥 Fetch tasks
  useEffect(() => {
    if (!token) return;

    fetch("https://task-manager-app-e8t7.onrender.com/api/tasks", {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, [token]);


  useEffect(() => {
  if (!token) return;

  fetch("https://task-manager-app-e8t7.onrender.com/api/auth/me", {
    headers: {
      Authorization: token
    }
  })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error(err));
}, [token]);

  // ➕ Add task
  const addTask = async () => {
    if (!title) return;

    setLoading(true);

    try {
  const res = await fetch("https://task-manager-app-e8t7.onrender.com/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ title })
  });

  const newTask = await res.json();

  if (res.ok) {
    setTasks([...tasks, newTask]);
    setTitle("");
    toast.success("Task added!");
  } else {
    toast.error("Failed to add task");
  }

} catch (err) {
  toast.error("Something went wrong");
}

setLoading(false);
  };

  // ❌ Delete task
  const deleteTask = async (id) => {
  try {
    const res = await fetch(`https://task-manager-app-e8t7.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    });

    if (res.ok) {
      setTasks(tasks.filter(task => task._id !== id));
      toast.success("Task deleted!");
    } else {
      toast.error("Failed to delete task");
    }
  } catch (err) {
    toast.error("Something went wrong");
  }
};

// ✏️ Update task
  const updateTask = async (id) => {
  try {
    const res = await fetch(`https://task-manager-app-e8t7.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title: editText })
    });

    const updated = await res.json();

    if (res.ok) {
      setTasks(tasks.map(task =>
        task._id === id ? updated : task
      ));
      toast.success("Task updated!");
    } else {
      toast.error("Update failed");
    }
  } catch {
    toast.error("Something went wrong");
  }

  setEditingId(null);
  setEditText("");
};

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Toggle task status
  const toggleStatus = async (id, currentStatus) => {
  try {
    const res = await fetch(`https://task-manager-app-e8t7.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ completed: !currentStatus })
    });

    const updated = await res.json();

    if (res.ok) {
      setTasks(prev =>
        prev.map(task =>
          task._id === id ? updated : task
        )
      );
      toast.success("Task updated!");
    } else {
      toast.error("Failed to update");
    }
  } catch {
    toast.error("Something went wrong");
  }
};

const completedCount = tasks.filter(t => t.completed).length;
const pendingCount = tasks.length - completedCount;

const pieData = [
  { name: "Completed", value: completedCount },
  { name: "Pending", value: pendingCount }
];

const barData = [
  { name: "Total", value: tasks.length },
  { name: "Completed", value: completedCount },
  { name: "Pending", value: pendingCount }
];

  return (
  <div className={`app-layout ${darkMode ? "dark" : ""}`}>

    {/* SIDEBAR */}
    <aside className="sidebar">
      <h2 className="logo">🗂 TaskFlow</h2>

      <nav>
  <button
    className={activePage === "tasks" ? "nav-item active" : "nav-item"}
    onClick={() => setActivePage("tasks")}
  >
    📋 Tasks
  </button>

  <button
    className={activePage === "analytics" ? "nav-item active" : "nav-item"}
    onClick={() => setActivePage("analytics")}
  >
    📊 Analytics
  </button>

  <button className="nav-item">
    ⚙️ Settings
  </button>
</nav>
    </aside>

    {/* MAIN CONTENT */}
    <main className="main-content">

      {/* HEADER */}
      <header className="header">
        <h2>Dashboard</h2>

        <div className="header-actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>

            <button className="logout-btn" onClick={logout}>
            <FiLogOut />
          </button>
        </div>
      </header>

      
      {activePage === "tasks" && (
  <>
    {/* USER CARD */}
    <div className="user-card">
    <div className="avatar">
      {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
    </div>

    <div>
      <h4>{user?.name || "Loading..."}</h4>
      <p>{user?.email || "Fetching user..."}</p>
    </div>
  </div>

    {/* STATS */}
    <div className="stats">
      <div className="card">
        <h3>Total</h3>
        <p>{tasks.length}</p>
      </div>

      <div className="card">
        <h3>Completed</h3>
        <p>{completedCount}</p>
      </div>

      <div className="card">
        <h3>Pending</h3>
        <p>{pendingCount}</p>
      </div>
    </div>

    {/* INPUT */}
    <div className="input-group">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={addTask}>
        {loading ? "Adding..." : "Add"}
      </button>
    </div>

    {/* TASKS */}
    <div className="task-grid">
      {tasks.map(task => (
        <div key={task._id} className="task-card">
          <h4
            onClick={() => toggleStatus(task._id, task.completed)}
            className={task.completed ? "completed" : ""}
          >
            {task.title}
          </h4>

          <div className="task-actions">
            <button onClick={() => {
              setEditingId(task._id);
              setEditText(task.title);
            }}>✏️</button>

            <button onClick={() => deleteTask(task._id)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  </>
)}

{activePage === "analytics" && (
  <div className="analytics-page">

    <h2>📊 Analytics Dashboard</h2>

    <div className="charts">

      {/* PIE CHART */}
      <div className="chart-box">
        <h4>Task Status</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="chart-box">
        <h4>Task Overview</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  </div>
)}

    </main>
  </div>
);
}

export default Dashboard;