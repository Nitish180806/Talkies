import express from "express";
import IsAuth from "../middlewares/IsAuth.js";
import { Upload } from "../middlewares/Multer.js";
import {
  createStatus,
  getMyStatuses,
  getAllStatuses,
  getStatusById,
  viewStatus,
  likeStatus,
  deleteStatus,
} from "../controllers/StatusController.js";

const StatusRouter = express.Router();
StatusRouter.post("/create", IsAuth, Upload.single("image"), createStatus);
StatusRouter.get("/my", IsAuth, getMyStatuses);
StatusRouter.get("/all", IsAuth, getAllStatuses);
StatusRouter.get("/:statusId", IsAuth, getStatusById);
StatusRouter.post("/:statusId/view", IsAuth, viewStatus);
StatusRouter.post("/:statusId/like", IsAuth, likeStatus);
StatusRouter.delete("/:statusId", IsAuth, deleteStatus);
export default StatusRouter;
