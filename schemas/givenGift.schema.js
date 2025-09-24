import { z } from 'zod/v4';
import { giftSchema, updateGiftSchema } from './gift.schema.js';

export const createGivenGiftSchema = z.object({
  gift: giftSchema,
});

export const updateGivenGiftSchema = z.object({
  gift: updateGiftSchema,
});
