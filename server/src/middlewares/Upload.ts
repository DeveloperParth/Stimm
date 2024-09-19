import multer from "multer";
import { resolve } from "path";
const storage = multer.diskStorage({
  destination: function (_req, _, cb) {
    cb(null, resolve("./uploads"));
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

export default upload;
