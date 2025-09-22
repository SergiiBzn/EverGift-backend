import { Schema, model } from "mongoose";

const giftSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
});

const Gift = model("Gift", giftSchema);
export default Gift;
