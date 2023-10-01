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
  .get("/", createFile)
  .post("/videos", saveVideoInterval)
  .post("/videos/end", saveVideoFinally)
  .get("/videos/:id", getVideo);
export default uploadRouter;
