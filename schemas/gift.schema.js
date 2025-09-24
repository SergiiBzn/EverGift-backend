import { z } from 'zod/v4';

export const giftSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  // Accept ISO strings or Date; coerce to Date for Mongoose
  date: z.coerce.date({ required_error: 'Date is required' }),
});

export const updateGiftSchema = giftSchema.partial();
