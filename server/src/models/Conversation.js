const { Schema, model, Types } = require("mongoose");

const conversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: "User" }],
    lastMessage: { type: Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = model("Conversation", conversationSchema);


