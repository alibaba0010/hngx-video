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

app.use(json()).use("/uploads", async (req, res) => {
  res.sendFile(express.static((__dirname, "index.html")));
});
const PORT = process.env.PORT || 2001;
(async () => {
  app.listen(PORT, () =>
    console.log(`Listening to port @ http://localhost:${PORT}`)
  );
})();
