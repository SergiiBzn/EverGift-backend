import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    gift: {
      type: Schema.Types.ObjectId,
      ref: "Gift",
    },
    isRepeat: {
      type: String,
      enum: ["yearly", "none"],
      default: "none",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        if (ret.date) {
          ret.date = new Date(ret.date).toISOString().split("T")[0];
        }
        return ret;
      },
    },
  }
);

const Event = model("Event", eventSchema);
export default Event;
