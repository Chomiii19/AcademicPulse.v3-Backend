"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExpiredHandler = exports.jwtErrorHandler = void 0;
var appError_1 = __importDefault(require("./appError"));
var jwtErrorHandler = function () {
    return new appError_1.default("Invalid token. Please login again.", 401);
};
exports.jwtErrorHandler = jwtErrorHandler;
var tokenExpiredHandler = function () {
    return new appError_1.default("Your token has expired. Please login again.", 401);
};
exports.tokenExpiredHandler = tokenExpiredHandler;
