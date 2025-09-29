/** @format */

import mongoose, { Schema, model } from "mongoose";
import { GivenGift, User, Event, Gift } from "./index.js";
import { profileSchema } from "./profileSchema.js";
import { wishItemSchema } from "./wishListSchema.js";
import { generateUniqueSlug } from "../utils/index.js"; //********** contact Schema **********/

const contactSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contactType: {
    type: String,
    enum: ["user", "custom"],
    default: "custom",
    required: true, //user ohne Konto (Kinder) -> Form
  },

  linkedUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  customProfile: {
    type: profileSchema,
    default: () => ({}),
  },

  customWishList: { type: [wishItemSchema], default: [] },

  note: { type: String },
  givenGifts: [{ type: Schema.Types.ObjectId, ref: "GivenGift" }],
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],

  slug: {
    type: String,

    unique: true,
  },

  //  status: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'blocked'],
  //   default: 'accepted' // custom contact default: accepted
  // },
});

// Pre-save hook to generate slug from custom contact name
contactSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("customProfile.name")) {
    if (this.contactType === "user") {
      // When contactType is 'user', the slug is derived from the linked user's slug.
      // We need to fetch the User document to get its slug.
      const User = mongoose.model("User");
      const linkedUser = await User.findById(this.linkedUserId).select("slug");
      if (linkedUser && linkedUser.slug) this.slug = linkedUser.slug;
      else
        throw new Error("Could not generate slug from linked user", {
          cause: 404,
        });
    } else if (this.contactType === "custom") {
      if (this.customProfile?.name) {
        this.slug = await generateUniqueSlug(
          mongoose.model("Contact"),
          this.customProfile.name,
          this._id
        );
      }
      console.log("slug", this.slug);
    }
  }
  next();
});

// delete cascade
contactSchema.pre("findOneAndDelete", async function (next) {
  const contact = await this.model.findOne(this.getQuery());
  if (!contact) throw new Error("Contact not found", { cause: 404 });

  // remove all givenGifts
  if (contact.givenGifts?.length) {
    const givenGiftsToDelete = await GivenGift.find({
      _id: { $in: contact.givenGifts },
    });
    // delete all givenGifts associated with the contact

    const giftIds = givenGiftsToDelete
      .map((givenGift) => givenGift.gift)
      .filter((giftId) => giftId !== null);

    if (giftIds.length) await Gift.deleteMany({ _id: { $in: giftIds } });
    await GivenGift.deleteMany({ _id: { $in: contact.givenGifts } });
  }

  // remove all events and associated gifts
  if (contact.events?.length) {
    const eventsToDelete = await Event.find({ _id: { $in: contact.events } });

    const giftIds = eventsToDelete
      .map((event) => event.gift)
      .filter((giftId) => giftId !== null); // array of gift ids to delete

    // delete all events and gifts associated with the contact
    if (giftIds.length) await Gift.deleteMany({ _id: { $in: giftIds } });

    await Event.deleteMany({ _id: { $in: contact.events } });

    // // update user's events array
    await User.findByIdAndUpdate(contact.ownerId, {
      $pull: { events: { $in: contact.events } },
    });
  }
  // remove contact from user's contacts array
  await User.findByIdAndUpdate(contact.ownerId, {
    $pull: { contacts: contact._id },
  });

  next();
});

const Contact = model("Contact", contactSchema);
export default Contact;
