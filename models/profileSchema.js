import { Schema } from "mongoose";
// 1. Create a dedicated schema for the 'profile' object
export const profileSchema = new Schema(
  {
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    tags: [String],
  },
  // 2. enable virtuals "age" is included in JSON responses
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (ret.birthday) {
          ret.birthday = new Date(ret.birthday).toISOString().split("T")[0];
        }
        return ret;
      },
    },
    toObject: { virtuals: true },
    _id: false,
  }
);
// 3. Add a virtual field 'age' to the 'profile' schema
profileSchema.virtual("age").get(function () {
  if (!this.birthday) return undefined;
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});
