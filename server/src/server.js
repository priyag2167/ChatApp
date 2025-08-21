const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Ensure env vars and DB connection are initialized
dotenv.config();
require("./app");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const conversationRoutes = require("./routes/conversations");
const { authMiddleware } = require("./utils/authMiddleware");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/conversations", authMiddleware, conversationRoutes);

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// userId -> Set<socketId>
const onlineUsers = new Map();

function addOnlineSocket(userId, socketId) {
  let set = onlineUsers.get(userId);
  if (!set) {
    set = new Set();
    onlineUsers.set(userId, set);
  }
  const wasEmpty = set.size === 0;
  set.add(socketId);
  return wasEmpty;
}

function removeOnlineSocket(userId, socketId) {
  const set = onlineUsers.get(userId);
  if (!set) return true;
  set.delete(socketId);
  const nowEmpty = set.size === 0;
  if (nowEmpty) onlineUsers.delete(userId);
  return nowEmpty;
}

function getAnySocketId(userId) {
  const set = onlineUsers.get(userId);
  if (!set || set.size === 0) return null;
  for (const id of set) return id;
  return null;
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next();
    const secret = process.env.JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token.replace("Bearer ", ""), secret);
    socket.user = { id: payload.id };
    return next();
  } catch (_e) {
    return next();
  }
});

// Export io for use in controllers
module.exports.io = io;

io.on("connection", (socket) => {
  const userId = socket.user?.id;
  if (userId) {
    const firstForUser = addOnlineSocket(userId, socket.id);
    if (firstForUser) {
      io.emit("presence:update", { userId, online: true });
      // Reflect presence in DB status field
      User.findByIdAndUpdate(userId, { status: "online" }).catch(() => {});
    }
  }

  socket.on("typing:start", ({ to }) => {
    const toSocketId = getAnySocketId(to);
    if (toSocketId) io.to(toSocketId).emit("typing:start", { from: userId });
  });

  socket.on("typing:stop", ({ to }) => {
    const toSocketId = getAnySocketId(to);
    if (toSocketId) io.to(toSocketId).emit("typing:stop", { from: userId });
  });

  socket.on("message:send", async ({ to, content }) => {
    try {
      if (!userId || !to || !content) return;

      // Find or create conversation for these two users
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, to], $size: 2 },
      });
      if (!conversation) {
        conversation = await Conversation.create({ participants: [userId, to] });
      }

      let message = await Message.create({
        conversation: conversation._id,
        sender: userId,
        receiver: to,
        content,
        status: "sent",
      });

      // Update conversation lastMessage/updatedAt
      conversation.lastMessage = message._id;
      await conversation.save();

      const payload = {
        _id: message._id,
        conversation: String(conversation._id),
        sender: userId,
        receiver: to,
        content,
        status: message.status,
        createdAt: message.createdAt,
      };

      // Emit to sender immediately
      socket.emit("message:new", payload);

      // Deliver to receiver if online
      const toSocketId = getAnySocketId(to);
      if (toSocketId) {
        io.to(toSocketId).emit("message:new", payload);
        // Mark delivered
        message.status = "delivered";
        await message.save();
        io.to(socket.id).emit("message:delivered", { messageId: String(message._id) });
        io.to(toSocketId).emit("message:delivered", { messageId: String(message._id) });
      }
    } catch (err) {
      // Optional: send error to client
    }
  });

  socket.on("message:read", async ({ conversationId, from }) => {
    try {
      if (!userId || !conversationId) return;
      const result = await Message.updateMany(
        { conversation: conversationId, receiver: userId, sender: from, status: { $in: ["sent", "delivered"] } },
        { $set: { status: "read" } }
      );
      io.to(socket.id).emit("message:read", { conversationId, count: result.modifiedCount || 0 });
      const otherSocketId = getAnySocketId(from);
      if (otherSocketId) io.to(otherSocketId).emit("message:read", { conversationId });
    } catch (_e) {}
  });

  socket.on("disconnect", () => {
    if (userId) {
      const isNowOffline = removeOnlineSocket(userId, socket.id);
      if (isNowOffline) {
        io.emit("presence:update", { userId, online: false });
        // Reflect presence in DB status field
        User.findByIdAndUpdate(userId, { status: "offline" }).catch(() => {});
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };


