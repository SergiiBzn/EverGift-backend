/** @format */

import { User, Contact } from "../models/index.js";

//********** GET /users/search **********

export const searchUsers = async (req, res) => {
  const email = req.query.q.trim();
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({
    _id: { $ne: req.userId },
    email: { $regex: email, $options: "i" },
  }).select("email profile.name profile.avatar");

  // check if user exists in contacts
  if (user) {
    const existContact = await Contact.findOne({
      ownerId: req.userId,
      contactType: "user",
      linkedUserId: user._id,
    });
    if (existContact) {
      throw new Error("User is already in your contacts", { cause: 400 });
    }
  }
  res.json(user);
};

// profile update and wishList update
//********** PUT /users/profile **********
export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  console.log(req.body);
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const updateData = { ...req.body };
  if (req.file) {
    updateData.avatar = req.file.secure_url || req.file.url;
  }
  if (updateData.tags && typeof updateData.tags == "string") {
    try {
      updateData.tags = JSON.parse(updateData.tags);
    } catch (error) {
      console.error("Error parsing tags:", error);
    }
  }
  user.profile = { ...user.profile, ...updateData };
  await user.save();
  res.json(user.profile);
};

//********** PUT /users/wishList **********
export const updateUserWishList = async (req, res) => {
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { wishList: req.body } },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  res.json(user);
};

// get users/hasNotification
export const getHasNotification = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  res.json(user.hasNotification);
};
