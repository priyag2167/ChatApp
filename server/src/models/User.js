const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, default: "Hey there! I am using Chat." },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);


