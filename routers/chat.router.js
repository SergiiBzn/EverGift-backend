import express from "express";
import { chatController } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/chat", chatController);
export default chatRouter;
