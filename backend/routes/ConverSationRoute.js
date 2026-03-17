import express from "express";
import IsAuth from "../middlewares/IsAuth.js";
import { GetConversations } from "../controllers/ConverSationController.js";

const router = express.Router();

router.get("/", IsAuth,GetConversations );

export default router;
