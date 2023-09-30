import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./db.js";
import uploadRouter from "./upload/route.js";
import fs from "fs";
dotenv.config();

const app = express();
const uri = process.env.MONGO_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint to get all videos from the disk
app.get("/videos", (req, res) => {
  // Directory where videos are uploaded
  const directory = "./uploads";

  // Read the contents of the directory
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Error reading directory.");
    } else {
      // Filter out non-video files (for demonstration purposes, assuming videos have .mp4 extension)
      const videoFiles = files.filter((file) => path.extname(file) === ".mp4");

      // Send the list of video files to the client
      res.json(videoFiles);
    }
  });
});
app
  .use(json())
  .use("/uploads", express.static((__dirname, "uploads")))
  .use("/", uploadRouter);

const PORT = process.env.PORT || 2001;
(async () => {
  await connectDB(uri);
  app.listen(PORT, () =>
    console.log(`Listening to port @ http://localhost:${PORT}`)
  );
})();
