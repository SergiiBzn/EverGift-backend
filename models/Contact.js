import { Schema, model } from "mongoose";
import { Event, GivenGift, Gift, User } from "./index.js";

//********** WishItem Schema for custom contacts **********/
export const wishItemSchema = new Schema({
  item: { type: String, required: true },
  description: { type: String, optional: true },
});

//********** contact Schema **********/

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

  customProfil: {
    name: {
      type: String,
      required: function () {
        return this.contactType === "custom";
      },
    },
    avatar: {
      type: String,
      default:
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    birthday: {
      type: Date,
      required: function () {
        return this.contactType === "custom";
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    tags: [String],
  },

  customWishList: { type: [wishItemSchema], default: [] },

  note: { type: String },
  givenGifts: [{ type: Schema.Types.ObjectId, ref: "GivenGift" }],
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],

  //  status: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'blocked'],
  //   default: 'accepted' // custom contact default: accepted
  // },
});

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
    console.log("giftIds", giftIds);

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
