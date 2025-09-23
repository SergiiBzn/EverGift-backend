import { Schema, model } from "mongoose";
import { required } from "zod/mini";

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
    avatar: { type: String },
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

  note: { type: String },
  wishList: { type: Array, default: [] },
  givenGifts: [{ type: Schema.Types.ObjectId, ref: "GivenGift" }],
  eventList: [{ type: Schema.Types.ObjectId, ref: "Event" }],

  //  status: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'blocked'],
  //   default: 'accepted' // custom contact default: accepted
  // },
});

const Contact = model("Contact", contactSchema);
export default Contact;
