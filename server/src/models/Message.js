const { Schema, model, Types } = require("mongoose");

const messageSchema = new Schema(
  {
    conversation: { type: Types.ObjectId, ref: "Conversation", required: true, index: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    receiver: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent", index: true },
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);


