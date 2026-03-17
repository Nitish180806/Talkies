import express from "express";
import IsAuth from "../middlewares/IsAuth.js"
import { createNewContact, deleteContact } from "../controllers/NewContactController.js";

const NewContactRouter = express.Router();

// Only authenticated users can create contacts
NewContactRouter.post("/create", IsAuth, createNewContact);
NewContactRouter.delete("/:id",IsAuth,deleteContact)

export default NewContactRouter;
