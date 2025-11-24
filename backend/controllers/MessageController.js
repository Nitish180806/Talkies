// controllers/MessageController.js
import UploadOnCloudinary from "../config/Cloudinary.js";
import Conversation from "../models/ConverSationModel.js";
import Message from "../models/MessageModel.js";
import fs from "fs/promises";
import { io, getReceiverSocketId } from "../socket/Socket.js";

// -------------------- SEND MESSAGE --------------------
export const SendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({ message: "Cannot send empty message" });
    }

    let image = "";
    let audio = "";

    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary...");

        const isAudio =
          req.file.mimetype.startsWith("audio/") ||
          req.file.originalname.endsWith(".webm") ||
          req.file.originalname.endsWith(".mp3") ||
          req.file.originalname.endsWith(".wav") ||
          req.file.originalname.endsWith(".ogg");

        const uploadResult = await UploadOnCloudinary(req.file.path);

        if (isAudio) {
          audio = uploadResult;
          console.log("Uploaded audio URL:", audio);
        } else {
          image = uploadResult;
          console.log("Uploaded image URL:", image);
        }
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          message: "File upload failed",
          error: uploadError.message || uploadError,
        });
      } finally {
        if (req.file?.path) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.error("Failed to delete temp file:", err));
        }
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message || "",
      image: image || "",
      audio: audio || "",
      isRead: false, // ✅ NEW: Mark as unread initially
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
        lastMessage:
          message || (image ? "📷 Photo" : audio ? "🎤 Voice Message" : ""),
        lastMessageTime: new Date(),
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.lastMessage =
        message || (image ? "📷 Photo" : audio ? "🎤 Voice Message" : "");
      conversation.lastMessageTime = new Date();
      await conversation.save();
    }

    const conversationData = {
      _id: conversation._id,
      participants: conversation.participants,
      lastMessage: conversation.lastMessage,
      updatedAt: conversation.lastMessageTime || new Date(),
    };

    try {
      const receiverSocketId = getReceiverSocketId(receiver);
      const senderSocketId = getReceiverSocketId(sender);

      const payload = {
        messageData: {
          _id: newMessage._id,
          sender: newMessage.sender,
          receiver: newMessage.receiver,
          message: newMessage.message,
          image: newMessage.image,
          audio: newMessage.audio,
          isRead: newMessage.isRead, // ✅ NEW: Include read status
          createdAt: newMessage.createdAt || new Date(),
        },
        conversationData,
      };

      if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", payload);
      if (senderSocketId && senderSocketId !== receiverSocketId)
        io.to(senderSocketId).emit("newMessage", payload);
    } catch (emitErr) {
      console.error("Socket emit error:", emitErr);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("SendMessage error:", error);
    return res.status(500).json({
      message: "Server error while sending message",
      error: error.message || error,
    });
  }
};

// -------------------- GET MESSAGES --------------------
export const GetMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("GetMessages error:", error);
    return res.status(500).json({
      message: "Server error while fetching messages",
      error: error.message || error,
    });
  }
};

// ✅ NEW: Mark messages as read
export const MarkMessagesAsRead = async (req, res) => {
  try {
    const currentUser = req.userId;
    const { senderId } = req.params;

    // Mark all unread messages from sender to current user as read
    const result = await Message.updateMany(
      {
        sender: senderId,
        receiver: currentUser,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    // Emit socket event to notify sender
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", {
        readBy: currentUser,
        count: result.modifiedCount,
      });
    }

    return res.status(200).json({
      success: true,
      markedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("MarkMessagesAsRead error:", error);
    return res.status(500).json({
      message: "Server error while marking messages as read",
      error: error.message || error,
    });
  }
};
