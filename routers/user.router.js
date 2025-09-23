/** @format */

import { Router } from "express";
import {
  deleteUser,
  login,
  logout,
  me,
  register,
  updateUser,
} from "../controllers/auth.controller.js";
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
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/index.js";
import validate from "../middlewares/validate.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";
const userRouter = Router();

//********** Auth users **********
userRouter.route("/register").post(validate(registerSchema), register);
userRouter.route("/login").post(validate(loginSchema), login);
userRouter.route("/logout").delete(logout);
userRouter
  .route("/me")
  .get(authenticate, me)
  .put(authenticate, validate(updateUserSchema), updateUser)
  .delete(authenticate, deleteUser);

//********** profile **********
userRouter.route("/profile").put(authenticate, updateUserProfile);
userRouter.route("/wishList").put(authenticate, updateUserWishList);

//********** receivedGifts **********
userRouter
  .route("/receivedGifts")
  .get(authenticate, getAllReceivedGifts)
  .post(authenticate, createReceivedGift);
userRouter
  .route("/receivedGifts/:receivedGiftId")
  .get(authenticate, getReceivedGift)
  .put(authenticate, updateReceivedGift)
  .delete(authenticate, deleteReceivedGift);

// userRouter
//   .route("/:id/events")
//   .get(getAllEvents)
//   .post(authenticate, createEvent);
export default userRouter;
