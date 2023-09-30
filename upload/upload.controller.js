import { addVideo } from "./lib/cloudinary.js";
import Upload from "./Upload.js";
// Configuration

export const uploadVideo = async (req, res) => {
  console.log("In controller:", req.file);
  const { file } = req;
  let fileData = {};
  try {
    await addVideo(file);
    const video = await Upload.create({ fileData });
    console.log("Video: ", video);
    const { __v, ...others } = video._doc;

    res.status(201).json(others);
  } catch (error) {
    res.status(404).json({ error });
  }
};
