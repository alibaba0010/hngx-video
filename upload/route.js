import { Router } from "express";
import { uploadVideo } from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();
uploadRouter.post("/", storage.single("video"), uploadVideo);
export default uploadRouter;
