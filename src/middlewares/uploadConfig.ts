import multer from "multer";
// import { fileURLToPath } from "url";
import path from "path";
import AppError from "../errors/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), "src/dev-data/data/"));
    console.log(path.resolve(process.cwd(), "src/dev-data/data/"));
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = function (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type!", 400));
  }
};

const uploadConfig = multer({
  storage,
  fileFilter,
}).single("file");

export default uploadConfig;
