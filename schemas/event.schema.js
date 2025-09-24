import { z } from "zod/v4";
import { giftSchema } from "./gift.schema.js";

// For event payloads, the event carries the date, so gift input omits date
const giftForEventSchema = giftSchema.omit({ date: true });

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  date: z.coerce.date({ required_error: "Date is required" }),
  isRepeat: z.enum(["yearly", "none"]).optional(),
  isPinned: z.boolean().optional(),
  gift: giftForEventSchema.optional(),
});

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
    isRepeat: z.enum(["yearly", "none"]).optional(),
    isPinned: z.boolean().optional(),
    gift: giftForEventSchema.optional(),
  })
  .refine(
    (v) =>
      v.title !== undefined ||
      v.date !== undefined ||
      v.isRepeat !== undefined ||
      v.isPinned !== undefined ||
      v.gift !== undefined,
    { message: "Provide at least one field to update" }
  );

