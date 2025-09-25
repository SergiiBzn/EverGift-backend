/** @format */

import { Schema, model } from "mongoose";
import { wishItemSchema } from "./Contact.js";

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
  profil: {
    name: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    birthday: {
      type: Date,
      default: "",
    },
    tags: [String],
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
