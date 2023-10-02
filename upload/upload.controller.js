import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import Upload from "./Upload.js";
import busboy from "busboy";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";
const fffmegPath = ffmpegPath.path;
ffmpeg.setFfmpegPath(fffmegPath);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

let videoChunks = [];
let videoId;
const count = 1;

const convert2audio = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .audioCodec("pcm_s16le")
      .toFormat("wav")
      .on("end", () => {
        console.log("Conversion complete");
        resolve();
      })
      .on("error", (err) => {
        console.log("Conversion error", err);
        reject(err);
      })
      .run();
  });
};

export const createFile = async (req, res) => {
  videoChunks = [];
  const id = uuidv4();
  const videoID = await Upload.create({ id });
  videoId = videoID.id;
  console.log("Video Id: ", videoId);
  res.status(201).json({ videoId });
};

async function transcribe(videoPath, id) {
  if (!fs.existsSync(`${videoPath}.wav`)) {
    const filePath = `${videoPath}.webm`;

    await convert2audio(videoPath, `${videoPath}.wav`)
      .then(() => {
        console.log("Conversion successfull");
      })
      .catch((err) => {
        console.log("An error occured: ", err);
      });

    const audioFile = {
      buffer: fs.readFileSync(`${videoPath}.wav`),
      mimetype: "audio/wav",
    };

    const transData = await deepgram.transcription.preRecorded(audioFile, {
      punctuation: true,
      utterances: true,
    });
    const srtTranscript = await transData.toSRT();
    await fs.writeFileSync(`${videoPath}.srt`, srtTranscript, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("Done!!!");
      }
    });
  }
}
const saveVideoChunks = async (req, res, sta = true) => {
  try {
    const bb = busboy({ headers: req.headers });
    console.log("BB: ", bb);
    const fileData = req.file;
    console.log("Req: ", req);
    console.log("Request: ", req.file);
    console.log("File Data: ", fileData);
    videoChunks.push(fileData.buffer);

    if (sta) {
      res.status(201).json({
        msg: `${count} Chunk collected`,
        videoID,
      });
      count++;

      console.log("Video chunk loaded: ", videoChunks);
    }
  } catch (error) {
    throw new Error("Invlaid file");
  }
};

export const saveVideoInterval = async (req, res) => {
  try {
    console.log("In interval");
    await saveVideoChunks(req, res);
    res.status(201).json({ message: "Video Uploaded" });
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const saveVideoFinally = async (req, res) => {
  await saveVideoChunks(req, res, (sta = false));
  const videoBuffer = Buffer.concat(videoChunks);
  const folderPath = path.join(__dirname, "../videos", `${videoId}.webm`);
  const videoPath = folderPath + ".webm";
  console.log("VIdeo Path: ", videoPath);
  await fs.writeFileSync(videoPath, videoBuffer);

  videoChunks = [];
  console.log("Save All with id: ", videoId);
  await transcribe(folderPath, videoId);
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

    videoStream.pipe(res);
  } catch (error) {}
};

export const getSrtFile = async (req, res) => {
  const { id } = req.params;
  await fs.readFile(
    path.resolve(__dirname, `../videos/${id}.srt`),
    "utf8",
    (err, data) => {
      if (err) {
        throw new NotFoundError("File cannot be found");
      }

      res.status(200).send(data);
    }
  );
};
