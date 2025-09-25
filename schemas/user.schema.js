/** @format */

import { z } from "zod/v4";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])/;

export const userSchema = z.object({
  email: z.string().trim().email("email should be a valid email"),
  password: z.string().min(8).max(512).regex(passwordRegex, {
    error:
      "Password needs to contain at least on upper, one lower case, one number and a special character.",
  }),
  profil: z.object({
    name: z.string(),
    avatar: z.string(),
    birthday: z.date(),
    gender: z.enum(["male", "female", "other"]),
    tags: z.array(z.string()),
  }),
  wishList: z.array(z.string()),
  receivedGifts: z.array(
    z.object({
      type: z.string(),
      id: z.string(),
    })
  ),
  contacts: z.array(
    z.object({
      type: z.string(),
      id: z.string(),
    })
  ),
  events: z.array(
    z.object({
      type: z.string(),
      id: z.string(),
    })
  ),
});

// register schema
export const registerSchema = userSchema.omit({
  profil: true,
  wishList: true,
  receivedGifts: true,
  contacts: true,
  events: true,
});

// login schema
export const loginSchema = userSchema.omit({
  profil: true,
  wishList: true,
  receivedGifts: true,
  contacts: true,
  events: true,
});

// update user profile schema
export const updateUserSchema = z.object({
  name: z.string("Name must be a string"),
  avatar: z.string("Avatar must be a string"),
  birthday: z.date("Birthday must be a date"),
  tags: z.array(z.string("Tags must be an array of strings")),
});
