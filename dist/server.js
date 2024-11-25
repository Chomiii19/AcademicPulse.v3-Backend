"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var app_1 = __importDefault(require("./app"));
var server = http_1.default.createServer(app_1.default);
var io = new socket_io_1.Server(server);
dotenv_1.default.config();
var PORT = process.env.PORT;
app_1.default.use(function (req, res, next) {
    req.io = io;
    next();
});
io.on("connection", function (socket) {
    console.log("Client is connected to backend", socket.id);
    socket.on("disconnect", function () {
        console.log("A user disconnected:", socket.id);
    });
});
server.listen(PORT, function () { return console.log("Server is listening on port ", PORT); });
