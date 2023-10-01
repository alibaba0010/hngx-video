import { Router } from "express";
import {
  createFile,
  getVideo,
  saveVideoInterval,
  saveVideoFinally,
} from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();

uploadRouter
  .post("/", createFile)
  .post("/videos", saveVideoInterval) //storage.single("video"),
  .post("/videos/end", saveVideoFinally)
  .get("/videos/:id", getVideo);
export default uploadRouter;
