import { Schema, model } from 'mongoose';

const givenGiftSchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  },
  gift: { type: Schema.Types.ObjectId, ref: 'Gift' },
});

const GivenGift = model('GivenGift', givenGiftSchema);

//======================= Contact =================

const contactSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactType: {
    type: String,
    enum: ['user', 'custom'],
    default: 'custom', //user ohne Konto (Kinder) -> Form
    required: true,
  },

  linkedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  customProfil: {
    name: { type: String, required: true },
    avatar: { type: String },
    birthday: { type: Date, required: true },
    tags: [String],
  },

  note: { type: String },
  wishList: [{ type: String }],
  givenGifts: [{ type: Schema.Types.ObjectId, ref: 'GivenGift' }],
  eventList: [{ type: Schema.Types.ObjectId, ref: 'Event' }],

  //  status: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'blocked'],
  //   default: 'accepted' // custom contact default: accepted
  // },
});

const Contact = model('Contact', contactSchema);
export default Contact;
