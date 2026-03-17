import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./config/Db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import AuthRouter from "./routes/AuthRoute.js";
import UserRouter from "./routes/UserRoute.js";
import MessageRouter from "./routes/MessageRoute.js";
import NewContactRouter from "./routes/NewContactRoute.js";
import ConverSationRoute from "./routes/ConverSationRoute.js";
import { app, server, io } from "./socket/Socket.js";
import StatusRouter from "./routes/StatusRoute.js";

dotenv.config();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/message", MessageRouter);
app.use("/api/newcontact", NewContactRouter);
app.use("/api/conversation", ConverSationRoute);
app.use("/api/status", StatusRouter)
const port = process.env.PORT || 8001;
server.listen(port, async () => {
  await connectMongoDB(); // Ensure DB connected before accepting requests
  console.log(`Server running on http://localhost:${port}`);
});
