"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protectedPage = function (req, res, next) {
    var user = { userId: req.user.id, role: req.user.role, isSignedIn: true };
    res.status(200).json({
        status: "Success",
        data: { user: user },
    });
};
exports.default = protectedPage;
