/** @format */

import { ReceivedGift, Gift, User } from "../models/index.js";

// GET /receivedGifts
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

// GET /receivedGifts/:receivedGiftId
export const getReceivedGift = async (req, res) => {
  try {
    const { receivedGiftId } = req.params;
    const userId = req.userId;
    const gift = await ReceivedGift.findOne({
      _id: receivedGiftId,
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

// POST /receivedGifts
export const createReceivedGift = async (req, res) => {
  try {
    const userId = req.userId;
    let payload = { ...req.body, ownerId: userId };

    const { gift } = req.body;
    const createGift = await Gift.create(gift);
    payload = { ...payload, gift: createGift._id };

    const created = await ReceivedGift.create(payload);

    // find user and update its receivedGifts array
    await User.findByIdAndUpdate(userId, {
      $push: { receivedGifts: created._id },
    });

    const populated = await created.populate("gift");
    return res.status(201).json(populated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create received gift", error: err.message });
  }
};

// PUT /receivedGifts/:receivedGiftId
export const updateReceivedGift = async (req, res) => {
  try {
    const { receivedGiftId } = req.params;
    const { gift, fromName } = req.body;
    const userId = req.userId;

    const receivedGift = await ReceivedGift.findOne({
      _id: receivedGiftId,
      ownerId: userId,
    });

    if (!receivedGift)
      throw new Error("Received gift not found", { cause: 404 });

    const updatedGift = await Gift.findByIdAndUpdate(
      receivedGift.gift._id,
      gift,
      { new: true }
    );
    if (!updatedGift) throw new Error("Gift not found", { cause: 404 });

    if (fromName) {
      receivedGift.fromName = fromName;
    }

    const saved = await receivedGift.save();
    const populated = await saved.populate("gift");

    return res.status(200).json(populated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to update received gift", error: err.message });
  }
};

// DELETE /receivedGifts/:receivedGiftId
export const deleteReceivedGift = async (req, res) => {
  try {
    const { receivedGiftId } = req.params;
    const userId = req.userId;
    const deleted = await ReceivedGift.findOneAndDelete({
      _id: receivedGiftId,
      ownerId: userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Received gift not found" });

    if (deleted.gift) {
      await Gift.findByIdAndDelete(deleted.gift._id);
    }
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete received gift", error: err.message });
  }
};
