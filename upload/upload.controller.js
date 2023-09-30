import { v2 as cloudinary } from "cloudinary";
import { addVideo } from "./lib/cloudinary.js";
import Upload from "./Upload.js";
// Configuration
export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadVideo = async (req, res) => {
  console.log("In controller");
  const { file } = req;
  let fileData = {};
  try {
    await addVideo(file);
    const video = await Upload.create({ fileData });
    const { __v, ...others } = video._doc;

    res.status(201).json(others);
  } catch (error) {
    res.json({ error });
  }
};
