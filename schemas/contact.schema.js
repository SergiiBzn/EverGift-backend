/** @format */

import { z } from "zod";

const customProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().optional(),
  birthday: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  tags: z.array(z.string()).optional(),
});

export const createContactSchema = z
  .object({
    contactType: z.enum(["user", "custom"]),
    linkedUserId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
      .optional(),
    customProfile: customProfileSchema.optional(),
  })
  .refine(
    (data) => {
      // user contact must have linkedUserId
      if (data.contactType === "user" && !data.linkedUserId) {
        return false;
      }
      // custom contact must have customProfile
      if (data.contactType === "custom" && !data.customProfile) {
        return false;
      }
      return true;
    },
    {
      message: "Invalid contact data",
    }
  );

export const updateContactProfileSchema = z.object({
  contactType: z.literal("custom"),
  customProfile: customProfileSchema,
});

export const updateWishListSchema = z.array(
  z.object({
    item: z.string().min(1, "Item name cannot be empty"),
    description: z.string().optional(),
  })
);

export const updateContactNoteSchema = z.object({
  note: z.string().optional(),
});
