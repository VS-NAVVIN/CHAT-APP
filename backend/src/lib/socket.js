import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // userId -> socket.id

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.join(userId); // Join room with userId
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("setup", (userId) => {
    userSocketMap[userId] = socket.id;
    socket.join(userId);
    console.log("🧠 Setup received, joined room:", userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("send message", (data) => {
    const { receiverId, senderId, text, image } = data;

    const messageData = {
      senderId,
      receiverId,
      text,
      image,
      createdAt: new Date().toISOString(),
    };

    console.log("📤 Message from", senderId, "to", receiverId);

    io.to(receiverId).emit("message received", messageData);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
