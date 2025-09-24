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
import { checkCustomContact, validate } from "../middlewares/index.js";
import {
  createGivenGiftSchema,
  updateGivenGiftSchema,
} from "../schemas/givenGift.schema.js";
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
contactRouter.route("/:contactId").get(getContact).delete(deleteContact);

// update contact note
contactRouter.route("/:contactId/note").put(updateContactNote);

// update contact profile and wishlist if custom contact
contactRouter
  .route("/:contactId/profile")
  .put(checkCustomContact, updateContactProfile);

contactRouter
  .route("/:contactId/wishlist")
  .put(checkCustomContact, updateContactWishList);

//********** contact GivenGifts **********

contactRouter
  .route("/:contactId/givenGifts")
  .get(getAllGivenGifts)
  .post(validate(createGivenGiftSchema), createGivenGift);
contactRouter
  .route("/:contactId/givenGifts/:givenGiftId")
  .get(getGivenGift)
  .put(validate(updateGivenGiftSchema), updateGivenGift)
  .delete(deleteGivenGift);

//********** contact Events **********

contactRouter.route("/:contactId/events").get(getAllEvents).post(createEvent);
contactRouter
  .route("/:contactId/events/:eventId")
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

export default contactRouter;
