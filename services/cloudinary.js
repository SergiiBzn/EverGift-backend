/** @format */

import { v2 as cloudinary } from "cloudinary";
class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          cb(error);
        } else {
          cb(null, result);
        }
      }
    );

    file.stream.pipe(uploadStream);
  }
  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.public_id, (error, result) => {
      if (error) {
        cb(error);
      } else {
        cb(null, result);
      }
    });
  }
}
export default Cloudinary;
