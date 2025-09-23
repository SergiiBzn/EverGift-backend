/** @format */

import { Router } from "express";
import {
  getAllGivenGifts,
  getGivenGift,
  createGivenGift,
  updateGivenGift,
  deleteGivenGift,
} from "../controllers/givenGift.controller.js";
import {
  getAllContacts,
  getContact,
  createContact,
  updateContactNote,
  deleteContact,
  updateContactProfile,
  updateContactWishList,
} from "../controllers/contact.controller.js";
import { authenticate, checkCustomContact } from "../middlewares/index.js";
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const contactRouter = Router();

contactRouter
  .route("/")
  .get(authenticate, getAllContacts)
  .post(authenticate, createContact);
// get and delete contact by ID
contactRouter
  .route("/:contactId")
  .get(authenticate, getContact)
  .delete(authenticate, checkCustomContact, deleteContact);

// update contact note
contactRouter.route("/:contactId/note").put(authenticate, updateContactNote);

// update contact profile and wishlist if custom contact
contactRouter
  .route("/:contactId/profile")
  .put(authenticate, checkCustomContact, updateContactProfile);

contactRouter
  .route("/:contactId/wishlist")
  .put(authenticate, checkCustomContact, updateContactWishList);

//********** contact GivenGifts **********

contactRouter
  .route("/:contactId/givenGifts")
  .get(authenticate, getAllGivenGifts)
  .post(authenticate, createGivenGift);
contactRouter
  .route("/:contactId/givenGifts/:givenGiftId")
  .get(authenticate, getGivenGift)
  .put(authenticate, updateGivenGift)
  .delete(authenticate, deleteGivenGift);

//********** contact Events **********

contactRouter
  .route("/:contactId/events")
  .get(authenticate, getAllEvents)
  .post(authenticate, createEvent);
contactRouter
  .route("/:contactId/events/:eventId")
  .get(authenticate, getEvent)
  .put(authenticate, updateEvent)
  .delete(authenticate, deleteEvent);

export default contactRouter;
