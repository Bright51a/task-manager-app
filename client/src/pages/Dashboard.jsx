import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
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

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h2>Task Manager</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
       </button>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* INPUT */}
      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />

        <button className="add-btn" onClick={addTask}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 && (
        <p style={{ marginTop: "20px", color: "gray" }}>
          No tasks yet. Start by adding one 🚀
        </p>
      )}

      {/* TASK LIST */}
      <ul>
      {tasks.map(task => (
        <li key={task._id}>

          {editingId === task._id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => updateTask(task._id)}>💾</button>
            </>
          ) : (
            <>
              
              <span
                onClick={() => toggleStatus(task._id, task.completed)}
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                  opacity: task.completed ? 0.6 : 1
                }}
              >
                {task.title}
              </span>

              <button onClick={() => {
                setEditingId(task._id);
                setEditText(task.title);
              }}>
                ✏️
              </button>
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </>
          )}
    </li>
  ))}
</ul>

    </div>
  );
}

export default Dashboard;