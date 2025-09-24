import { z } from 'zod/v4';
import { giftSchema, updateGiftSchema } from './gift.schema.js';

export const createReceivedGiftSchema = z.object({
  contactType: z.enum(['user', 'custom']).optional(),
  fromName: z.array(z.string().trim()).optional(),
  gift: giftSchema,
});

export const updateReceivedGiftSchema = z
  .object({
    fromName: z.array(z.string().trim()).optional(),
    gift: updateGiftSchema.optional(),
  })
  .refine((v) => v.fromName !== undefined || v.gift !== undefined, {
    message: 'Provide at least one of: gift, fromName',
  });
