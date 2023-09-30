import { v2 as cloudinary } from "cloudinary";

// Configuration
export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
export const addVideo = async (file) => {
  if (file) {
    // Save video to cloudinary
    const uploadedFile = await cloudinary.uploader.upload(file.path, {
      folder: "HNG Video",
      resource_type: "video",
    });
    fileData = {
      id: uploadedFile.public_id,
      fileName: file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: file.mimetype,
      fileSize: fileSizeFormatter(file.size, 2),
    };
  }
};
