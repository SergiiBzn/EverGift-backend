import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").delete(logout);
userRouter.route("/me").get(authenticate,me).put(authenticate,updateUser).delete(authenticate,deleteUser);

userRouter
  .route("/:id/receivedGifts")
  .get(authenticate,getAllReceivedGifts)
  .post(authenticate,createReceivedGift);
userRouter
  .route("/:id/receivedGifts/:giftId")
  .get(authenticate,getReceivedGift)
  .put(authenticate,updateReceivedGift)
  .delete(authenticate,deleteReceivedGift);

userRouter.route("/:id/events").get(getAllEvents).post(authenticate,createEvent);
export default userRouter;
