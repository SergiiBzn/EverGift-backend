import { Router } from "express";
const contactRouter = Router();

contactRouter.route("/").get(getAllContacts).post(createContact);
contactRouter
  .route("/:id")
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

contactRouter
  .route("/:id/givenGifts")
  .get(getAllGivenGifts)
  .post(createGivenGift);
contactRouter
  .route("/:id/givenGifts/:giftId")
  .get(getGivenGift)
  .put(updateGivenGift)
  .delete(deleteGivenGift);

contactRouter.route("/:id/events").get(getAllEvents).post(createEvent);
contactRouter
  .route("/:id/events/:eventId")
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

export default contactRouter;
