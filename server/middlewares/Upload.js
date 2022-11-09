const multer = require("multer");
const { resolve } = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve("./uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = upload;
