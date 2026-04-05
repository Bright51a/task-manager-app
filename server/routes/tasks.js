const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const newTask = new Task({
      user: req.user,
      title: req.body.title
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// GET TASKS
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});


// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log("PUT route hit"); // 👈 ADD THIS

   const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.completed !== undefined && { completed: req.body.completed })
    },
    { new: true }
  );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.put("/:id/status", auth, async (req, res) => {
  try {
    console.log("TOGGLE HIT");

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;