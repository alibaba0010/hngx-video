import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import uploadRouter from "./upload/route.js";
dotenv.config();

const app = express();
const uri = process.env.MONGO_URL;

app
  .use(
    cors()
    // {
    //   origin: "http://127.0.0.1:5500",
    // })
  )
  .use(json())
  .use("/", uploadRouter);

const PORT = process.env.PORT || 2001;
(async () => {
  await connectDB(uri);
  app.listen(PORT, () =>
    console.log(`Listening to port @ http://localhost:${PORT}`)
  );
})();
