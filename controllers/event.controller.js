/** @format */

import { Event, Contact, Gift, User } from "../models/index.js";
// format event object

const formatEvent = async (eventDoc) => {
  const populated = await eventDoc.populate([
    {
      path: "gift",
      model: "Gift",
    },
    {
      path: "contactId",
      model: "Contact",
      populate: { path: "linkedUserId", model: "User", select: "profile" },
    },
  ]);
  const eventObject = populated.toObject();
  const { contactId: populatedContact, ...restOfEvent } = eventObject;
  const isUserContact = populatedContact.contactType === "user";
  const contactProfile = isUserContact
    ? populatedContact.linkedUserId.profile
    : populatedContact.customProfile;
  const finalEvent = {
    ...restOfEvent,
    contact: {
      id: populatedContact._id,
      profile: contactProfile,
      slug: populatedContact.slug,
    },
  };
  return finalEvent;
};
// GET /contacts/:contactId/events
export const getAllEvents = async (req, res) => {
  try {
    const { contactId } = req.params;
    const events = await Event.find({ contactId }).populate("gift");
    return res.status(200).json(events);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

// GET /contacts/:contactId/events/:eventId
export const getEvent = async (req, res) => {
  try {
    const { contactId, eventId } = req.params;
    const event = await Event.findOne({ _id: eventId, contactId }).populate(
      "gift"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    const finalEvent = await formatEvent(event);
    return res.status(200).json(finalEvent);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch event", error: err.message });
  }
};

// POST /contacts/:contactId/events
export const createEvent = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { gift, title, date } = req.body;

    const contact = await Contact.findById(contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // if gift is provided, create it first
    const createdGift = gift ? await Gift.create({ ...gift, date }) : null;
    // create event with reference to the created gift
    const payload = {
      ...req.body,
      contactId,
      ownerId: contact.ownerId,
      gift: createdGift ? createdGift._id : null,
    };

    const created = await Event.create(payload);

    await Contact.findByIdAndUpdate(contactId, {
      $push: { events: created._id },
    });

    // update events in User model
    await User.findByIdAndUpdate(contact.ownerId, {
      $push: { events: created._id },
    });
    // format event object
    const finalEvent = await formatEvent(created);

    return res.status(201).json(finalEvent);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create event", error: err.message });
  }
};

// PUT /contacts/:contactId/events/:eventId
export const updateEvent = async (req, res) => {
  try {
    const { contactId, eventId } = req.params;
    const { date, isRepeat, isPinned, title, gift: giftUpdateData } = req.body;

    // 1. Find the event first to get its current state, especially the gift ID
    const eventToUpdate = await Event.findOne({ _id: eventId, contactId });
    if (!eventToUpdate) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. If a new date is provided and there's an associated gift, update the gift's date
    let giftId = eventToUpdate.gift;
    // req body has giftUpdateData
    if (giftUpdateData && typeof giftUpdateData === "object") {
      const giftDetails = {
        ...giftUpdateData,
        date: date || eventToUpdate.date,
      };

      if (giftId) {
        // if giftId exists, update it
        await Gift.findByIdAndUpdate(giftId, giftDetails);
      } else {
        // if giftId does not exist, create a new one
        const newGift = await Gift.create(giftDetails);
        giftId = newGift._id;
      }
    }
    // if giftUpdateData is null and giftId exists, delete the gift
    else if (giftUpdateData === null && giftId) {
      await Gift.findByIdAndDelete(giftId);
      giftId = null; // set giftId to null after deletion
    }
    let payload = {};
    //  Update the event with the new payload
    payload.gift = giftId;

    if (date) payload.date = date;
    if (title) payload.title = title;
    if (isPinned !== undefined) payload.isPinned = isPinned;
    if (isRepeat) payload.isRepeat = isRepeat;

    const updated = await Event.findOneAndUpdate(
      { _id: eventId, contactId },
      payload,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Event not found" });
    // format event object
    const finalEvent = await formatEvent(updated);
    return res.status(200).json(finalEvent);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to update event", error: err.message });
  }
};

// DELETE /contacts/:contactId/events/:eventId
export const deleteEvent = async (req, res) => {
  try {
    const { contactId, eventId } = req.params;
    const deleted = await Event.findOneAndDelete({ _id: eventId, contactId });
    if (!deleted) return res.status(404).json({ message: "Event not found" });

    // if gift is associated with the event, delete it
    if (deleted.gift) {
      await Gift.findByIdAndDelete(deleted.gift);
    }

    // remove event reference from contact
    await Contact.findByIdAndUpdate(contactId, {
      $pull: { events: deleted._id },
    });
    // remove event reference from user
    await User.findByIdAndUpdate(deleted.ownerId, {
      $pull: { events: deleted._id },
    });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
};
