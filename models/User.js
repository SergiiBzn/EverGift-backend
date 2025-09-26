/** @format */

import { Schema, model } from "mongoose";
import { wishItemSchema } from "./wishListSchema.js";
import { profileSchema } from "./profileSchema.js";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  profile: {
    type: profileSchema,
    default: () => ({}),
  },
  wishList: [{ type: wishItemSchema, default: [] }],
  receivedGifts: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReceivedGift",
    },
  ],
  contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

const User = model("User", userSchema);

export default User;
