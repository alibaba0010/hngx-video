import Upload from "./Upload.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import ffmpeg from "ffmpeg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

let videoChunks = [];
let videoId;
export const hello = (req, res) => {
  res.status(200).json({ message: "Hello WOrld" });
};
export const createFile = async (req, res) => {
  videoChunks = [];
  id = uuidv4();
  videoId = await Upload.create({ id });
  console.log("http://127.0.0.1:5500/: ", videoId);
  res.status(201).json({ videoId });
};

async function transcribe(videoPath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(videoPath), //file path
    model: "whisper-1",
  });

  console.log(transcription.text);

  return transcription;
}
const saveVideoChunks = async (req, res) => {
  let chunk = [];

  await req.on("data", (data) => {
    chunk.push(data);
    videoChunks.push(Buffer.concat(chunk));
  });
  console.log("Video chunk loaded: ", videoChunks);
};

export const saveVideoInterval = async (req, res) => {
  try {
    await saveVideoChunks(req, res);
    res.status(201).json({ message: "Video Uploaded" });
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const saveVideoFinally = async (req, res) => {
  await saveVideoChunks(req, res);
  const videoBuffer = Buffer.concat(videoChunks);
  const videoPath = path.join(__dirname, "../videos", `${videoId}.webm`);
  console.log("VIdeo Path: ", videoPath);
  fs.writeFileSync(videoPath, videoBuffer);

  videoChunks = [];
  console.log("Video Id: ", videoId);
  res.status(200).json({ msg: "Video stopped", videoId });
};

//Get video with its id
export const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { range } = req.headers;
    const videoPath = path.join(__dirname, `../videos/${id}.webm`);
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB;
    const start = Number(range.replace(/\D/g, ""));
    //send to client
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    ffmpeg(`-hide_banner -y -i ${videoPath} ${videoPath}.wav`);

    const audioFile = {
      buffer: fs.readFileSync(`${videoPath}.wav`),
      mimeType: "audio/wav",
    };
    console.log("Audio file: " + audioFile);
    const transcription = await transcribe(audioFile);

    // Stream the video chunk to the client
    res.json({
      status: "Video play successfully",
      videoPath: `../videos/${id}.webm`,
      transcription: transcription.results,
    });
    videoStream.pipe(res);
  } catch (error) {}
};
