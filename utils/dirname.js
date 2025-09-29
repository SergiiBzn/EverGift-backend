/** @format */

// dirname.js
import { fileURLToPath } from "url";
import { dirname } from "path";

export const getDirname = (importMetaUrl) => {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };
};
