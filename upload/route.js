import { Router } from "express";
import { uploadVideo } from "./upload.controller.js";
import storage from "./lib/multer.js";
const uploadRouter = Router();
uploadRouter.post("/", storage.single("file"), uploadVideo);
export default uploadRouter;
