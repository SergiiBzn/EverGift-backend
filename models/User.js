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

const ReceivedGift = model("receivedGift", receivedGiftSchema);

//========================  User   ===================================================
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
    },
    birthday: {
      type: Date,
      required: true,
    },
    tags: {
      type: Array,
    },
  },
  wishList: {
    type: Array,
    default: [],
  },
  recievedGifts: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReceivedGift",
    },
  ],
});

const User = model("user", userSchema);
export default User;
