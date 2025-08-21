const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Normalize URI: trim whitespace and strip surrounding quotes if present
const raw = process.env.MONGO_URI;
const uri = raw && typeof raw === "string"
  ? raw.trim().replace(/^['"]|['"]$/g, "")
  : "mongodb://127.0.0.1:27017/chatapp";

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));
