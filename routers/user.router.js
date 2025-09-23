import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import {
  deleteUser,
  login,
  logout,
  me,
  register,
  updateUser,
} from "../controllers/auth.controller.js";
import {
  getAllReceivedGifts,
  getReceivedGift,
  createReceivedGift,
  updateReceivedGift,
  deleteReceivedGift,
} from "../controllers/receivedGift.controller.js";
import {
  updateUserProfile,
  updateUserWishList,
} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").delete(logout);
userRouter
  .route("/me")
  .get(authenticate, me)
  .put(authenticate, updateUser)
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
