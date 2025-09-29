/** @format */

// This middleware reshapes the flat req.body from multer into the
// nested structure that the validation schema expects.
export const restructureContactBody = (req, res, next) => {
  if (req.body.contactType === "custom") {
    const { name, avatar, birthday, gender, tags } = req.body;

    // Safely parse tags, defaulting to an empty array if tags are missing or not a string
    const parsedTags = tags && typeof tags === "string" ? JSON.parse(tags) : [];

    // Create the nested customProfile object for the validator
    req.body.customProfile = {
      name,
      avatar,
      birthday,
      gender,
      tags: parsedTags,
    };
  }

  next();
};
