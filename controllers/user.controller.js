/** @format */

import { User } from "../models/index.js";

// profile update and wishList update
//********** PUT /users/profile **********
export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { profile: req.body } },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
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
