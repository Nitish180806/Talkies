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
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("userOnline", userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("typing", ({ receiverId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId, isTyping });
    }
  });

  socket.on("voiceRecording", ({ receiverId, isRecording }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("voiceRecording", {
        senderId: userId,
        isRecording,
      });
    }
  });

  socket.on("statusViewed", ({ statusId, statusOwnerId, viewerData }) => {
    const ownerSocketId = getReceiverSocketId(statusOwnerId);
    if (ownerSocketId) {
      io.to(ownerSocketId).emit("statusViewUpdate", {
        statusId,
        statusOwnerId,
        viewerData,
      });
    }
  });

  socket.on(
    "statusLiked",
    ({ statusId, statusOwnerId, likerData, isLiked }) => {
      const ownerSocketId = getReceiverSocketId(statusOwnerId);
      if (ownerSocketId) {
        io.to(ownerSocketId).emit("statusLikeUpdate", {
          statusId,
          statusOwnerId,
          likerData,
          isLiked,
        });
      }
    },
  );

  socket.on("statusDeleted", ({ statusId, userId }) => {
    io.emit("statusRemoved", { statusId, userId });
  });

  socket.on("logout", (userId) => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("userOffline", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("userOffline", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
