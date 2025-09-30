/** @format */

import { Event, Contact, Gift, User } from "../models/index.js";

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
    return res.status(200).json(event);
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

    const existEvent = await Event.findOne({ contactId, title });

    if (existEvent) {
      throw new Error("Event already exist", {
        cause: 400,
      });
    }

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

    const populated = await created.populate("gift");

    const populatedEventContact = await populated.populate("contactId");
    return res.status(201).json(populatedEventContact);
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
    const { gift, date } = req.body;
    // if gift is provided, create it first
    if (gift) {
      const createdGift = await Gift.create({ ...gift, date });
      req.body.gift = createdGift._id;
    }

    const updated = await Event.findOneAndUpdate(
      { _id: eventId, contactId },
      req.body,
      { new: true, runValidators: true }
    ).populate("gift");
    if (!updated) return res.status(404).json({ message: "Event not found" });

    return res.status(200).json(updated);
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
