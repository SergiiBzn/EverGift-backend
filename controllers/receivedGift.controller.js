import { ReceivedGift } from "../models/index.js";

// GET /users/:id/receivedGifts
export const getAllReceivedGifts = async (req, res) => {
  try {
    const userId = req.userId;
    const gifts = await ReceivedGift.find({ ownerId: userId }).populate("gift");
    return res.status(200).json(gifts);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch received gifts", error: err.message });
  }
};

// GET /users/:id/receivedGifts/:giftId
export const getReceivedGift = async (req, res) => {
  try {
    const { giftId } = req.params;
    const userId = req.userId;
    const gift = await ReceivedGift.findOne({
      _id: giftId,
      ownerId: userId,
    }).populate("gift");
    if (!gift)
      return res.status(404).json({ message: "Received gift not found" });
    return res.status(200).json(gift);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch received gift", error: err.message });
  }
};

// POST /users/:id/receivedGifts
export const createReceivedGift = async (req, res) => {
  try {
    const userId = req.userId;
    const payload = { ...req.body, ownerId: userId };
    const created = await ReceivedGift.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create received gift", error: err.message });
  }
};

// PUT /users/:id/receivedGifts/:giftId
export const updateReceivedGift = async (req, res) => {
  try {
    const { giftId } = req.params;
    const userId = req.userId;
    const updated = await ReceivedGift.findOneAndUpdate(
      { _id: giftId, ownerId: userId },
      req.body,
      { new: true, runValidators: true }
    ).populate("gift");
    if (!updated)
      return res.status(404).json({ message: "Received gift not found" });
    return res.status(200).json(updated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to update received gift", error: err.message });
  }
};

// DELETE /users/:id/receivedGifts/:giftId
export const deleteReceivedGift = async (req, res) => {
  try {
    const { giftId } = req.params;
    const userId = req.userId;
    const deleted = await ReceivedGift.findOneAndDelete({
      _id: giftId,
      ownerId: userId,
    });
    if (!deleted)
      return res.status(404).json({ message: "Received gift not found" });
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete received gift", error: err.message });
  }
};
