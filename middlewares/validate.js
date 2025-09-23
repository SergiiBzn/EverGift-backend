/** @format */

import { z } from "zod/v4";
const validate = (schema) => async (req, res, next) => {
  const { success, data, error } = await schema.safeParse(req.body);
  if (!success) {
    const message = z.prettifyError(error);
    throw new Error(message, { cause: 400 });
  }
  req.body = data;
  next();
};

export default validate;
