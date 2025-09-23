import { Event, Contact } from '../models/index.js';

// GET /contacts/:id/events
export const getAllEvents = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    const events = await Event.find({ contactId }).populate('gift');
    return res.status(200).json(events);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch events', error: err.message });
  }
};

// GET /contacts/:id/events/:eventId
export const getEvent = async (req, res) => {
  try {
    const { id: contactId, eventId } = req.params;
    const event = await Event.findOne({ _id: eventId, contactId }).populate(
      'gift'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json(event);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch event', error: err.message });
  }
};

// POST /contacts/:id/events
export const createEvent = async (req, res) => {
  try {
    const { id: contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    const payload = {
      ...req.body,
      contactId,
      ownerId: contact.ownerId,
    };

    const created = await Event.create(payload);

    await Contact.findByIdAndUpdate(contactId, {
      $addToSet: { eventList: created._id },
    });

    const populated = await created.populate('gift');
    return res.status(201).json(populated);
  } catch (err) {
    const status = err?.name === 'ValidationError' ? 400 : 500;
    return res
      .status(status)
      .json({ message: 'Failed to create event', error: err.message });
  }
};

// PUT /contacts/:id/events/:eventId
export const updateEvent = async (req, res) => {
  try {
    const { id: contactId, eventId } = req.params;
    const updated = await Event.findOneAndUpdate(
      { _id: eventId, contactId },
      req.body,
      { new: true, runValidators: true }
    ).populate('gift');
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json(updated);
  } catch (err) {
    const status = err?.name === 'ValidationError' ? 400 : 500;
    return res
      .status(status)
      .json({ message: 'Failed to update event', error: err.message });
  }
};

// DELETE /contacts/:id/events/:eventId
export const deleteEvent = async (req, res) => {
  try {
    const { id: contactId, eventId } = req.params;
    const deleted = await Event.findOneAndDelete({ _id: eventId, contactId });
    if (!deleted) return res.status(404).json({ message: 'Event not found' });

    await Contact.findByIdAndUpdate(contactId, {
      $pull: { eventList: deleted._id },
    });

    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to delete event', error: err.message });
  }
};
