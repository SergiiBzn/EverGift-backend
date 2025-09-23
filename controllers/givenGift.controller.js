import { de } from "zod/locales";
import { GivenGift, Gift, Contact } from "../models/index.js";

// GET /contacts/:id/givenGifts
export const getAllGivenGifts = async (req, res) => {
  try {
    const { contactId } = req.params;
    const gifts = await GivenGift.find({ contactId }).populate("gift");
    return res.status(200).json(gifts);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch given gifts", error: err.message });
  }
};

// GET /contacts/:contactId/givenGifts/:givenGiftId
export const getGivenGift = async (req, res) => {
  try {
    const { contactId, givenGiftId } = req.params;
    const gift = await GivenGift.findOne({
      _id: givenGiftId,
      contactId,
    }).populate("gift");
    if (!gift) return res.status(404).json({ message: "Given gift not found" });
    return res.status(200).json(gift);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch given gift", error: err.message });
  }
};

// POST /contacts/:contactId/givenGifts
export const createGivenGift = async (req, res) => {
  try {
    const { contactId } = req.params;
    let payload = { ...req.body, contactId };

    const { gift } = req.body;
    const createGift = await Gift.create(gift);

    payload = { ...payload, gift: createGift._id };
    const created = await GivenGift.create(payload);

    // update contact's givenGifts array
    await Contact.findByIdAndUpdate(contactId, {
      $push: { givenGifts: created._id },
    });

    const populated = await created.populate("gift");

    return res.status(201).json(populated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to create given gift", error: err.message });
  }
};

// PUT /contacts/:contactId/givenGifts/:givenGiftId
export const updateGivenGift = async (req, res) => {
  try {
    const { contactId, givenGiftId } = req.params;
    // const updated = await GivenGift.findOneAndUpdate(
    //   { _id: givenGiftId, contactId },
    //   req.body,
    //   { new: true, runValidators: true }
    // ).populate("gift");
    // if (!updated)
    //   return res.status(404).json({ message: "Given gift not found" });
    const giftToUpdate = await GivenGift.findOne({
      _id: givenGiftId,
      contactId,
    });
    if (!giftToUpdate)
      return res.status(404).json({ message: "Given gift not found" });
    await Gift.findByIdAndUpdate(giftToUpdate.gift, req.body.gift, {
      new: true,
    });
    const updated = await giftToUpdate.save();
    const populated = await updated.populate("gift");

    return res.status(200).json(populated);
  } catch (err) {
    const status = err?.name === "ValidationError" ? 400 : 500;
    return res
      .status(status)
      .json({ message: "Failed to update given gift", error: err.message });
  }
};

// DELETE /contacts/:contactId/givenGifts/:givenGiftId
export const deleteGivenGift = async (req, res) => {
  try {
    const { contactId, givenGiftId } = req.params;
    const deleted = await GivenGift.findOneAndDelete({
      _id: givenGiftId,
      contactId,
    });
    if (!deleted)
      return res.status(404).json({ message: "Given gift not found" });

    // delete associated gift
    if (deleted.gift) await Gift.findByIdAndDelete(deleted.gift);

    // update contact's givenGifts array
    await Contact.findByIdAndUpdate(contactId, {
      $pull: { givenGifts: givenGiftId },
    });

    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete given gift", error: err.message });
  }
};
