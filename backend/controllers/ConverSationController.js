import Conversation from "../models/ConverSationModel.js";

export const GetConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "name email image")
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("GetConversations error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
