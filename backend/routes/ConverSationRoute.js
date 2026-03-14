import express from "express";
import IsAuth from "../middlewares/IsAuth.js";
import { GetConversations } from "../controllers/ConversationController.js";

const router = express.Router();
router.get("/", IsAuth, GetConversations);
export default router;