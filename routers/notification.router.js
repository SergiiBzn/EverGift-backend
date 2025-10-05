import express from "express";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";
import { validate } from "../middlewares/index.js";
import { updateNotificationSchema } from "../schemas/notifiction.schema.js";
const notificationRouter = express.Router();

notificationRouter.get("/", getNotifications);
notificationRouter.put(
  "/:notificationId",
  validate(updateNotificationSchema),
  updateNotification
);

export default notificationRouter;
