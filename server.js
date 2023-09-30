import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit file size to 100MB (adjust as needed)
}).single("video"); // 'video' should match the name attribute in the form input

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Handle video upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading file.');
        } else {
            const videoPath = req.file.path;
            // You can save the videoPath to a database if needed
            // For now, just send the path to the client for playing the video
            res.send(`<video width="640" height="360" controls><source src="${videoPath}" type="video/mp4">Your browser does not support the video tag.</video>`);
        }
    });
});

app.use(json()).use("/uploads", express.static((__dirname, "uploads")));

const PORT = process.env.PORT || 2001;
(async () => {
  app.listen(PORT, () =>
    console.log(`Listening to port @ http://localhost:${PORT}`)
  );
})();
