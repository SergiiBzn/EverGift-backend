/** @format */

import multer from "multer";
import path from "path";

import Cloudinary from "../services/cloudinary.js";

// define the upload directory
const uploadDir = path.join(
  "../public", //this is used inside index.js therefore it is the backend root
  "files" //multer will create a folder called files in the public folder if It doesn't exist
);

console.log("uploadDir", uploadDir);
const cloudinaryStorage = new Cloudinary();

const filter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|svg|avif|webp/; // only JPEG, JPG ,PNG AND GIF files allowed
  //grabs the file’s extension and makes it lowercase and check if the file extension match the allowed filetypes
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //grabs the mimetype and check if the file mimetype contains the  allowed filetypes

  //Note: file.mimetype  gives us image/jpeg or image/png .....back
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); //If both are true, cb(null, true) allows the upload
  } else {
    cb("Error: Images only!"); //If not, the upload is rejected.
  }
};

const maxSize = 1024 * 1024 * 6; //6MB=1024KB=1024*1024*6 byte

const uploadFile = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: maxSize }, // Limit file size to 6MB
  fileFilter: filter,
}).single("avatar"); //name of the field in the form where the file is uploaded

console.log("uploadFile", uploadFile);

export default uploadFile;
