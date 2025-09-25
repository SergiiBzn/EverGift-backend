import { Schema, model } from "mongoose";

const givenGiftSchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
  },
  gift: { type: Schema.Types.ObjectId, ref: "Gift" },
});

const GivenGift = model("GivenGift", givenGiftSchema);
export default GivenGift;
