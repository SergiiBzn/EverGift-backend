import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  profil: {
    username: {
      type: String,
      default: '',
    },
  },
  wishList: {
    type: Array,
    default: [],
  },
  giftHistory: [
    {
      giftName: String,
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
      fromName: String,
      recievedDate: { type: Date, required: true },
    },
  ],
});

const User = model('user', userSchema);
export default User;
