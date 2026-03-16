import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
};

cloudinary.config(credentials);

export const imageStore = {

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile) {
    writeFileSync("./public/temp.image", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/temp.image");
    return response.url;
  },

  deleteImage: async function(image) {
    await cloudinary.v2.uploader.destroy(image, {});
  },

  updateImage: async function(image, newImageFile) {
    writeFileSync("./public/temp.image", newImageFile);
    await cloudinary.v2.uploader.destroy(image, {});
    const response = await cloudinary.v2.uploader.upload("./public/temp.image");
    return response.url;
  },
};
