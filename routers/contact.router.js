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
import {
  checkCustomContact,
  validate,
  checkContact,
  restructureContactBody,
  parseCustomProfile,
  uploadFile,
} from "../middlewares/index.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../schemas/event.schema.js";
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
import {
  createContactSchema,
  updateContactProfileSchema,
  updateContactNoteSchema,
  updateWishListSchema,
} from "../schemas/contact.schema.js";

// import { restructureContactBody, parseCustomProfile ,uploadFile} from "../middlewares/index.js";
const contactRouter = Router();

contactRouter.route("/").get(getAllContacts).post(
  uploadFile,

  restructureContactBody,
  validate(createContactSchema),
  createContact
);
// get and delete contact by Slug
contactRouter.route("/:contactSlug").get(getContact).delete(deleteContact);

// update contact note
contactRouter
  .route("/:contactSlug/note")
  .put(validate(updateContactNoteSchema), updateContactNote);

// update contact profile and wishlist if custom contact
contactRouter
  .route("/:contactSlug/profile")
  .put(
    uploadFile,
    checkCustomContact,
    restructureContactBody,
    validate(updateContactProfileSchema),
    updateContactProfile
  );

contactRouter
  .route("/:contactSlug/wishlist")
  .put(
    checkCustomContact,
    validate(updateWishListSchema),
    updateContactWishList
  );

//********** contact GivenGifts **********
//middlewares: check contact exist

contactRouter
  .route("/:contactId/givenGifts")
  .get(checkContact, getAllGivenGifts)
  .post(checkContact, validate(createGivenGiftSchema), createGivenGift);
contactRouter
  .route("/:contactId/givenGifts/:givenGiftId")
  .get(checkContact, getGivenGift)
  .put(checkContact, validate(updateGivenGiftSchema), updateGivenGift)
  .delete(checkContact, deleteGivenGift);

//********** contact Events **********

contactRouter
  .route("/:contactId/events")
  .get(checkContact, getAllEvents)
  .post(checkContact, validate(createEventSchema), createEvent);
contactRouter
  .route("/:contactId/events/:eventId")
  .get(checkContact, getEvent)
  .put(checkContact, validate(updateEventSchema), updateEvent)
  .delete(checkContact, deleteEvent);

export default contactRouter;
