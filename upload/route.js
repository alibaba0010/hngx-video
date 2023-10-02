import { Router } from "express";
import {
  createFile,
  getVideo,
  saveVideoInterval,
  saveVideoFinally,
  getSrtFile,
} from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();

uploadRouter
  .get("/", createFile)
  .post("/videos", storage.single("file"), saveVideoInterval)
  .post("/videos/end", saveVideoFinally)
  .get("/videos/:id", getVideo)
  .get("/srt/:id", getSrtFile);
export default uploadRouter;
