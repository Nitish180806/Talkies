// controllers/StatusController.js
import Status from "../models/StatusModel.js";
import UploadOnCloudinary from "../config/Cloudinary.js";
import { io } from "../socket/Socket.js";

// ✅ Create new status
export const createStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { caption } = req.body;

    if (!caption && !req.file) {
      return res.status(400).json({
        message: "Please provide caption or image",
      });
    }

    let image = "";
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }

    const status = await Status.create({
      userId,
      caption: caption || "",
      image,
    });

    const populatedStatus = await Status.findById(status._id)
      .populate("userId", "name image")
      .populate("views", "name image")
      .populate("likes", "name image");

    // ✅ Emit to all connected users via Socket.IO
    io.emit("newStatus", populatedStatus);

    console.log("✅ Status created and broadcasted:", status._id);

    return res.status(201).json(populatedStatus);
  } catch (error) {
    console.error("❌ createStatus error:", error);
    return res.status(500).json({
      message: "Server error while creating status",
      error: error.message,
    });
  }
};

// ✅ Get my statuses
export const getMyStatuses = async (req, res) => {
  try {
    const userId = req.userId;
    const statuses = await Status.find({
      userId,
      expiresAt: { $gt: new Date() },
    })
      .populate("views", "name image")
      .populate("likes", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json(statuses);
  } catch (error) {
    console.error("❌ getMyStatuses error:", error);
    return res.status(500).json({
      message: "Server error while fetching statuses",
      error: error.message,
    });
  }
};

// ✅ Get all other users' statuses (grouped by user)
export const getAllStatuses = async (req, res) => {
  try {
    const currentUserId = req.userId;
    // Get all active statuses except current user's
    const statuses = await Status.find({
      userId: { $ne: currentUserId },
      expiresAt: { $gt: new Date() },
    })
      .populate("userId", "name image")
      .populate("views", "name image")
      .populate("likes", "name image")
      .sort({ createdAt: -1 });

    // Group by user
    const groupedStatuses = statuses.reduce((acc, status) => {
      const userId = status.userId._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          userId: status.userId,
          statuses: [],
        };
      }
      acc[userId].statuses.push(status);
      return acc;
    }, {});

    const result = Object.values(groupedStatuses);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ getAllStatuses error:", error);
    return res.status(500).json({
      message: "Server error while fetching statuses",
      error: error.message,
    });
  }
};

// ✅ Get single status details
export const getStatusById = async (req, res) => {
  try {
    const { statusId } = req.params;
    const status = await Status.findById(statusId)
      .populate("userId", "name image")
      .populate("views", "name image")
      .populate("likes", "name image");

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    // Check if current user is the owner
    if (status.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(status);
  } catch (error) {
    console.error("❌ getStatusById error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Mark status as viewed
export const viewStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const viewerId = req.userId;

    const status = await Status.findById(statusId).populate(
      "userId",
      "_id name image",
    );

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    // Don't add view if user is the owner
    if (status.userId._id.toString() === viewerId) {
      return res.status(200).json({ message: "Cannot view own status" });
    }

    // Add viewer if not already viewed
    if (!status.views.includes(viewerId)) {
      status.views.push(viewerId);
      await status.save();

      // Get viewer data to send with socket event
      const { default: User } = await import("../models/UserModel.js");
      const viewerData = await User.findById(viewerId).select("name image");

      // ✅ Broadcast to owner's socket
      io.emit("statusViewUpdate", {
        statusId,
        statusOwnerId: status.userId._id.toString(),
        viewerData: {
          _id: viewerData._id,
          name: viewerData.name,
          image: viewerData.image,
        },
      });

      console.log(`✅ Status ${statusId} viewed by ${viewerId} - broadcasted`);
    }

    return res.status(200).json({ message: "Status viewed" });
  } catch (error) {
    console.error("❌ viewStatus error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Like/Unlike status
export const likeStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.userId;

    const status = await Status.findById(statusId).populate(
      "userId",
      "_id name image",
    );

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    // Don't allow liking own status
    if (status.userId._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot like own status" });
    }

    const likeIndex = status.likes.indexOf(userId);
    const isLiked = likeIndex === -1;

    if (likeIndex > -1) {
      // Unlike
      status.likes.splice(likeIndex, 1);
    } else {
      // Like
      status.likes.push(userId);
    }

    await status.save();

    // Get liker data to send with socket event
    const { default: User } = await import("../models/UserModel.js");
    const likerData = await User.findById(userId).select("name image");

    // ✅ Broadcast to all connected clients
    io.emit("statusLikeUpdate", {
      statusId,
      statusOwnerId: status.userId._id.toString(),
      likerData: {
        _id: likerData._id,
        name: likerData.name,
        image: likerData.image,
      },
      isLiked,
    });

    console.log(
      `✅ Status ${statusId} ${isLiked ? "liked" : "unliked"} by ${userId} - broadcasted`,
    );

    return res.status(200).json({
      message: isLiked ? "Status liked" : "Status unliked",
      likes: status.likes,
    });
  } catch (error) {
    console.error("❌ likeStatus error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Delete status
export const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.userId;
    const status = await Status.findById(statusId);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    // Check ownership
    if (status.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Status.findByIdAndDelete(statusId);

    // ✅ Notify all users via Socket.IO
    io.emit("statusRemoved", { statusId, userId });

    console.log("✅ Status deleted:", statusId);

    return res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    console.error("❌ deleteStatus error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
