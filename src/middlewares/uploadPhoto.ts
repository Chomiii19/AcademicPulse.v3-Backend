import multer from "multer";
import fs from "fs";
import path from "path";
import AppError from "../errors/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), "dev-data/img/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
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
    "image/jpg",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type!", 400));
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter,
}).single("file");

export default uploadPhoto;
