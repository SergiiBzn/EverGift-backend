import z from "zod/v4";
export const updateNotificationSchema = z.object({
  action: z.enum(["read", "accept", "reject", "delete"]),
});
