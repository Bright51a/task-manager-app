const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if(user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token });

    } catch (err) {
    console.error("FULL ERROR:", err);   // 👈 add this
    res.status(500).send("Server error");
}
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// GET USER PROFILE
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
});


module.exports = router;



