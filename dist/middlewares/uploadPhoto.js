"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var appError_1 = __importDefault(require("../errors/appError"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = path_1.default.resolve(process.cwd(), "dev-data/img/");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9));
        cb(null, "".concat(uniqueSuffix, "-").concat(file.originalname));
    },
});
var fileFilter = function (req, file, cb) {
    var allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default("Invalid file type!", 400));
    }
};
var uploadPhoto = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
}).single("file");
exports.default = uploadPhoto;
