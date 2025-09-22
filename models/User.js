import { Schema, model } from "mongoose";

<<<<<<< HEAD
//********** ReceivedGift Schema **********/
const receivedGiftSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactType: {
    type: String,
    enum: ['user', 'custom'],
    required: true,
  },
  gift: { type: Schema.Types.ObjectId, ref: 'Gift' },
  from: [{ type: Schema.Types.ObjectId, ref: 'Contact' }],
  fromName: { type: [String], default: [] }, // custom
});

const ReceivedGift = model('ReceivedGift', receivedGiftSchema);

//********** User Schema **********/
=======
>>>>>>> 276e2cd3154d9aaf9288e3c14cde2f2f138ccb1d
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
    tags: [String],
  },
  wishList: [{ type: String }],
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
