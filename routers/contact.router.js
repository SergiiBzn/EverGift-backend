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
import { checkCustomContact } from "../middlewares/index.js";
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const contactRouter = Router();

contactRouter.route("/").get(getAllContacts).post(createContact);
// get and delete contact by ID
contactRouter
  .route("/:contactId")
  .get(getContact)
  .delete(checkCustomContact, deleteContact);

// update contact note
contactRouter.route("/:contactId/note").put(updateContactNote);

// update contact profile and wishlist if custom contact
contactRouter
  .route("/:contactId/profile")
  .put(checkCustomContact, updateContactProfile);

contactRouter
  .route("/:contactId/wishList")
  .put(checkCustomContact, updateContactWishList);

contactRouter
  .route("/:contactId/givenGifts")
  .get(getAllGivenGifts)
  .post(createGivenGift);
contactRouter
  .route("/:contactId/givenGifts/:givenGiftId")
  .get(getGivenGift)
  .put(updateGivenGift)
  .delete(deleteGivenGift);

contactRouter.route("/:contactId/events").get(getAllEvents).post(createEvent);
contactRouter
  .route("/:contactId/events/:eventId")
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

export default contactRouter;
