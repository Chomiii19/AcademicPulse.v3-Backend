"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdLimiter = exports.userLimiter = exports.limiter = void 0;
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again after an hour!",
});
exports.limiter = limiter;
var userLimiter = (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again after an hour!",
});
exports.userLimiter = userLimiter;
var validateIdLimiter = (0, express_rate_limit_1.default)({
    max: 1,
    windowMs: 1000,
    message: "Too many request from this IP, please try again!",
});
exports.validateIdLimiter = validateIdLimiter;
