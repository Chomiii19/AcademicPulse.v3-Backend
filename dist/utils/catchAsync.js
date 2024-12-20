"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var catchAsync = function (fn) {
    return function (req, res, next) {
        return fn(req, res, next).catch(function (err) { return next(err); });
    };
};
exports.default = catchAsync;
