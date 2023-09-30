import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../videos"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".jpeg" &&
      ext !== ".jpg" &&
      ext !== ".png"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
// export const storage = multer.diskStorage({
//   destination: (req, file, cb) => {}
// })
