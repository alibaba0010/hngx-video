import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Configuration
export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
export const addVideo = async (file) => {
  if (file) {
    // Save video to cloudinary
    let fileData = {};

    const uploadedFile = await cloudinary.uploader.upload(file.path, {
      folder: "HNG Video",
      resource_type: "video",
    });
    fileData = {
      id: uploadedFile.public_id,
      fileName: file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: file.mimetype,
    };
    return fileData;
  }
};
