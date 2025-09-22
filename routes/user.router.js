import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").delete(logout);
userRouter.route("/me").get(me).put(updateUser).delete(deleteUser);

userRouter
  .route("/:id/receivedGifts")
  .get(getAllReceivedGifts)
  .post(createReceivedGift);
userRouter
  .route("/:id/receivedGifts/:giftId")
  .get(getReceivedGift)
  .put(updateReceivedGift)
  .delete(deleteReceivedGift);

userRouter.route("/:id/events").get(getAllEvents).post(createEvent);
export default userRouter;
