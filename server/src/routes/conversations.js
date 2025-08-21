const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { Types } = require("mongoose");

const router = express.Router();

// GET /conversations - list conversations for current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate({ path: "lastMessage" })
      .populate({ path: "participants", select: "name email status" });

    // Compute unread counts per conversation for current user in one aggregation
    const unread = await Message.aggregate([
      { $match: { receiver: new Types.ObjectId(userId), status: { $in: ["sent", "delivered"] } } },
      { $group: { _id: "$conversation", count: { $sum: 1 } } }
    ]);
    const unreadMap = new Map(unread.map((u) => [String(u._id), u.count]));

    // Last unread message per conversation for current user
    const lastUnread = await Message.aggregate([
      { $match: { receiver: new Types.ObjectId(userId), status: { $in: ["sent", "delivered"] } } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$conversation",
          _msgId: { $first: "$_id" },
          content: { $first: "$content" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" }
      } }
    ]);
    const lastUnreadMap = new Map(lastUnread.map((m) => [String(m._id), m]));

    res.json(
      conversations.map((c) => ({
        _id: String(c._id),
        participants: c.participants?.map((p) => ({
          _id: String(p._id),
          name: p.name,
          email: p.email,
          status: p.status,
        })) || [],
        lastMessage: c.lastMessage
          ? {
              _id: String(c.lastMessage._id),
              content: c.lastMessage.content,
              sender: String(c.lastMessage.sender),
              receiver: String(c.lastMessage.receiver),
              status: c.lastMessage.status,
              createdAt: c.lastMessage.createdAt,
            }
          : null,
        updatedAt: c.updatedAt,
        unreadCount: unreadMap.get(String(c._id)) || 0,
        lastUnreadMessage: (() => {
          const lu = lastUnreadMap.get(String(c._id));
          return lu ? {
            _id: String(lu._msgId),
            content: lu.content,
            sender: String(lu.sender),
            receiver: String(lu.receiver),
            status: lu.status,
            createdAt: lu.createdAt,
          } : null;
        })(),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /conversations/with/:userId - find or create a 1:1 conversation with another user
router.get("/with/:userId", async (req, res) => {
  try {
    const userId = req.user?.id;
    const otherId = req.params.userId;
    if (!userId || !otherId) return res.status(400).json({ message: "Missing user ids" });

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [userId, otherId] });
    }

    res.json({ _id: String(conversation._id) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /conversations/:id/messages - list messages in conversation
router.get("/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversation: id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;