import UploadOnCloudinary from "../config/Cloudinary.js";
import User from "../models/UserModel.js";
import { io } from "../socket/Socket.js"; // Socket import

// ✅ Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Current user error: ${error.message}` });
  }
};

// ✅ Edit profile (name, about, image)
export const editProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    let updateData = { name, about };

    if (req.file) {
      const image = await UploadOnCloudinary(req.file.path);
      updateData.image = image; // Only update if new image uploaded
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) return res.status(400).json({ message: "User not found" });

    // 🔴 Emit live update for profile changes
    io.emit("profileUpdated", user);

    return res.status(200).json(user);
  } catch (error) {
    console.log("req.userId:", req.userId);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    return res
      .status(400)
      .json({ message: `editProfile error: ${error.message}` });
  }
};

// ✅ Get all other users (excluding current user)
export const getOtherUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getOtherUser error: ${error.message}` });
  }
};

// ✅ Get single user by ID
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password"); // hide password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getSingleUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
