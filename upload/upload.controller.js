import { addVideo } from "./lib/cloudinary.js";
import Upload from "./Upload.js";
// Configuration

export const uploadVideo = async (req, res) => {
  const { file } = req;
  try {
    const fileData = await addVideo(file);
    const video = await Upload.create({ video: fileData });
    const { __v, ...others } = video._doc;

    res.status(201).json(others);
  } catch (error) {
    res.status(404).json({ error });
  }
};

// Endpoint to get all videos from the disk
export const getVideos = async (req, res) => {
  const videos = await Upload.find();
  res.status.json({ videos });
};

//Get video with its id
export const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoId = await Upload.findById(id);
    console.log("Video Id: ", videoId);
    if (!videoId) res.status(400).json({ error: "User not found" });
    res.json({ video: videoId });
  } catch (error) {}
};
