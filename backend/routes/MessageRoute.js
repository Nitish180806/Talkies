import express from "express";
import IsAuth from "../middlewares/IsAuth.js";
import { Upload } from "../middlewares/Multer.js";
import {
  GetMessages,
  SendMessage,
  MarkMessagesAsRead,
} from "../controllers/MessageController.js";

const MessageRouter = express.Router();
MessageRouter.post(
  "/send/:receiver",
  IsAuth,
  Upload.single("file"),
  SendMessage,
);
MessageRouter.get("/get/:receiver", IsAuth, GetMessages);
MessageRouter.put("/read/:senderId", IsAuth, MarkMessagesAsRead);
export default MessageRouter;
