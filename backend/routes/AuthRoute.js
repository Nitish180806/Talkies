import express from "express";
import { Login, Logout, SignUp } from "../controllers/AuthController.js";

const AuthRouter = express.Router();
AuthRouter.post("/signup", SignUp);
AuthRouter.post("/login", Login);
AuthRouter.get("/logout", Logout);
export default AuthRouter;
