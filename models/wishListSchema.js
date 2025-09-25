import { Schema } from "mongoose";
//********** WishItem Schema for custom contacts **********/
export const wishItemSchema = new Schema({
  item: { type: String, required: true },
  description: { type: String, optional: true },
});
