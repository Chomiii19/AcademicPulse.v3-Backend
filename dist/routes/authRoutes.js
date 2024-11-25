"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userAuthentication_1 = require("../controllers/userAuthentication");
var router = express_1.default.Router();
router.route("/login").post(userAuthentication_1.login);
router.route("/signup").post(userAuthentication_1.signup);
router.route("/verify/:token").get(userAuthentication_1.verifyUserAccount);
router.route("/signout").get(userAuthentication_1.signout);
exports.default = router;
