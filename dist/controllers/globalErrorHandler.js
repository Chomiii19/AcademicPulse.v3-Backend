"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandlers = __importStar(require("../errors/errorHandlers"));
var sendDevError = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
var sendProdError = function (err, res) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    console.log("ERROR: ", err);
    res.status(500).json({
        status: "Error",
        message: "Something went wrong!",
    });
};
exports.default = (function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development")
        sendDevError(err, res);
    if (process.env.NODE_ENV === "production") {
        var error = __assign({}, err);
        if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError")
            error = errorHandlers.tokenExpiredHandler();
        if ((error === null || error === void 0 ? void 0 : error.name) === "JsonWebTokenError")
            error = errorHandlers.jwtErrorHandler();
        sendProdError(error, res);
    }
});