import { Router } from "express";
import {
  createFile,
  getVideo,
  saveVideoInterval,
  saveVideoFinally,
  hello,
} from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();
uploadRouter
  .get("/here", hello)
  .post("/", createFile)
  .post("/videos", saveVideoInterval) //storage.single("video"),
  .post("/videos/end", saveVideoFinally)
  .get("/videos/:id", getVideo);
export default uploadRouter;
