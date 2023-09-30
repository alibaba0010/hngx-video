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

app
  .use(json())
  .use("/upload", express.static((__dirname, "./uploads")))
  .use("/", uploadRouter);

const PORT = process.env.PORT || 2001;
(async () => {
  await connectDB(uri);
  app.listen(PORT, () =>
    console.log(`Listening to port @ http://localhost:${PORT}`)
  );
})();
