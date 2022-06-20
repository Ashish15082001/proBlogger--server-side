const multer = require("multer");

const fileFilter = function (req, file, cb) {
  switch (file.mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      console.log("wow");
      cb(null, true);
      break;
    default:
      cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

module.exports = { fileFilter, storage };
