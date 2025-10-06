import { Event } from "../models/index.js";
import { addYears, isSameDay } from "date-fns";

export const generateNextYearEvents = async () => {
  const today = new Date();

  console.log("🔄Checking for yearly repeat events...");

  const repeatEvents = await Event.find({
    isRepeat: "yearly",
  });

  for (const event of repeatEvents) {
    if (isSameDay(today, new Date(event.date))) {
      const nextYear = addYears(new Date(event.date), 1);

      const exists = await Event.findOne({
        title: event.title,
        contactId: event.contactId,
        date: nextYear,
      });
      if (exists) continue;

      await Event.create({
        ...event.toObject(),
        date: nextYear,
        achived: false,
      });

      event.achived = true;
      await event.save();

      console.log(`✨ Created next year's event for: ${event.title}`);
    }
  }
};
