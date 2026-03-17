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

  // ✅ FIX: statusViewed - statusOwnerId bhi forward karo
  socket.on("statusViewed", ({ statusId, statusOwnerId, viewerData }) => {
    console.log(`👁️ Status ${statusId} viewed by ${viewerData._id}`);
    const ownerSocketId = getReceiverSocketId(statusOwnerId);
    if (ownerSocketId) {
      io.to(ownerSocketId).emit("statusViewUpdate", {
        statusId,
        statusOwnerId, // ✅ FIX: ye field add ki
        viewerData,
      });
    }
  });

  // ✅ FIX: statusLiked - statusOwnerId forward karo
  socket.on(
    "statusLiked",
    ({ statusId, statusOwnerId, likerData, isLiked }) => {
      console.log(
        `❤️ Status ${statusId} ${isLiked ? "liked" : "unliked"} by ${likerData._id}`,
      );
      const ownerSocketId = getReceiverSocketId(statusOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit("statusLikeUpdate", {
          statusId,
          statusOwnerId, // ✅ FIX: ye field add ki
          likerData,
          isLiked,
        });
      }
    },
  );

  // When someone deletes a status
  socket.on("statusDeleted", ({ statusId, userId }) => {
    console.log("🗑️ Status deleted:", statusId);
    io.emit("statusRemoved", { statusId, userId });
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
