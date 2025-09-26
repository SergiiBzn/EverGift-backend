/** @format */

import { Router } from "express";
import {
  createReceivedGift,
  deleteReceivedGift,
  getAllReceivedGifts,
  getReceivedGift,
  updateReceivedGift,
} from "../controllers/receivedGift.controller.js";
import {
  updateUserProfile,
  updateUserWishList,
  getAllUsers,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/index.js";
import { updateUserSchema } from "../schemas/user.schema.js";
import {
  createReceivedGiftSchema,
  updateReceivedGiftSchema,
} from "../schemas/receivedGift.schema.js";
import { deleteUser } from "../controllers/auth.controller.js";
import { me, updateUser, logout } from "../controllers/auth.controller.js";
import { updateWishListSchema } from "../schemas/contact.schema.js";

const userRouter = Router();

userRouter.route("/logout").delete(logout);

userRouter.route("/allUsers").get(getAllUsers);
userRouter
  .route("/me")
  .get(me)
  .put(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

//********** profile **********
userRouter.route("/profile").put(updateUserProfile);
userRouter
  .route("/wishList")
  .put(validate(updateWishListSchema), updateUserWishList);

//********** receivedGifts **********
userRouter
  .route("/receivedGifts")
  .get(getAllReceivedGifts)
  .post(validate(createReceivedGiftSchema), createReceivedGift);
userRouter
  .route("/receivedGifts/:receivedGiftId")
  .get(getReceivedGift)
  .put(validate(updateReceivedGiftSchema), updateReceivedGift)
  .delete(deleteReceivedGift);

export default userRouter;
