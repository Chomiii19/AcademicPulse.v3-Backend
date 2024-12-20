"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var appError_1 = __importDefault(require("./errors/appError"));
var globalErrorHandler_1 = __importDefault(require("./controllers/globalErrorHandler"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var appRoutes_1 = __importDefault(require("./routes/appRoutes"));
var protect_1 = __importDefault(require("./middlewares/protect"));
var server_1 = __importDefault(require("./server"));
var app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: ["".concat(process.env.APP_ORIGIN)],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", function (req, res, next) {
    req.io = server_1.default;
    next();
});
app.use("/api/v1", authRoutes_1.default);
app.get("/api/v1/refresh", function (req, res) {
    console.log("hello:", req.cookies);
    res.send(req.cookies);
});
app.use("/api/v1/user", protect_1.default, userRoutes_1.default);
app.use("/api/v1/app", protect_1.default, appRoutes_1.default);
app.all("*", function (req, res, next) {
    return next(new appError_1.default("Can't find ".concat(req.originalUrl, " from the server"), 404));
});
app.use(globalErrorHandler_1.default);
exports.default = app;
