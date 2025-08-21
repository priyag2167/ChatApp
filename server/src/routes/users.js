const express = require("express");
const User = require("../models/User");

const router = express.Router();

// GET /users - list all users (without passwords)
router.get("/", async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


