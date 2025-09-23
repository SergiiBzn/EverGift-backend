/** @format */

import { User } from "../models/index.js";

// profile update and wishList update
//********** PUT /users/profile **********
export const updateUserProfile = async (req, res) => {
  const { name, avatar, birthday, tags } = req.body;
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    { name, avatar, birthday, tags },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  res.json(user);
};

//********** PUT /users/wishList **********
export const updateUserWishList = async (req, res) => {
  const { wishItem } = req.body;
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { wishList: wishItem } },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  res.json(user);
};
