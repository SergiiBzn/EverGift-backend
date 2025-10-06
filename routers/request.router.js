import express from "express";
import {
  sendContactRequest,
  responseContactRequest,
  getAllContactRequests,
} from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter.route("/").post(sendContactRequest).get(getAllContactRequests);
requestRouter.put("/:requestId", responseContactRequest);
export default requestRouter;
