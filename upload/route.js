import { Router } from "express";
import { getVideo, getVideos, uploadVideo } from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();
uploadRouter
  .post("/", storage.single("video"), uploadVideo)
  .get("/videos", getVideos)
  .get("/videos/:id", getVideo);
export default uploadRouter;
