import GivenGift from "../models/givenGift.js";

// GET /contacts/:id/givenGifts
export const getAllGivenGifts = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    const gifts = await GivenGift.find({ contactId });
    return res.status(200).json(gifts);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch given gifts", error: err.message });
  }
};

// GET /contacts/:id/givenGifts/:giftId
export const getGivenGift = async (req, res) => {
  try {
    const { id: contactId, giftId } = req.params;
    const gift = await GivenGift.findOne({ _id: giftId, contactId });
    if (!gift)
      return res.status(404).json({ message: "Given gift not found" });
    return res.status(200).json(gift);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch given gift", error: err.message });
  }
};

// POST /contacts/:id/givenGifts
export const createGivenGift = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    const payload = { ...req.body, contactId };
    const created = await GivenGift.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create given gift", error: err.message });
  }
};

// PUT /contacts/:id/givenGifts/:giftId
export const updateGivenGift = async (req, res) => {
  try {
    const { id: contactId, giftId } = req.params;
    const updated = await GivenGift.findOneAndUpdate(
      { _id: giftId, contactId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Given gift not found" });
    return res.status(200).json(updated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to update given gift", error: err.message });
  }
};

// DELETE /contacts/:id/givenGifts/:giftId
export const deleteGivenGift = async (req, res) => {
  try {
    const { id: contactId, giftId } = req.params;
    const deleted = await GivenGift.findOneAndDelete({ _id: giftId, contactId });
    if (!deleted)
      return res.status(404).json({ message: "Given gift not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete given gift", error: err.message });
  }
};


//********** GET /contacts/:id/events **********
export const getAllEvents = async (req, res) => {
  /* try {
    const { id: contactId } = req.params;
    const events = await Event.find({ contactId });
    return res.json(events);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  } */
};

//********** POST /contacts/:id/events **********
export const createEvent = async (req, res) => {
  /* try {
    const { id: contactId } = req.params;
    const payload = { ...req.body, contactId };
    const event = await Event.create(payload);
    return res.status(201).json(event);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create event", error: err.message });
  } */
};