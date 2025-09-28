/** @format */

import { Schema, model } from "mongoose";
import { profileSchema } from "./profileSchema.js";
import { wishItemSchema } from "./wishListSchema.js";

import { generateUniqueSlug } from "../utils/index.js";
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
  slug: {
    type: String,

    unique: true,
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

userSchema.pre("save", async function (doc, next) {
  if (this.isNew || this.isModified("profile.name")) {
    if (this.profile?.name) {
      this.slug = await generateUniqueSlug(
        mongoose.model("User"),
        this.profile.name,
        this._id
      );
    } else if (this.isNew) {
      const emailPrefix = this.email.split("@")[0];
      this.slug = await generateUniqueSlug(
        mongoose.model("User"),
        emailPrefix,
        this._id
      );
    }
  }
  next();
});

userSchema.pre("save", async function (doc, next) {
  if (this.isModified("slug")) {
    try {
      await Contact.updateMany(
        { ownerId: this._id },
        { $set: { slug: this.slug } }
      );
    } catch (error) {
      console.error(
        `Error syncing slug for user ${doc._id} to contacts:`,
        error
      );
    }
  }
  next();
});
const User = model("User", userSchema);

export default User;
