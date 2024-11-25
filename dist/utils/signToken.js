"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var signToken = function (payload, expiresIn) {
    return jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
        expiresIn: expiresIn,
    });
};
exports.default = signToken;
