import Status from "../models/StatusModel.js";
import UploadOnCloudinary from "../config/Cloudinary.js";
import { io } from "../socket/Socket.js";

export const createStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { caption } = req.body;

    if (!caption && !req.file) {
      return res
        .status(400)
        .json({ message: "Please provide caption or image" });
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

    io.emit("newStatus", populatedStatus);

    return res.status(201).json(populatedStatus);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server error while creating status",
        error: error.message,
      });
  }
};

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
    return res
      .status(500)
      .json({
        message: "Server error while fetching statuses",
        error: error.message,
      });
  }
};

export const getAllStatuses = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const statuses = await Status.find({
      userId: { $ne: currentUserId },
      expiresAt: { $gt: new Date() },
    })
      .populate("userId", "name image")
      .populate("views", "name image")
      .populate("likes", "name image")
      .sort({ createdAt: -1 });

    const groupedStatuses = statuses.reduce((acc, status) => {
      const userId = status.userId._id.toString();
      if (!acc[userId]) {
        acc[userId] = { userId: status.userId, statuses: [] };
      }
      acc[userId].statuses.push(status);
      return acc;
    }, {});

    return res.status(200).json(Object.values(groupedStatuses));
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server error while fetching statuses",
        error: error.message,
      });
  }
};

export const getStatusById = async (req, res) => {
  try {
    const { statusId } = req.params;
    const status = await Status.findById(statusId)
      .populate("userId", "name image")
      .populate("views", "name image")
      .populate("likes", "name image");

    if (!status) return res.status(404).json({ message: "Status not found" });

    if (status.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(status);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const viewStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const viewerId = req.userId;

    const status = await Status.findById(statusId).populate(
      "userId",
      "_id name image",
    );

    if (!status) return res.status(404).json({ message: "Status not found" });

    if (status.userId._id.toString() === viewerId) {
      return res.status(200).json({ message: "Cannot view own status" });
    }

    if (!status.views.includes(viewerId)) {
      status.views.push(viewerId);
      await status.save();

      const { default: User } = await import("../models/UserModel.js");
      const viewerData = await User.findById(viewerId).select("name image");

      io.emit("statusViewUpdate", {
        statusId,
        statusOwnerId: status.userId._id.toString(),
        viewerData: {
          _id: viewerData._id,
          name: viewerData.name,
          image: viewerData.image,
        },
      });
    }

    return res.status(200).json({ message: "Status viewed" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const likeStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.userId;

    const status = await Status.findById(statusId).populate(
      "userId",
      "_id name image",
    );

    if (!status) return res.status(404).json({ message: "Status not found" });

    if (status.userId._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot like own status" });
    }

    const likeIndex = status.likes.indexOf(userId);
    const isLiked = likeIndex === -1;

    if (likeIndex > -1) {
      status.likes.splice(likeIndex, 1);
    } else {
      status.likes.push(userId);
    }

    await status.save();

    const { default: User } = await import("../models/UserModel.js");
    const likerData = await User.findById(userId).select("name image");

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

    return res.status(200).json({
      message: isLiked ? "Status liked" : "Status unliked",
      likes: status.likes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.userId;
    const status = await Status.findById(statusId);

    if (!status) return res.status(404).json({ message: "Status not found" });

    if (status.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Status.findByIdAndDelete(statusId);
    io.emit("statusRemoved", { statusId, userId });

    return res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
