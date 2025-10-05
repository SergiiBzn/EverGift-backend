import express from "express";
import {
  sendContactRequest,
  responseContactRequest,
} from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter.post("/", sendContactRequest);
requestRouter.put("/:requestId", responseContactRequest);
export default requestRouter;
