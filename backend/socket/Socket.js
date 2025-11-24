import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 User connected: ${userId}`);

  
    io.emit("userOnline", userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

    // ----------------- TYPING EVENT -----------------
  socket.on("typing", ({ receiverId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId, isTyping });
    }
  });

  // ----------------- VOICE RECORDING EVENT -----------------
  socket.on("voiceRecording", ({ receiverId, isRecording }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("voiceRecording", {
        senderId: userId,
        isRecording,
      });
    }
  });
  
  // Handle logout
  socket.on("logout", (userId) => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("userOffline", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`🔴 User logged out: ${userId}`);
    }
  });



  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("userOffline", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`🔴 User disconnected: ${userId}`);
    }
  });
});

export { app, server, io };
