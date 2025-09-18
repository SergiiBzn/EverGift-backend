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
    name: {
      type: String,
      default: '',
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

  giftHistory: [
    {
      role: {
        type: String,
        enum: ['user', 'custom'],
        default: 'custom',
        required: true,
      },

      giftName: String,
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
      fromName: String,
      recievedDate: { type: Date, required: true },
    },
  ],
});

const User = model('user', userSchema);
export default User;
