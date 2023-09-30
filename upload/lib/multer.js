import multer, { diskStorage } from "multer";
import { extname, join } from "path";

export default multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      console.log("In uploads: ", file);
      cb(null, "../../videos");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = extname(file.originalname);
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
