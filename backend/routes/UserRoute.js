import express from "express";
import {
  editProfile,
  getCurrentUser,
  getOtherUser,
  getSingleUser,
} from "../controllers/UserController.js";
import IsAuth from "../middlewares/IsAuth.js";
import { Upload } from "../middlewares/Multer.js";

const UserRouter = express.Router();
UserRouter.get("/current", IsAuth, getCurrentUser);
UserRouter.put("/profile", IsAuth, Upload.single("image"), editProfile);
UserRouter.get("/others", IsAuth, getOtherUser);
UserRouter.get("/:id", IsAuth, getSingleUser);
export default UserRouter;
