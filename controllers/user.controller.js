/** @format */

import { User } from "../models/index.js";

//********** GET /users/all **********

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("email");
  res.json(users);
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
