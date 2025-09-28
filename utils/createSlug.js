/**
 * Generates a URL-friendly slug from a string.
 * @param {string} name - The string to convert into a slug.
 * @returns {string} The generated slug.
 */

import { Query } from "mongoose";

const generateBaseSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") //replace spaces with -
    .replace(/[^\w-]+/g, "") //remove non-word characters except -
    .replace(/--+/g, "-") //replace multiple - with single -
    .replace(/^-+/, "") //remove - from start
    .replace(/-+$/, ""); //remove - from end
};

/**
 * Generates a unique slug for a Mongoose model.
 * If the base slug already exists, it appends a short random string.
 * @param {mongoose.Model} model - The Mongoose model to check for uniqueness.
 * @param {string} name - The name to generate the slug from.
 * @param {string|null} [docId=null] - The ID of the document being updated, to exclude it from the uniqueness check.
 * @returns {Promise<string>} A promise that resolves to a unique slug.
 */

const generateUniqueSlug = async (model, name, docId = null) => {
  const baseSlug = generateBaseSlug(name);
  let slug = baseSlug;
  let counter = 0;

  // Build the query to check for existing slugs
  const query = { slug: slug };
  if (docId) {
    query._id = { $ne: docId };
  }

  // Keep generating a new slug until it's unique
  while (await model.findOne(query)) {
    // If the base slug is already taken, append a random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${randomSuffix}`;
    query.slug = slug;

    // As a fallback, if somehow the random slug also exists, increment a counter.
    // This is highly unlikely but ensures absolute uniqueness.
    if (await model.findOne(query)) {
      counter++;
      slug = `${baseSlug}-${randomSuffix}-${counter}`;
      query.slug = slug;
    }
  }
  return slug;
};
export default generateUniqueSlug;
