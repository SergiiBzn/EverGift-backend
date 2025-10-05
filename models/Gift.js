import { Schema, model } from "mongoose";

const giftSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        if (ret.date) {
          ret.date = new Date(ret.date).toISOString().split("T")[0];
        }
        return ret;
      },
    },
  },
  { timestamps: true }
);

const Gift = model("Gift", giftSchema);
export default Gift;
