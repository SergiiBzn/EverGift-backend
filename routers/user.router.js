import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import { deleteUser, login, logout, me, register, updateUser } from "../controllers/auth.controller.js";
import {
  getAllReceivedGifts,
  getReceivedGift,
  createReceivedGift,
  updateReceivedGift,
  deleteReceivedGift,
} from '../controllers/receivedGift.controller.js';
import { updateUserProfile, updateUserWishList } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').delete(logout);
userRouter
  .route('/me')
  .get(authenticate, me)
  .put(authenticate, updateUser)
  .delete(authenticate, deleteUser);

// profile
userRouter.route('/profile').put(authenticate, updateUserProfile);
userRouter.route('/wishList').put(authenticate,updateUserWishList);

userRouter
  .route('/:id/receivedGifts')
  .get(authenticate, getAllReceivedGifts)
  .post(authenticate, createReceivedGift);
userRouter
  .route('/:id/receivedGifts/:giftId')
  .get(authenticate, getReceivedGift)
  .put(authenticate, updateReceivedGift)
  .delete(authenticate, deleteReceivedGift);

  // TODO: events

userRouter
  .route('/:id/events')
  .get(getAllEvents)
  .post(authenticate, createEvent);
export default userRouter;
