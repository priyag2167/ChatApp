const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) => {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.sign({ id: String(user._id) }, secret, { expiresIn: "7d" });
};

exports.registerController = async (req, res) => {
  try {
    const { name, email, number, password, status } = req.body;
    if (!name || !email || !number || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, number, password: hash, status: status || "Hey there! I am using Chat." });
    const token = signToken(user);
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json({ user: safe, token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    const safe = user.toObject();
    delete safe.password;
    return res.json({ user: safe, token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


