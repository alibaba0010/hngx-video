import { addVideo } from "./lib/cloudinary.js";
import Upload from "./Upload.js";
// Configuration

export const uploadVideo = async (req, res) => {
  const { file } = req;
  try {
    const fileData = await addVideo(file);
    console.log("File data: ", fileData);
    const video = await Upload.create({ video: fileData });
    console.log("Video: ", video);
    const { __v, ...others } = video._doc;

    res.status(201).json(others);
  } catch (error) {
    res.status(404).json({ error });
  }
};
