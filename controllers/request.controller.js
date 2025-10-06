import {
  ContactRequest,
  Notification,
  Contact,
  User,
} from "../models/index.js";
// Send contact request (fromUser->toUser)
export const sendContactRequest = async (req, res) => {
  const fromUserId = req.userId;
  const { email } = req.body;

  const toUser = await User.findOne({ email });
  if (!toUser) {
    throw new Error("User not found", { cause: 404 });
  }
  if (toUser._id.equals(fromUserId)) {
    throw new Error("You can't send a request to yourself", { cause: 400 });
  }
  const existContact = await Contact.findOne({
    ownerId: req.userId,
    contactType: "user",
    linkedUserId: toUser._id,
  });
  if (existContact) {
    throw new Error("Contact already exists", { cause: 400 });
  }
  const existRequest = await ContactRequest.findOne({
    fromUserId,
    toUserId: toUser._id,
    status: { $in: ["pending", "accepted"] },
  });
  if (existRequest) {
    throw new Error("You have already sent a request to this user", {
      cause: 400,
    });
  }
  const request = await ContactRequest.create({
    fromUserId,
    toUserId: toUser._id,
  });
  // Create notification for the user being requested
  await Notification.create({
    userId: toUser._id,
    requestType: "contact_request",
    fromUserId,
    requestId: request._id,
    message: `You have received a contact request`,
  });
  await User.findByIdAndUpdate(toUser._id, {
    $set: { hasNotification: true },
  });

  res.status(201).json({ message: "Contact request sent", request });
};

// Response contact request (toUser (accept/reject))
export const responseContactRequest = async (req, res) => {
  const { requestId } = req.params; // Contact request ID
  const { action } = req.body;
  const userId = req.userId; // Logged-in user ID  and response user ID

  const request = await ContactRequest.findById(requestId);

  if (!request) {
    throw new Error("Request not found", { cause: 404 });
  }
  if (!request.toUserId.equals(userId)) {
    throw new Error("Not authorized to respond", { cause: 403 });
  }
  if (request.status !== "pending") {
    throw new Error("Request already processed", { cause: 400 });
  }

  if (action === "accept") {
    request.status = "accepted";
    await request.save();
    // create contact for both users
    const [fromUser, toUser] = await Promise.all([
      User.findById(request.fromUserId),
      User.findById(request.toUserId),
    ]);
    if (!fromUser || !toUser) {
      throw new Error("User not found", { cause: 404 });
    }
    //
    const contactA = await Contact.create({
      ownerId: request.fromUserId,
      contactType: "user",
      linkedUserId: request.toUserId,
    });
    // add contact to user.contacts array
    await User.findByIdAndUpdate(request.fromUserId, {
      $push: { contacts: contactA._id },
    });
    // create Contact for toUser
    const contactB = await Contact.create({
      ownerId: request.toUserId,
      contactType: "user",
      linkedUserId: request.fromUserId,
    });
    // add contact to user.contacts array
    await User.findByIdAndUpdate(request.toUserId, {
      $push: { contacts: contactB._id },
    });

    // Create notification for the user who accepted the request
    await Notification.create({
      userId: request.fromUserId,
      requestType: "request_accept",
      fromUserId: request.toUserId,
      requestId: request._id,
      message: `You have accepted contact request`,
    });

    // set hasNotification to true for fromUser
    await User.findByIdAndUpdate(request.fromUserId, {
      $set: { hasNotification: true },
    });
    res.json({
      message: "Contact request accepted",
      request,
      contactA,
      contactB,
    });
  } else if (action === "reject") {
    request.status = "rejected";
    await request.save();
    // Create notification for the user who rejected the request
    await Notification.create({
      userId: request.fromUserId,
      requestType: "request_reject",
      fromUserId: request.toUserId,
      requestId: request._id,
      message: `You have rejected contact request`,
    });
    // set hasNotification to true for fromUser
    await User.findByIdAndUpdate(request.fromUserId, {
      $set: { hasNotification: true },
    });
    res.json({ message: "Contact request rejected", request });
  } else {
    throw new Error("Invalid action", { cause: 400 });
  }
  await request.save();
  res.json(request);
};
