import { Schema, model } from "mongoose";

const receivedGiftSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contactType: {
    type: String,
    enum: ["user", "custom"],
    required: true,
  },
  gift: { type: Schema.Types.ObjectId, ref: "Gift" },
  from: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  fromName: { type: Array, default: [] }, // custom
});

const ReceivedGift = model("ReceivedGift", receivedGiftSchema);
export default ReceivedGift;
