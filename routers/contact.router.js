import { Router } from 'express';
import {
  getAllGivenGifts,
  getGivenGift,
  createGivenGift,
  updateGivenGift,
  deleteGivenGift,
} from '../controllers/givenGift.controller.js';
import {
  getAllContacts,
  getContact,
  createContact,
  updateContactNote,
  deleteContact,
  updateContactProfile,
} from '../controllers/contact.controller.js';
import { checkCustomContact } from '../middlewares/index.js';

const contactRouter = Router();

contactRouter.route('/').get(getAllContacts).post(createContact);
// get and delete contact by ID
contactRouter
  .route('/:id')
  .get(getContact)
  .delete(checkCustomContact, deleteContact);

// update contact note
contactRouter.route('/:id/note').put(updateContactNote);

// update contact profile and wishlist if custom contact
contactRouter
  .route('/:id/profile')
  .put(checkCustomContact, updateContactProfile);

contactRouter
  .route('/:id/wishList')
  .put(checkCustomContact, updateContactWishList);

contactRouter
  .route('/:id/givenGifts')
  .get(getAllGivenGifts)
  .post(createGivenGift);
contactRouter
  .route('/:id/givenGifts/:giftId')
  .get(getGivenGift)
  .put(updateGivenGift)
  .delete(deleteGivenGift);

contactRouter.route('/:id/events').get(getAllEvents).post(createEvent);
contactRouter
  .route('/:id/events/:eventId')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

export default contactRouter;
