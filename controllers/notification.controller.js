import { Notification, ContactRequest, User } from "../models/index.js";
import { responseContactRequest } from "./request.controller.js";

export const getNotifications = async (req, res) => {
  const userId = req.userId;
  const notifications = await Notification.find({ userId })
    .populate([
      {
        path: "fromUserId",
        select: "profile.name profile.avatar slug",
      },
      {
        path: "requestId",
        select: "fromUserId toUserId status",
      },
    ])
    .sort({ createdAt: -1 });

  await User.findByIdAndUpdate(userId, { $set: { hasNotification: false } });

  const newNotifications = notifications.filter((n) => !n.handled);
  const historyNotifications = notifications.filter((n) => n.handled);

  res.json({ new: newNotifications, history: historyNotifications });
};

// ==============================================================
export const updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { action } = req.body;
  const userId = req.userId;

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new Error("Notification not found", { cause: 404 });
  if (notification.userId.toString() !== userId)
    throw new Error("Not authorized to respond", { cause: 403 });

  switch (action) {
    case "read": {
      notification.isRead = true;
      notification.handled = true;
      await notification.save();
      break;
    }

    case "delete": {
      await notification.deleteOne();

      break;
    }
    case "accept":
    case "reject": {
      if (!notification.requestId)
        throw new Error("Related request not found", { cause: 404 });
      const request = await ContactRequest.findById(notification.requestId);
      if (!request)
        throw new Error("Related request not found", { cause: 404 });

      notification.handled = true;
      notification.isRead = true;
      await notification.save();

      req.params.requestId = request._id;
      req.body.action = action;
      return responseContactRequest(req, res);
    }
    default:
      throw new Error("Invalid action", { cause: 400 });
  }

  const hasUnread = await Notification.exists({ userId, isRead: false });
  await User.findByIdAndUpdate(userId, { hasNotifications: !!hasUnread });

  res.json({ message: `Notification ${action} successfully` }, notification);
};
